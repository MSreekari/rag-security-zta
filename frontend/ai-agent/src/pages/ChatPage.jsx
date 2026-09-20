import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  Send,
  User,
  Bot,
  LogOut,
  Layers,
  FileText,
  AlertTriangle,
  Loader2,
  Lock,
  Activity,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const ChatPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // State for user attributes (fallback to localStorage if context reloads)
  const [currentUser, setCurrentUser] = useState({
    user_id: user?.user_id || localStorage.getItem('user_id') || 'Unknown',
    department: user?.department || localStorage.getItem('department') || 'general',
    clearance: user?.clearance || Number(localStorage.getItem('clearance')) || 1,
    token: user?.token || localStorage.getItem('access_token') || '',
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      sender: 'system',
      text: `Zero-Trust Boundary Active. Authenticated as ${currentUser.user_id} (${currentUser.department.toUpperCase()}, Clearance Level ${currentUser.clearance}). All prompts and vector queries are subject to continuous ABAC policy evaluation.`,
      metadata: null,
    },
  ]);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle Logout
  const handleLogout = () => {
    if (logout) logout();
    localStorage.clear();
    navigate('/');
  };

  // Submit query to Zero Trust RAG endpoint
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;

    const queryText = inputQuery.trim();
    setInputQuery('');

    // Add user message to state
    const userMsg = {
      id: String(Date.now()),
      sender: 'user',
      text: queryText,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/rag/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ query: queryText }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle PEP Authorization Failures (401/403)
        const errorMessage = typeof data.detail === 'string' 
          ? data.detail 
          : 'Zero Trust PEP Authorization Failure';
          
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: 'bot',
            text: `[PEP Violation]: ${errorMessage}`,
            isError: true,
            metadata: null,
          },
        ]);
        return;
      }

      // Check if response was blocked by Input Guardrail
      const isGuardrailBlocked = data.authorized_chunks_used === 0 && data.answer.includes('Zero Trust Violation');

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'bot',
          text: data.answer,
          isBlocked: isGuardrailBlocked,
          metadata: {
            chunksUsed: data.authorized_chunks_used,
            sanitized: data.sanitized,
            auditEventId: data.audit_event_id,
            clearance: data.clearance,
            department: data.department,
          },
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'bot',
          text: 'Network Error: Unable to reach FastAPI backend on port 8000.',
          isError: true,
          metadata: null,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans antialiased overflow-hidden">
      
      {/* Left Sidebar: Active Zero-Trust Persona Telemetry */}
      <aside className="w-80 border-r border-zinc-800/80 bg-zinc-900/40 p-5 flex flex-col justify-between hidden md:flex">
        <div className="space-y-6">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#814AC8]/20 border border-[#814AC8]/30">
              <ShieldCheck className="text-[#814AC8]" size={22} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide">ZTA RAG AGENT</h2>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Zero Trust Enforced</p>
            </div>
          </div>

          {/* Active Context Identity Card */}
          <div className="p-4 rounded-2xl bg-zinc-800/40 border border-zinc-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-zinc-400">Identity Context</span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <Activity size={10} /> Verified
              </span>
            </div>

            <div className="space-y-2 pt-1 border-t border-zinc-700/40">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Subject ID:</span>
                <span className="font-mono text-zinc-200">{currentUser.user_id}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Department:</span>
                <span className="font-mono text-zinc-200 capitalize">{currentUser.department}</span>
              </div>
              <div className="flex justify-between text-xs items-center">
                <span className="text-zinc-500">Clearance:</span>
                <span className="px-2 py-0.5 rounded-md bg-[#814AC8]/20 text-[#a874ea] font-semibold text-[11px] border border-[#814AC8]/30">
                  Level {currentUser.clearance}
                </span>
              </div>
            </div>
          </div>

          {/* Policy Information */}
          <div className="space-y-2 text-xs text-zinc-400">
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Enforcement Rules</p>
            <div className="space-y-1.5 text-[11px] bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Lock size={12} className="text-[#814AC8]" /> Pre-Retrieval Vector ACL Filtering
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <ShieldAlert size={12} className="text-[#814AC8]" /> Input Prompt Injection Firewall
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <AlertTriangle size={12} className="text-[#814AC8]" /> Real-time DLP Output Sanitizer
              </div>
            </div>
          </div>
        </div>

        {/* Logout Action */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition cursor-pointer border border-zinc-700/50"
        >
          <LogOut size={14} /> Switch Persona / Logout
        </button>
      </aside>

      {/* Main Chat Workspace */}
      <main className="flex-1 flex flex-col h-full bg-zinc-950">
        
        {/* Top Mobile Bar */}
        <header className="h-14 border-b border-zinc-800/80 px-6 flex items-center justify-between bg-zinc-900/30">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xs font-medium text-zinc-300">Policy Enforcement Active</h1>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={handleLogout} className="text-xs text-zinc-400 hover:text-white">
              Logout
            </button>
          </div>
        </header>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#814AC8] text-white'
                    : msg.sender === 'system'
                    ? 'bg-zinc-800 text-zinc-400'
                    : msg.isBlocked
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-zinc-800 border border-zinc-700 text-emerald-400'
                }`}
              >
                {msg.sender === 'user' ? <User size={16} /> : msg.sender === 'system' ? <Lock size={14} /> : <Bot size={16} />}
              </div>

              {/* Message Content */}
              <div className="space-y-1.5 max-w-[85%]">
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#814AC8] text-white rounded-tr-none'
                      : msg.sender === 'system'
                      ? 'bg-zinc-900/80 border border-zinc-800 text-zinc-400 text-xs rounded-tl-none font-mono'
                      : msg.isBlocked
                      ? 'bg-red-950/30 border border-red-900/60 text-red-200 rounded-tl-none'
                      : msg.isError
                      ? 'bg-amber-950/30 border border-amber-900/60 text-amber-200 rounded-tl-none'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* Response Telemetry Badges (Only on Bot replies) */}
                {msg.metadata && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-zinc-500 font-mono">
                    <span className="flex items-center gap-1 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700">
                      <Layers size={10} className="text-[#814AC8]" /> Chunks: {msg.metadata.chunksUsed}
                    </span>
                    {msg.metadata.sanitized && (
                      <span className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                        <AlertTriangle size={10} /> DLP Redacted
                      </span>
                    )}
                    <span className="flex items-center gap-1 bg-zinc-800/40 px-2 py-0.5 rounded border border-zinc-800 text-zinc-500">
                      <FileText size={10} /> SIEM: {msg.metadata.auditEventId.slice(0, 8)}...
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-3xl mr-auto">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                <Loader2 size={16} className="text-[#814AC8] animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-none bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2">
                <span>Evaluating ABAC policy and running isolated vector retrieval...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/40">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-center">
            <input
              type="text"
              placeholder={`Ask as ${currentUser.user_id} (Clearance Lvl ${currentUser.clearance})...`}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isLoading}
              className="w-full bg-zinc-800/70 border border-zinc-700/80 rounded-2xl py-3.5 pl-4 pr-12 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-[#814AC8] focus:ring-1 focus:ring-[#814AC8] transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="absolute right-2 p-2 rounded-xl bg-[#814AC8] hover:bg-[#9254df] text-white disabled:opacity-30 disabled:hover:bg-[#814AC8] transition cursor-pointer"
            >
              <Send size={16} />
            </button>
          </form>
          <p className="text-center text-[10px] text-zinc-600 mt-2">
            Inputs inspected by heuristic firewall. Unauthorized chunks are dynamically filtered by the PDP.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;