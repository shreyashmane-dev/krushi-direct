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
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  provider?: string;
}

const QUICK_PROMPTS = [
  { label: '🍅 Tomato APMC Rate', query: 'What is today’s APMC Mandi price for Tomato in Pune?' },
  { label: '🧅 Lasalgaon Onion Trends', query: 'What are the current onion arrivals and price trends in Lasalgaon?' },
  { label: '💰 How KisanDirect Saves 25%', query: 'How does KisanDirect eliminate middlemen and save 25% for buyers?' },
  { label: '🌾 Rabi Wheat Sowing Guide', query: 'Suggest best sowing practices and farmgate price targets for Sharbati Wheat.' },
  { label: '🏛️ PM-KISAN Subsidies', query: 'What are the benefits and eligibility under PM-KISAN and Namo Shetkari schemes?' },
];

export default function AiChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'mr' | 'hi'>('en');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `🌱 **Namaste! I am KrushiMitra (कृषि मित्र) AI**, your agricultural intelligence assistant.\n\nI can help you with:\n• **Live APMC Mandi Prices** across Maharashtra\n• **Direct Farmgate Selling Advice** & Pricing\n• **Government Schemes** (PM-KISAN, PMFBY)\n• **Kharif & Rabi Crop Agronomy**\n\nHow can I help you today? You can ask in English, मराठी, or हिन्दी!`,
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

  const handleSend = async (customQuery?: string) => {
    const textToSend = customQuery || input;
    if (!textToSend.trim() || loading) return;

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

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      console.error('Chat error:', err);
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
      <div className="fixed bottom-6 right-6 z-40">
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
            Gemini
          </span>
        </button>
      </div>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[94vw] sm:w-[440px] max-h-[82vh] h-[640px] bg-white rounded-3xl border border-emerald-100 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
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
                    Gemini 1.5
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/80">AI Agricultural & Mandi Price Advisor</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
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
          <div className="bg-emerald-50/80 border-b border-emerald-100 px-4 py-1.5 flex items-center justify-between text-xs">
            <span className="text-[11px] text-emerald-900 font-bold flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>Language:</span>
            </span>
            <div className="flex items-center gap-1">
              {(
                [
                  { code: 'en', label: 'English' },
                  { code: 'mr', label: 'मराठी' },
                  { code: 'hi', label: 'हिन्दी' },
                ] as const
              ).map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                    language === lang.code
                      ? 'bg-emerald-700 text-white'
                      : 'text-emerald-800 hover:bg-emerald-200/60'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#fcfdfa]">
            {messages.map((m) => {
              const isAssistant = m.role === 'assistant';
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
                  <div className={`max-w-[82%] space-y-1 ${isAssistant ? '' : 'text-right'}`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isAssistant
                          ? 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                          : 'bg-emerald-600 text-white font-medium rounded-br-sm'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.content}</div>

                      {/* Message Actions */}
                      {isAssistant && (
                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                          <span>{m.provider || 'KrushiMitra AI'}</span>
                          <button
                            onClick={() => copyToClipboard(m.content, m.id)}
                            className="hover:text-emerald-700 flex items-center gap-1 transition"
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
                <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Analyzing agronomy & mandi data...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Pills */}
          <div className="p-2.5 bg-slate-50/90 border-t border-slate-200 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(prompt.query)}
                className="text-[10px] font-bold bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded-full px-2.5 py-1 whitespace-nowrap transition shadow-2xs"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about crop prices, sowing advice, APMC..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-2xl px-4 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-400"
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
    </>
  );
}
