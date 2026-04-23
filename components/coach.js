'use client';
import { useState, useEffect, useRef } from 'react';

export default function CoachChat() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: "Protocol Initiated. State your objective." }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading || chatCount >= 2) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
      setChatCount(prev => prev + 1);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Network error. Input email for direct blueprint sync." }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md mx-auto bg-black border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="p-3 bg-zinc-900 border-b border-zinc-800 text-[10px] text-zinc-500 font-mono">RESOFLEX_LOGIC_v4.0</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-xl text-sm ${m.role === 'user' ? 'bg-zinc-800' : 'bg-white text-black'}`}>{m.content}</div>
          </div>
        ))}
        {chatCount >= 2 && (
          <div className="p-4 border border-yellow-500 bg-yellow-500/10 rounded-xl text-center">
            <p className="text-sm text-yellow-500 font-bold mb-2">ACCESS EXPIRED</p>
            <a href="/upsell" className="block w-full py-2 bg-yellow-500 text-black font-bold rounded">GET MARTIAL X (₦1,000)</a>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex gap-2">
        <input disabled={chatCount >= 2} className="flex-1 bg-black border border-zinc-700 rounded-lg px-4 text-sm text-white focus:outline-none" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Input..." />
        <button onClick={handleSend} disabled={chatCount >= 2 || loading} className="px-4 py-2 bg-white text-black text-xs font-bold rounded-lg uppercase">{loading ? '...' : 'Send'}</button>
      </div>
    </div>
  );
}
