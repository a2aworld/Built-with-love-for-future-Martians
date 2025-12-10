
import React, { useState, useEffect, useRef } from 'react';
import { DataPanel } from './components/DataPanel';
import { AgentInterface } from './components/AgentInterface';
import { CupolaView } from './components/CupolaView';
import { generateStoryResponse } from './services/geminiService';
import { StoryNode } from './types';
import { STORY_NODES } from './constants';

type MobileTab = 'archive' | 'viewport' | 'comms';

/**
 * Main Application Component.
 * Orchestrates the interaction between the User (DataPanel), the View (Cupola), and the Intelligence (Agent).
 * 
 * Architecture:
 * - Serverless Single Page Application (SPA).
 * - Relies on Google Gemini API for dynamic content generation.
 * - Uses Google Maps Embed API for geospatial visualization.
 * - RESPONSIVE DESIGN: Adopts a "Datapad" layout on mobile (stacked views) and "Mission Control" (3-pane) on desktop.
 */
function App() {
  const [selectedNode, setSelectedNode] = useState<StoryNode | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; imageUrl?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('viewport'); // Default to map on mobile
  const hasInitialized = useRef(false);
  
  // AUTO-BOOT SEQUENCE: Load Ganesha immediately
  useEffect(() => {
    if (!hasInitialized.current && STORY_NODES.length > 0) {
        hasInitialized.current = true;
        // Trigger Ganesha immediately
        handleNodeSelect(STORY_NODES[0]);
    }
  }, []);

  // Main interaction handler: User clicks a map node
  const handleNodeSelect = async (node: StoryNode) => {
    setSelectedNode(node);
    
    // On mobile, switch to Viewport immediately so they see the result
    setMobileTab('viewport'); 
    
    // 1. Add User "Command" to chat
    const userMsg = `Retrieving Record: ${node.title} \nCoordinates: [${node.coordinates.lat.toFixed(4)}, ${node.coordinates.lng.toFixed(4)}]`;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    
    setIsLoading(true);

    try {
      // 2. Call Gemini Service for Narrative + Art
      const response = await generateStoryResponse(node);
      
      // 3. Add AI Response to chat
      setMessages(prev => [...prev, { 
          role: 'ai', 
          text: response.text,
          imageUrl: response.imageUrl
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Error accessing the Archive. Please verify API connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-screen overflow-hidden bg-slate-900 text-paper-200 relative font-sans">
      
      {/* Background: Subtle Professional Gradient */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>

      {/* Top Bar / Research Header - Compact on Mobile */}
      <div className="z-20 flex-none bg-slate-800/90 p-2 md:p-3 border-b border-slate-700/50 backdrop-blur-md shadow-sm">
        <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <span className="font-serif text-sm md:text-lg text-gold-500 font-bold tracking-wide">GALACTIC STORYBOOK</span>
                    <span className="font-sans text-[8px] md:text-[10px] text-slate-400 tracking-wider uppercase hidden sm:block">Planetary Heritage Archive V.1.0</span>
                </div>
                
                <div className="h-6 w-px bg-slate-600/50 hidden sm:block"></div>

                <div className="hidden sm:flex flex-col">
                     <span className="text-[10px] font-mono text-slate-500 uppercase">Active Target</span>
                     <span className="text-xs font-medium text-paper-100 truncate max-w-[150px]">
                        {selectedNode ? selectedNode.title.toUpperCase() : 'INITIALIZING...'}
                     </span>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[8px] md:text-[10px] font-mono text-slate-400 uppercase tracking-widest">Online</span>
            </div>
        </div>
      </div>

      {/* Main Layout Layer - Stacked on Mobile, Row on Desktop */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* PANEL 1: ARCHIVE (Data List) */}
        <div className={`
            absolute inset-0 z-20 bg-slate-900 md:static md:w-80 md:border-r md:border-slate-700/50 md:z-auto transition-opacity duration-300
            ${mobileTab === 'archive' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'}
        `}>
            <DataPanel 
              onSelectNode={handleNodeSelect} 
              selectedNodeId={selectedNode?.id || null} 
            />
        </div>

        {/* PANEL 2: VIEWPORT (The Map) */}
        {/* We keep this mounted but hidden via CSS on mobile to preserve iframe state */}
        <div className={`
            absolute inset-0 z-10 md:static md:flex-[2] md:p-6 md:min-w-0 transition-opacity duration-300
            ${mobileTab === 'viewport' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'}
        `}>
            <div className="w-full h-full md:rounded-xl md:overflow-hidden md:shadow-2xl md:border md:border-slate-600/30 bg-black">
                <CupolaView 
                    datasetId="1Vgo4n2MUqNzl8pZ_enSFpTm6S7BD-KxI"
                    selectedLat={selectedNode?.coordinates.lat}
                    selectedLng={selectedNode?.coordinates.lng}
                    selectedZoom={selectedNode?.zoom} 
                />
            </div>
        </div>

        {/* PANEL 3: COMMS (The Agent) */}
        <div className={`
            absolute inset-0 z-20 bg-slate-900 md:static md:flex-1 md:p-6 md:pl-0 md:min-w-0 transition-opacity duration-300
            ${mobileTab === 'comms' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'}
        `}>
            <div className="w-full h-full md:h-full">
                <AgentInterface messages={messages} isLoading={isLoading} />
            </div>
        </div>

      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (Visible only on small screens) */}
      <div className="md:hidden z-50 bg-slate-900 border-t border-slate-700 flex justify-around items-center p-2 pb-safe">
          <button 
            onClick={() => setMobileTab('archive')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${mobileTab === 'archive' ? 'text-gold-500 bg-slate-800' : 'text-slate-500'}`}
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span className="text-[10px] font-mono uppercase tracking-wider">Archive</span>
          </button>

          <button 
            onClick={() => setMobileTab('viewport')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${mobileTab === 'viewport' ? 'text-gold-500 bg-slate-800' : 'text-slate-500'}`}
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[10px] font-mono uppercase tracking-wider">Viewport</span>
          </button>

          <button 
            onClick={() => setMobileTab('comms')}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors relative ${mobileTab === 'comms' ? 'text-gold-500 bg-slate-800' : 'text-slate-500'}`}
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="text-[10px] font-mono uppercase tracking-wider">Comms</span>
              {messages.length > 0 && mobileTab !== 'comms' && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-gold-500 rounded-full animate-pulse"></span>
              )}
          </button>
      </div>

    </div>
  );
}

export default App;
