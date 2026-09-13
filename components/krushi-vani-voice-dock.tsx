'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  X,
  Languages,
  ArrowRight,
  Bot,
  Compass,
} from 'lucide-react';

interface VoiceIntent {
  keywords: string[];
  responseEn: string;
  responseMr: string;
  responseHi: string;
  redirectUrl?: string;
}

const VOICE_INTENTS: VoiceIntent[] = [
  {
    keywords: ['auction', 'bid', 'bidding', 'लिलाव', 'बोली'],
    responseEn: 'Opening Live Mandi Bidding Floor. Tomatoes currently leading at ₹38.50 per kg.',
    responseMr: 'थेट लिलाव कक्ष उघडत आहे. नाशिक टोमॅटो सध्या ३८ रुपये ५० पैसे प्रति किलो दराने आघाडीवर आहे.',
    responseHi: 'लाइव मंडी नीलामी फ्लोर खुल रहा है। टमाटर की बोली 38.50 रुपये प्रति किलो चल रही है।',
    redirectUrl: '/auction',
  },
  {
    keywords: ['fleet', 'truck', 'gps', 'reefer', 'वाहतूक', 'गाडी', 'ट्रक'],
    responseEn: 'Opening Reefer Fleet Telematics Radar. 4 refrigerated corridors active across Maharashtra.',
    responseMr: 'रेफ्रिजरेटेड वाहतूक रडार उघडत आहे. ४ मुख्य कॉरिडॉर सध्या सुरू आहेत.',
    responseHi: 'रीफर कोल्ड-चेन फ्लीट रडार खुल रहा है। सभी 4 गाड़ियां सुरक्षित तापमान पर हैं।',
    redirectUrl: '/fleet-radar',
  },
  {
    keywords: ['satellite', 'soil', 'ndvi', 'sensor', 'जमीन', 'शेती', 'माती'],
    responseEn: 'Opening Satellite Soil & NDVI Sensor Radar. Plot 142/B moisture at 48% optimal.',
    responseMr: 'सॅटेलाइट जमीन व पीक रडार उघडत आहे. गट क्र. १४२/ब ची माती आर्द्रता ४८% उत्तम आहे.',
    responseHi: 'सैटेलाइट सॉइल व एनडीवीआई सेंसर रडार खुल रहा है। खेत की मिट्टी में 48% नमी है।',
    redirectUrl: '/field-sensor',
  },
  {
    keywords: ['grade', 'quality', 'scanner', 'तपासणी', 'प्रतवारी', 'क्वालिटी'],
    responseEn: 'Launching AI Produce Quality Grading Studio. Prepare your harvest photo.',
    responseMr: 'एआय पीक प्रतवारी कॅमेरा सुरू करत आहे. तुमच्या मालाचा फोटो तयार ठेवा.',
    responseHi: 'एआई फसल ग्रेडिंग स्टूडियो खुल रहा है। अपनी फसल की फोटो अपलोड करें।',
    redirectUrl: '/crop-grading',
  },
  {
    keywords: ['rate', 'price', 'mandi', 'भाव', 'दर', 'मार्केट'],
    responseEn: 'Nashik APMC Tomato modal rate is ₹28 per kg, direct farmgate price is ₹38.50 per kg.',
    responseMr: 'नाशिक बाजार समितीमध्ये टोमॅटो भाव २८ रुपये आहे, किसानडायरेक्ट थेट भाव ३८ रुपये ५० पैसे आहे.',
    responseHi: 'नासिक मंडी में टमाटर का भाव 28 रुपये है, जबकि किसानडायरेक्ट पर 38.50 रुपये मिल रहा है।',
    redirectUrl: '/marketplace',
  },
];

