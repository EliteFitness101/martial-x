'use client';
import { useState, useEffect, useRef } from 'react';

export default function CoachChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Protocol Initiated. I am coachB2K. State your physical objective or biometric roadblock." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  const chatEndRef = useRef(null);

  // Sync scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading || chatCount >= 2) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setChatCount(prev => prev + 1);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          count: chatCount + 1 
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sync Error. Re-establish connection." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md mx-auto bg-black border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
        <span className="text-xs font-mono text-zinc-500">SYSTEM: coachB2K_v3.1</span>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${chatCount >= 2 ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}></div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-400">
            {chatCount >= 2 ? 'LOCKED' : 'ACTIVE'}
          </span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
              m.role === 'user' ? 'bg-zinc-800 text-white' : 'bg-white text-black font-medium'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        
        {/* PAYWALL TRIGGER */}
        {chatCount >= 2 && (
          <div className="mt-4 p-4 border border-yellow-500/50 bg-yellow-500/10 rounded-xl text-center animate-in fade-in slide-in-from-bottom-4">
            <p className="text-yellow-500 text-xs font-bold uppercase mb-2">⚠️ PROTOCOL LIMIT REACHED</p>
            <p className="text-zinc-300 text-sm mb-4">You have the spark, now you need the architecture.</p>
            <a href="/martial-x" className="block w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-all">
              UNLOCK MARTIAL X (₦1,000)
            </a>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-zinc-900/80 border-t border-zinc-800">
        <div className="flex gap-2">
          <input
            disabled={chatCount >= 2 || loading}
            className="flex-1 bg-black border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-white disabled:opacity-50"
            placeholder={chatCount >= 2 ? "Access Denied" : "Input Objective..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={chatCount >= 2 || loading}
            className="px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-zinc-200 disabled:opacity-50"
          >
            {loading ? '...' : 'SEND'}
          </button>
        </div>
      </div>
    </div>
  );
}
