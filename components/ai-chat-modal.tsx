'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RefreshCw,
  Copy,
  Check,
  Globe,
  HelpCircle,
  Sprout,
  ChevronDown,
  ArrowRight,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  AlertCircle,
  Share2,
  KeyRound,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { getGeminiAuthHeaders } from '@/lib/ai/gemini-key-storage';
import GeminiKeyModal from '@/components/gemini-key-modal';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  provider?: string;
}

function formatInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|₹\d+(?:\.\d+)?(?:\/(?:kg|quintal|crate|tonne))?)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-black text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('₹')) {
      return (
        <span key={i} className="font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-1.5 py-0.5 rounded font-mono text-[11px] inline-block border border-emerald-200 dark:border-emerald-800/60">
          {part}
        </span>
      );
    }
    return part;
  });
}

function renderAiMarkdown(content: string) {
  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 leading-relaxed text-xs">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Header ### or ##
        if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
          const text = trimmed.replace(/^#+\s*/, '');
          return (
            <h5 key={idx} className="font-black text-xs text-emerald-800 dark:text-emerald-300 mt-2 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>{formatInlineMarkdown(text)}</span>
            </h5>
          );
        }

        // Bullet point
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const text = trimmed.replace(/^[-•*]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1 text-slate-700 dark:text-stone-300">
              <span className="text-emerald-600 font-bold shrink-0 mt-0.5">&bull;</span>
              <span>{formatInlineMarkdown(text)}</span>
            </div>
          );
        }

        // Numbered list: 1. 2.
        const numMatch = trimmed.match(/^(\d+)\.\s*(.+)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 text-slate-700 dark:text-stone-300">
              <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                {numMatch[1]}
              </span>
              <span>{formatInlineMarkdown(numMatch[2])}</span>
            </div>
          );
        }

        // Callout or quote
        if (trimmed.startsWith('> ')) {
          return (
            <div key={idx} className="border-l-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 p-2 rounded-r-lg text-[11px] font-medium text-emerald-900 dark:text-emerald-200 my-1">
              {formatInlineMarkdown(trimmed.replace(/^>\s*/, ''))}
            </div>
          );
        }

        return (
          <p key={idx} className="text-slate-700 dark:text-stone-300">
            {formatInlineMarkdown(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

const QUICK_PROMPTS = [
  { label: '🍅 Tomato APMC Rate', query: 'What is today’s APMC Mandi price for Tomato in Pune?' },
  { label: '🧅 Lasalgaon Onion Trends', query: 'What are the current onion arrivals and price trends in Lasalgaon?' },
  { label: '💰 How KisanDirect Saves 25%', query: 'How does KisanDirect eliminate middlemen and save 25% for buyers?' },
  { label: '🌾 Rabi Wheat Sowing Guide', query: 'Suggest best sowing practices and farmgate price targets for Sharbati Wheat.' },
  { label: '🏛️ PM-KISAN Subsidies', query: 'What are the benefits and eligibility under PM-KISAN and Namo Shetkari schemes?' },
];

export default function AiChatModal() {
  const { language: appLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'mr' | 'hi'>(appLang || 'en');
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  
  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Sync with app language
  useEffect(() => {
    if (appLang) {
      setLanguage(appLang);
    }
  }, [appLang]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `🌱 **Namaste! I am KrushiMitra (कृषि मित्र) AI**, your agricultural intelligence assistant.\n\nI can help you with:\n• **Live APMC Mandi Prices** across Maharashtra\n• **Direct Farmgate Selling Advice** & Pricing\n• **Government Schemes** (PM-KISAN, PMFBY)\n• **Kharif & Rabi Crop Agronomy**\n\n🎤 *You can tap the microphone to speak, or tap the speaker icon to listen to replies in English, मराठी, or हिन्दी!*`,
      timestamp: 'Just now',
      provider: 'Google Gemini 3.6 Flash (Live Cloud AI)',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  // Preload voices in browser
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Speech Recognition (Voice Input)
  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    if (typeof window === 'undefined') return;

    // Check Secure Context on mobile
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!window.isSecureContext && !isLocal) {
      setVoiceNotice(
        language === 'mr'
          ? 'मोबाईल ब्राऊझर सुरक्षेमुळे मायक्रोफोन फक्त HTTPS किंवा localhost वर चालतो. लॅपटॉपवर http://localhost:3000 वर चाचणी करा.'
          : language === 'hi'
          ? 'मोबाइल ब्राउज़र सुरक्षा के कारण माइक्रोफोन केवल HTTPS या localhost पर काम करता है। लैपटॉप पर http://localhost:3000 पर आज़माएं।'
          : 'Mobile browsers restrict microphone access to HTTPS or localhost. Please test on laptop at http://localhost:3000 or enable Chrome insecure origin flag.'
      );
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceNotice(
        language === 'mr'
          ? 'तुमच्या ब्राऊझरमध्ये व्हॉइस इनपुट समर्थित नाही. कृपया Google Chrome वापरा.'
          : language === 'hi'
          ? 'आपके ब्राउज़र में वॉइस इनपुट समर्थित नहीं है। कृपया Google Chrome उपयोग करें।'
          : 'Speech recognition is not supported in this browser. Please use Chrome.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;

      // Locale mapping
      recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice(null);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInput(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setVoiceNotice(
            language === 'mr'
              ? 'मायक्रोफोन परवानगी नाकारली गेली आहे. कृपया ब्राऊझर सेटिंग्जमध्ये परवानगी द्या.'
              : language === 'hi'
              ? 'माइक्रोफोन अनुमति अस्वीकृत है। कृपया ब्राउज़र में अनुमति दें।'
              : 'Microphone permission was denied. Please allow mic in browser settings.'
          );
        } else if (event.error !== 'no-speech') {
          setVoiceNotice(`Speech error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to initialize speech recognition', err);
      setIsListening(false);
      setVoiceNotice('Could not initialize microphone. Please check permissions.');
    }
  };

  // Text-To-Speech (Voice Output)
  const toggleSpeakMessage = (text: string, messageId: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    // Cancel previous utterance
    window.speechSynthesis.cancel();

    // Strip markdown formatting for cleaner speech
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/•/g, '')
      .replace(/🌱|🍅|🧅|💰|🌾|🏛️|⚡|📦|✅|⚠️|🎤|👉|🔹/g, '')
      .trim();

    // Chromium speech cancellation delay fix
    setTimeout(() => {
      try {
        window.speechSynthesis.resume();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Try to match available voices
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const target = language === 'mr' ? 'mr' : language === 'hi' ? 'hi' : 'en';
          const matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(target));
          if (matchedVoice) {
            utterance.voice = matchedVoice;
          }
        }

        utterance.onend = () => {
          setSpeakingMessageId(null);
        };

        utterance.onerror = (e) => {
          console.warn('Speech synthesis error:', e);
          setSpeakingMessageId(null);
        };

        setSpeakingMessageId(messageId);
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error('Speech synthesis failure:', err);
        setSpeakingMessageId(null);
      }
    }, 80);
  };

  const handleSend = async (customQuery?: string) => {
    const textToSend = customQuery || input;
    if (!textToSend.trim() || loading) return;

    if (speakingMessageId && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }

    // Stop voice if still active
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customQuery) setInput('');
    setLoading(true);

    try {
      const chatHistory = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const headers = getGeminiAuthHeaders({ 'Content-Type': 'application/json' });
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: chatHistory,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.reply || 'I am here to assist with your agricultural inquiry.',
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          provider: data.provider,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error('API response failed');
      }
    } catch (err) {
      console.warn('Chat request interrupted:', err);
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ Could not reach AI service right now. Please verify your connection or check APMC rates via the top banner.`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `🌱 Chat refreshed! What agricultural or mandi price questions can I answer for you?`,
        timestamp: 'Just now',
        provider: 'Google Gemini 3.6 Flash (Live Cloud AI)',
      },
    ]);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open KrushiMitra AI Assistant"
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-xl shadow-emerald-900/30 hover:shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          {/* Glowing Ping */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400"></span>
          </span>

          <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          <span className="hidden sm:inline font-black text-xs tracking-tight">KrushiMitra AI</span>
          <span className="hidden sm:inline text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase font-bold text-emerald-100">
            Voice & Chat
          </span>
        </button>
      </div>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 sm:bottom-20 right-2 sm:right-6 z-50 w-[96vw] sm:w-[440px] max-h-[82vh] h-[640px] bg-white dark:bg-stone-900 rounded-3xl border border-emerald-100 dark:border-stone-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-400 p-0.5 shadow-md">
                <div className="w-full h-full bg-emerald-950 rounded-[14px] flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm tracking-tight text-white">KrushiMitra AI</h3>
                  <span className="text-[9px] bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded-full font-bold uppercase">
                    Voice AI
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/80">Agricultural & Mandi Voice Advisor</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setKeyModalOpen(true)}
                title="Configure Google Gemini API Key"
                className="text-[10px] flex items-center gap-1 bg-white/10 hover:bg-white/20 text-emerald-200 px-2 py-1 rounded-xl border border-white/20 font-mono transition"
              >
                <KeyRound className="w-3 h-3 text-emerald-300" />
                <span>AI Key</span>
              </button>
              <button
                onClick={clearChat}
                title="Clear Chat"
                className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Language Selector Bar */}
          <div className="bg-emerald-50/80 dark:bg-stone-800/80 border-b border-emerald-100 dark:border-stone-700 px-4 py-1.5 flex items-center justify-between text-xs">
            <span className="text-[11px] text-emerald-900 dark:text-emerald-300 font-bold flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>Language:</span>
            </span>
            <div className="flex items-center gap-1">
              {(
                [
                  { code: 'en', label: 'English' },
                  { code: 'mr', label: 'मराठी' },
                  { code: 'hi', label: 'हिन्दी' },
                ] as const
              ).map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                    language === l.code
                      ? 'bg-emerald-700 text-white'
                      : 'text-emerald-800 dark:text-stone-300 hover:bg-emerald-200/60 dark:hover:bg-stone-700'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Notice / Insecure Context Banner */}
          {voiceNotice && (
            <div className="bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-800/60 px-4 py-2 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-tight">{voiceNotice}</div>
              <button
                onClick={() => setVoiceNotice(null)}
                className="text-amber-700 dark:text-amber-400 hover:text-amber-950"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#fcfdfa] dark:bg-stone-900">
            {messages.map((m) => {
              const isAssistant = m.role === 'assistant';
              const isSpeaking = speakingMessageId === m.id;
              return (
                <div key={m.id} className={`flex items-start gap-2.5 ${isAssistant ? '' : 'flex-row-reverse'}`}>
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      isAssistant
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                        : 'bg-slate-800 text-white'
                    }`}
                  >
                    {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[84%] space-y-1 ${isAssistant ? '' : 'text-right'}`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isAssistant
                          ? 'bg-white dark:bg-stone-800 border border-slate-200 dark:border-stone-700 text-slate-800 dark:text-stone-200 shadow-sm'
                          : 'bg-emerald-600 text-white font-medium rounded-br-sm'
                      }`}
                    >
                      {isAssistant ? (
                        renderAiMarkdown(m.content)
                      ) : (
                        <div className="whitespace-pre-wrap">{m.content}</div>
                      )}

                      {/* Message Actions */}
                      {isAssistant && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-stone-700 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="truncate max-w-[120px] font-mono text-[9px]">{m.provider || 'KrushiMitra AI'}</span>
                          <div className="flex items-center gap-2">
                            {/* WhatsApp Share */}
                            <button
                              type="button"
                              onClick={() => {
                                const text = `🌱 *KrushiMitra AI Advisory:*\n\n${m.content}\n\n_Generated via KisanDirect_`;
                                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                              }}
                              title="Share to WhatsApp"
                              className="hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-1 transition"
                            >
                              <Share2 className="w-3 h-3 text-emerald-600" />
                              <span>Share</span>
                            </button>

                            {/* Read Aloud Button */}
                            <button
                              type="button"
                              onClick={() => toggleSpeakMessage(m.content, m.id)}
                              title={isSpeaking ? 'Stop speaking' : 'Read aloud in voice'}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded transition ${
                                isSpeaking 
                                  ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold animate-pulse'
                                  : 'hover:text-emerald-700 dark:hover:text-emerald-400 bg-slate-50 dark:bg-stone-700/60'
                              }`}
                            >
                              {isSpeaking ? (
                                <>
                                  <VolumeX className="w-3 h-3 text-amber-600" />
                                  <span>Stop Voice</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3 h-3 text-emerald-600" />
                                  <span>Speak Out</span>
                                </>
                              )}
                            </button>

                            {/* Copy button */}
                            <button
                              type="button"
                              onClick={() => copyToClipboard(m.content, m.id)}
                              className="hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-1 transition"
                            >
                              {copiedId === m.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-600 font-bold">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-400 px-1">{m.timestamp}</span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white dark:bg-stone-800 border border-slate-200 dark:border-stone-700 rounded-2xl p-3 shadow-sm flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-stone-400 font-medium">Analyzing agronomy & mandi data...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Pills */}
          <div className="p-2.5 bg-slate-50/90 dark:bg-stone-800/80 border-t border-slate-200 dark:border-stone-700 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(prompt.query)}
                className="text-[10px] font-bold bg-white dark:bg-stone-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-stone-200 hover:text-emerald-800 dark:hover:text-emerald-300 border border-slate-200 dark:border-stone-600 hover:border-emerald-300 rounded-full px-2.5 py-1 whitespace-nowrap transition shadow-2xs"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Input Box with Voice Mic */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-stone-900 border-t border-slate-200 dark:border-stone-800 flex items-center gap-2"
          >
            {/* Microphone Toggle Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              title={isListening ? 'Stop listening' : 'Speak your question'}
              className={`p-2.5 rounded-2xl transition shrink-0 flex items-center justify-center ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30'
                  : 'bg-emerald-50 dark:bg-stone-800 hover:bg-emerald-100 dark:hover:bg-stone-700 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-stone-700'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isListening
                  ? (language === 'mr' ? 'ऐकत आहे... बोला...' : language === 'hi' ? 'सुन रहा हूँ... बोलिए...' : 'Listening... speak now...')
                  : (language === 'mr' ? 'भाव, लागवड किंवा योजना विचारा...' : language === 'hi' ? 'भाव, बुवाई या योजना पूछें...' : 'Ask crop prices, sowing advice, APMC...')
              }
              className={`flex-1 bg-slate-50 dark:bg-stone-800 border rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-stone-500 ${
                isListening ? 'border-red-400 ring-2 ring-red-400/30' : 'border-slate-300 dark:border-stone-700'
              }`}
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2.5 rounded-2xl shadow-md transition shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <GeminiKeyModal isOpen={keyModalOpen} onClose={() => setKeyModalOpen(false)} />
    </>
  );
}