export default function KrushiVaniVoiceDock() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState<'mr-IN' | 'hi-IN' | 'en-IN'>('mr-IN');
  const [transcript, setTranscript] = useState<string>('');
  const [replyText, setReplyText] = useState<string>('');
  const [actionUrl, setActionUrl] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = voiceLang;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);

          if (event.results[current].isFinal) {
            handleVoiceCommand(text);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [voiceLang]);

  const speakAloud = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voiceLang;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceCommand = (spokenText: string) => {
    const lower = spokenText.toLowerCase();
    let matched = false;

    for (const intent of VOICE_INTENTS) {
      if (intent.keywords.some((kw) => lower.includes(kw))) {
        matched = true;
        const reply =
          voiceLang === 'mr-IN'
            ? intent.responseMr
            : voiceLang === 'hi-IN'
            ? intent.responseHi
            : intent.responseEn;

        setReplyText(reply);
        speakAloud(reply);
        if (intent.redirectUrl) {
          setActionUrl(intent.redirectUrl);
          setTimeout(() => {
            router.push(intent.redirectUrl!);
          }, 2000);
        }
        break;
      }
    }

    if (!matched) {
      const defaultReply =
        voiceLang === 'mr-IN'
          ? `मी ऐकले: "${spokenText}". तुम्ही थेट लिलाव, वाहतूक, किंवा आजचे बाजारभाव विचारू शकता.`
          : voiceLang === 'hi-IN'
          ? `मैंने सुना: "${spokenText}". आप मंडी भाव, नीलामी फ्लोर या ट्रक ट्रैकिंग पूछ सकते हैं।`
          : `Heard: "${spokenText}". Ask me for Mandi rates, live auction, or fleet radar.`;
      setReplyText(defaultReply);
      speakAloud(defaultReply);
    }
  };

  const toggleListening = () => {
    if (!isOpen) setIsOpen(true);

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setReplyText('');
      setActionUrl(null);
      try {
        recognitionRef.current?.start();
      } catch {
        // Safe fallback if already started
      }
    }
  };

  return (
    <>
      {/* Floating Glowing Trigger Capsule (Bottom Right) */}
      <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40">
        {!isOpen ? (
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              toggleListening();
            }}
            className="group flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-2xl border-2 border-white/20 transition transform hover:scale-105 active:scale-95"
            title="KrushiVani Voice Assistant"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
            </span>
            <Mic className="w-4 h-4" />
            <span className="text-xs font-black tracking-wide font-mono">
              KrushiVani &bull; कृषीवाणी
            </span>
          </button>
        ) : (
          /* Expanded Voice Dock Panel */
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl max-w-sm w-[calc(100vw-2rem)] space-y-4 animate-in slide-in-from-bottom-4 duration-200 ring-1 ring-black/10">
            {/* Dock Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-black text-xs text-slate-900 dark:text-white block">
                    KrushiVani &bull; Multilingual Voice AI
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Speak in Marathi, Hindi or English
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Language Switcher */}
                <select
                  value={voiceLang}
                  onChange={(e) => setVoiceLang(e.target.value as any)}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold py-1 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 outline-none"
                >
                  <option value="mr-IN">मराठी</option>
                  <option value="hi-IN">हिंदी</option>
                  <option value="en-IN">English</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    recognitionRef.current?.stop();
                    setIsOpen(false);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Animated Audio Waveform */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-3">
              <div className="flex items-center justify-center gap-1.5 h-10">
                {[12, 24, 38, 20, 32, 16, 28, 36, 14, 26].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1.5 rounded-full transition-all duration-150 ${
                      isListening ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700 h-2'
                    }`}
                    style={{
                      height: isListening ? `${h + (i % 3) * 4}px` : '6px',
                      animationDelay: `${i * 0.08}s`,
                    }}
                  />
                ))}
              </div>

              <div className="text-xs font-mono text-slate-300">
                {isListening
                  ? voiceLang === 'mr-IN'
                    ? 'मी ऐकत आहे... बोला (उदा. "टोमॅटो भाव", "थेट लिलाव")'
                    : 'Listening... Speak your command'
                  : 'Tap Mic to speak'}
              </div>
            </div>

            {/* Transcript & Response Area */}
            {transcript && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1 border border-slate-200/70 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono font-bold block">
                  You Said:
                </span>
                <p className="font-semibold text-slate-900 dark:text-white leading-tight">
                  &ldquo;{transcript}&rdquo;
                </p>
              </div>
            )}

            {replyText && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-xs space-y-2 border border-emerald-300/80 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200">
                <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>KrushiVani Response:</span>
                </div>
                <p className="text-[11px] leading-relaxed">{replyText}</p>
                {actionUrl && (
                  <button
                    type="button"
                    onClick={() => router.push(actionUrl)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase font-mono tracking-wider underline underline-offset-2"
                  >
                    <span>Jump to Destination &rarr;</span>
                  </button>
                )}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={toggleListening}
                className={`flex-1 py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-sm ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isListening ? 'Stop Listening' : 'Start Speaking'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
