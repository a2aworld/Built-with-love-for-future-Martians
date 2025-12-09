
import React, { useEffect, useRef, useState } from 'react';
import { AgentResponse } from '../types';

interface AgentInterfaceProps {
  messages: { role: 'user' | 'ai'; text: string; imageUrl?: string }[];
  isLoading: boolean;
}

export const AgentInterface: React.FC<AgentInterfaceProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Handle Text-to-Speech
  useEffect(() => {
    if (isMuted) return;

    // Get the latest message
    const lastMsg = messages[messages.length - 1];

    // Only speak if it's from AI
    if (lastMsg && lastMsg.role === 'ai') {
       speak(lastMsg.text);
    }
  }, [messages, isMuted]);

  // Cleanup audio on unmount
  useEffect(() => {
      return () => {
          window.speechSynthesis.cancel();
      }
  }, []);

  const speak = (text: string) => {
    window.speechSynthesis.cancel(); // Stop any previous speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("David"));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.rate = 0.95; // Clear, academic pacing
    utterance.pitch = 1.0; 

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleMute = () => {
      if (isSpeaking) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
      }
      setIsMuted(!isMuted);
  };

  return (
    <div className="flex flex-col h-full bg-slate-800/80 border border-slate-700/50 rounded-xl overflow-hidden backdrop-blur-md shadow-lg">
      {/* Header */}
      <div className="bg-slate-900/50 p-4 border-b border-slate-700/50 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-gold-500 animate-pulse' : 'bg-green-500'}`}></div>
          <span className="text-slate-300 font-sans font-semibold text-xs tracking-wider uppercase">Narrative Synthesis</span>
        </div>
        
        <button 
            onClick={toggleMute}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-medium transition-all ${
                isMuted 
                ? 'bg-slate-700 text-slate-400' 
                : 'bg-gold-500/10 text-gold-500 border border-gold-500/20'
            }`}
        >
             {isMuted ? 'Muted' : (isSpeaking ? 'Speaking...' : 'Audio On')}
        </button>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 px-4">
             <div className="w-16 h-16 border-2 border-slate-600 rounded-full flex items-center justify-center mb-6">
                 <span className="text-2xl font-serif text-gold-500">A2A</span>
             </div>
             <p className="font-serif text-sm text-slate-300 leading-relaxed max-w-sm">
                An Open Source MVP Proof of Concept demonstrating a novel methodology for encoding human heritage onto the planetary surface to preserve our shared human story.
             </p>
             <p className="text-[10px] font-sans mt-4 text-slate-500 tracking-widest uppercase">Initializing Archive...</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            
            {/* Message Bubble */}
            <div 
              className={`max-w-[95%] p-5 rounded-lg shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-slate-700/50 text-slate-200 text-xs font-mono border border-slate-600' 
                  : 'bg-slate-900/40 text-paper-100 border-l-4 border-gold-500'
              }`}
            >
              {msg.role === 'ai' ? (
                <div className="font-serif text-base leading-relaxed tracking-wide text-justify">
                    {msg.text}
                </div>
              ) : (
                <div className="opacity-80">{msg.text}</div>
              )}
            </div>

            {/* Generated Image (AI only) */}
            {msg.imageUrl && (
                <div className="mt-4 max-w-[95%] w-full rounded shadow-md overflow-hidden border border-slate-700/50 bg-black relative">
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur px-2 py-1 text-[9px] text-white/80 font-sans tracking-widest uppercase rounded-sm border border-white/10">
                        Fig 1.1: Iconographic Reconstruction
                    </div>
                    <img 
                        src={msg.imageUrl} 
                        alt="AI Visualization" 
                        className="w-full h-auto object-cover"
                    />
                </div>
            )}

          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-3 text-slate-400 animate-pulse pl-2">
             <span className="text-lg font-serif">...</span>
             <span className="text-xs font-sans uppercase tracking-widest">Accessing Cultural Database</span>
          </div>
        )}
      </div>
    </div>
  );
};
