
import React, { useState, useEffect, useRef } from 'react';
import { DataPanel } from './components/DataPanel';
import { AgentInterface } from './components/AgentInterface';
import { CupolaView } from './components/CupolaView';
import { promptSelectKey, generateStoryResponse } from './services/geminiService';
import { StoryNode } from './types';
import { STORY_NODES } from './constants';

/**
 * Main Application Component.
 * Orchestrates the interaction between the User (DataPanel), the View (Cupola), and the Intelligence (Agent).
 * 
 * Architecture:
 * - Serverless Single Page Application (SPA).
 * - Relies on Google Gemini API for dynamic content generation.
 * - Uses Google Maps Embed API for geospatial visualization.
 */
function App() {
  const [selectedNode, setSelectedNode] = useState<StoryNode | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; imageUrl?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyReady, setApiKeyReady] = useState(false);
  const hasInitialized = useRef(false);
  
  // Initial API Key Check for the Hackathon Environment
  useEffect(() => {
    const checkKey = async () => {
        // @ts-ignore
       if (window.aistudio && window.aistudio.hasSelectedApiKey) {
         // @ts-ignore
         const has = await window.aistudio.hasSelectedApiKey();
         setApiKeyReady(has);
       } else {
         // Fallback for local dev or if the API isn't present
         setApiKeyReady(true); 
       }
    };
    checkKey();
  }, []);

  // AUTO-BOOT SEQUENCE: Load Ganesha immediately
  useEffect(() => {
    if (!hasInitialized.current && STORY_NODES.length > 0) {
        hasInitialized.current = true;
        // Trigger Ganesha immediately
        handleNodeSelect(STORY_NODES[0]);
    }
  }, []);

  const handleSelectKey = async () => {
    await promptSelectKey();
    setApiKeyReady(true);
  };

  // Main interaction handler: User clicks a map node
  const handleNodeSelect = async (node: StoryNode) => {
    setSelectedNode(node);
    
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
    <div className="flex h-screen w-screen overflow-hidden bg-slate-900 text-paper-200 relative font-sans">
      
      {/* Background: Subtle Professional Gradient */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>

      {/* Sidebar: Data Selection */}
      <div className="z-10 h-full hidden md:block border-r border-slate-700/50 shadow-xl">
        <DataPanel 
          onSelectNode={handleNodeSelect} 
          selectedNodeId={selectedNode?.id || null} 
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative z-10 p-2 md:p-6 gap-6">
        
        {/* Top Bar / Research Header */}
        <div className="flex justify-between items-center bg-slate-800/80 p-3 rounded-lg border border-slate-700/50 backdrop-blur-md shadow-sm">
            <div className="flex items-center gap-6">
                <div className="flex flex-col">
                    <span className="font-serif text-lg text-gold-500 font-bold tracking-wide">GALACTIC STORYBOOK</span>
                    <span className="font-sans text-[10px] text-slate-400 tracking-wider uppercase">Planetary Heritage Archive V.1.0</span>
                </div>
                
                <div className="h-8 w-px bg-slate-600/50 hidden sm:block"></div>

                <div className="hidden sm:flex flex-col">
                     <span className="text-[10px] font-mono text-slate-500 uppercase">Active Target</span>
                     <span className="text-xs font-medium text-paper-100">
                        {selectedNode ? selectedNode.title.toUpperCase() : 'INITIALIZING SYSTEM...'}
                     </span>
                </div>
            </div>

            {!apiKeyReady && (
                <button 
                    onClick={handleSelectKey}
                    className="bg-gold-500 hover:bg-gold-400 text-slate-900 font-semibold text-xs px-4 py-2 rounded shadow-md transition-all"
                >
                    CONNECT KEY
                </button>
            )}
        </div>

        {/* Middle Layer: Map and Agent */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
            
            {/* The Cupola View (The Artist's Vision + Map) */}
            <div className="flex-1 lg:flex-[2] min-h-[300px] flex flex-col">
                <div className="flex-1 rounded-xl overflow-hidden shadow-2xl border border-slate-600/30 bg-black">
                    <CupolaView 
                        datasetId="1Vgo4n2MUqNzl8pZ_enSFpTm6S7BD-KxI"
                        selectedLat={selectedNode?.coordinates.lat}
                        selectedLng={selectedNode?.coordinates.lng}
                        selectedZoom={selectedNode?.zoom} 
                    />
                </div>
            </div>

            {/* The Agent (The Storyteller) */}
            <div className="flex-1 lg:flex-1 h-1/2 lg:h-full min-h-0">
                <AgentInterface messages={messages} isLoading={isLoading} />
            </div>
        </div>

        {/* Mobile-only Data Panel Toggle could go here in future */}
        <div className="md:hidden h-40">
           <DataPanel 
              onSelectNode={handleNodeSelect} 
              selectedNodeId={selectedNode?.id || null} 
            />
        </div>

      </div>
    </div>
  );
}

export default App;
