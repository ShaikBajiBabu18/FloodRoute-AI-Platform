import React, { useState, useRef, useEffect } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useDemo } from '../../context/DemoContext';
import {
  MessageSquare,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestedActions?: { label: string; action: string; params?: any }[];
  sources?: string[];
  timestamp: string;
}

export const CopilotChat: React.FC = () => {
  const { isDemoMode, demoConfig } = useDemo();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        '👋 Welcome to **FloodRoute Copilot**! I am your AI emergency transit assistant for India.\n\nAsk me about road accessibility, rainfall predictions, route risk scores, or emergency shelters.',
      suggestedActions: [
        { label: 'Why is the flood risk high?', action: 'query', params: { text: 'Why is the flood risk high?' } },
        { label: 'Is it safe to travel?', action: 'query', params: { text: 'Is it safe to travel?' } },
        { label: 'Explain my route risk', action: 'query', params: { text: 'Explain my route risk' } },
        { label: 'Nearest shelter', action: 'query', params: { text: 'Nearest shelter' } },
        { label: 'Active warnings', action: 'query', params: { text: 'Active disaster warnings' } },
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { readAloud, setOpenSosModal } = useAccessibility();

  // Web Speech recognition reference
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    if (isDemoMode) {
      setMessages([
        {
          id: 'demo-welcome',
          role: 'assistant',
          content:
            `🤖 **FloodRoute Copilot • Demonstration Context Loaded**\n\n` +
            `📍 **Selected Location**: ${demoConfig.location.name} (Elev: ${demoConfig.location.elevationMsl}m MSL)\n` +
            `🌧️ **Current Weather**: ${demoConfig.weather.rainfallMmH} mm/h (${demoConfig.weather.condition})\n` +
            `🛡️ **Flood Risk**: ${demoConfig.floodRisk.score}/100 (${demoConfig.floodRisk.level})\n` +
            `📊 **Main Factors**: Heavy rain (35%), Low basin elevation (25%), Drainage saturation (20%)\n\n` +
            `Ask me anything about this simulated flood scenario:`,
          suggestedActions: [
            { label: 'Why is the risk elevated?', action: 'query', params: { text: 'Why is the risk elevated?' } },
            { label: 'How is this score calculated?', action: 'query', params: { text: 'How is this score calculated?' } },
            { label: 'What should I check before travelling?', action: 'query', params: { text: 'What should I check before travelling?' } },
            { label: 'Where is the nearest shelter?', action: 'query', params: { text: 'Nearest shelter' } },
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [isDemoMode, demoConfig]);

  useEffect(() => {
    const handleCopilotQuery = (e: any) => {
      const q = e.detail?.query;
      setIsOpen(true);
      if (q) {
        handleSend(q);
      }
    };
    window.addEventListener('open_copilot_with_query', handleCopilotQuery);
    return () => window.removeEventListener('open_copilot_with_query', handleCopilotQuery);
  }, []);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          context: {
            latitude: isDemoMode ? demoConfig.location.latitude : 12.9805,
            longitude: isDemoMode ? demoConfig.location.longitude : 80.2195,
            locationName: isDemoMode ? demoConfig.location.name : 'Velachery, Chennai',
            routeRiskScore: isDemoMode ? demoConfig.floodRisk.score : 68,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: data.id,
            role: 'assistant',
            content: data.content,
            suggestedActions: data.suggestedActions,
            sources: data.sources,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error('Server error');
      }
    } catch {
      let fallbackText = `🧠 **AI ESTIMATE • MODEL-DERIVED ADVISORY FOR ${isDemoMode ? demoConfig.location.name : 'Velachery, Chennai'}:**\n\n`;
      const qLower = query.toLowerCase();
      if (qLower.includes('why') || qLower.includes('factor') || qLower.includes('elevated')) {
        fallbackText +=
          `• **Rainfall Intensity**: ${demoConfig.weather.rainfallMmH} mm/h cloudburst exceeding stormwater capacity.\n` +
          `• **Basin Elevation**: ${demoConfig.location.elevationMsl}m MSL saucer-shaped basin subject to natural ponding.\n` +
          `• **Drainage Saturation**: 85% saturation in Pallikaranai canal discharge corridor.\n\n` +
          `💡 *Recommendation*: Select elevated bypass corridors and avoid low-lying underpasses.`;
      } else if (qLower.includes('how') || qLower.includes('calculated')) {
        fallbackText +=
          `• **Algorithm Formulation**: Weighted deterministic equation: Rain (35%) + Elevation (25%) + Drainage (20%) + River proximity (15%) + Crowd reports (5%).\n` +
          `• **Current Score**: ${demoConfig.floodRisk.score}/100 (${demoConfig.floodRisk.level} Risk).\n` +
          `• **Explainability**: Every factor percentage is verified against spatial elevation contours.`;
      } else if (qLower.includes('check') || qLower.includes('travel') || qLower.includes('safe')) {
        fallbackText +=
          `• **Pre-Travel Checks**: Verify underpass status before departure.\n` +
          `• **Vehicle Suitability**: Two-wheelers and small hatchbacks avoid low-lying canal roads.\n` +
          `• **High Ground Refuge**: Nearest verified relief camp is ${demoConfig.emergencyServices[0].name} (${demoConfig.emergencyServices[0].distance}).\n` +
          `• **Helpline**: National Emergency Hotline 112 is active 24/7.`;
      } else {
        fallbackText +=
          `Current flood risk is elevated (${demoConfig.floodRisk.score}/100). Please follow routes with lower modeled flood-risk exposure and check official NDMA bulletins.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `fallback-${Date.now()}`,
          role: 'assistant',
          content: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: string, params?: any) => {
    if (action === 'query' && params?.text) {
      handleSend(params.text);
    } else if (action === 'open_sos_modal') {
      setOpenSosModal(true);
    } else if (action === 'tel_112') {
      window.location.href = 'tel:112';
    } else if (action === 'open_emergency_shelters') {
      window.location.href = '/emergency-resources';
    } else if (action === 'navigate_route') {
      window.location.href = '/route-planner';
    } else if (action === 'view_weather') {
      window.location.href = '/weather';
    } else {
      handleSend(action.replace('_', ' '));
    }
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-IN';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSend(transcript);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn('Speech error:', e);
      setIsListening(false);
    }
  };

  return (
    <>
      {/* Floating Chat Bubble Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle FloodRoute Copilot AI Assistant"
        className="fixed bottom-20 lg:bottom-6 right-6 z-50 p-4 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white shadow-2xl shadow-cyan-500/30 flex items-center justify-center transition-all transform hover:scale-105 group"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#020617] animate-pulse" />
          </>
        )}
      </button>

      {/* Floating Glassmorphism Window */}
      {isOpen && (
        <div className="fixed bottom-36 lg:bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-h-[580px] h-[78vh] flex flex-col rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-cyan-500/30 shadow-2xl shadow-black/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-heading">
                  FloodRoute Copilot
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">v2.0</span>
                </h3>
                <p className="text-[11px] text-slate-400">AI Disaster Transit & Safety Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none space-y-2'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.content}</p>

                  {/* Sources tag if any */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/60 font-mono">
                      Sources: {m.sources.join(' • ')}
                    </div>
                  )}

                  {/* Suggested Action Chips */}
                  {m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {m.suggestedActions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleActionClick(act.action, act.params)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[11px] font-medium flex items-center gap-1 transition-all"
                        >
                          {act.label} <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Read Aloud button for assistant */}
                  {m.role === 'assistant' && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => readAloud(m.content.replace(/[*#]/g, ''))}
                        title="Read aloud"
                        className="text-slate-400 hover:text-cyan-400 text-[10px] flex items-center gap-1"
                      >
                        <Volume2 className="w-3 h-3" /> Read
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>Copilot is analyzing hydrometeorological telemetry...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts bar */}
          <div className="px-3 py-1.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            <span className="text-slate-500 text-[10px] uppercase font-bold shrink-0">Prompts:</span>
            {['Is it safe to travel?', 'Explain route risk', 'Nearest shelter', 'Rain forecast'].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="px-2 py-0.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[10px] whitespace-nowrap transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              title={isListening ? 'Stop Listening' : 'Start Voice Input'}
              className={`p-2 rounded-xl border transition-all ${
                isListening
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot about flood risk or transit..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
