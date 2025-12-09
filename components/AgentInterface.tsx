
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
             {/* Speaker Icon */}
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                {isMuted ? (
                    <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" />
                ) : (
                    <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" />
                )}
             </svg>
             {isMuted ? 'Muted' : (isSpeaking ? 'Speaking...' : 'Audio On')}
        </button>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 px-8">
             <div className="w-16 h-16 border-2 border-slate-600 rounded-full flex items-center justify-center mb-6">
                 <span className="text-2xl font-serif text-gold-500">A2A</span>
             </div>
             <p className="font-serif text-sm text-slate-300 leading-relaxed max-w-md italic border-l-2 border-gold-500 pl-4">
                "An Open Source MVP Proof of Concept demonstrating a novel methodology for encoding human heritage onto the planetary surface, preserving our shared human story for future generations."
             </p>
             <p className="text-[10px] font-sans mt-6 text-slate-500 tracking-widest uppercase animate-pulse">Initializing Neural Link...</p>
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
                <div className="mt-4 max-w-[95%] w-full rounded shadow-md overflow-hidden border border-slate-700/50 bg-black relative animate-fade-in">
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
