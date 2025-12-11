
import React from 'react';
import { StoryNode } from '../types';
import { STORY_NODES } from '../constants';

interface DataPanelProps {
  onSelectNode: (node: StoryNode) => void;
  selectedNodeId: string | null;
}

export const DataPanel: React.FC<DataPanelProps> = ({ onSelectNode, selectedNodeId }) => {
  // Group nodes by Category
  const groupedNodes = STORY_NODES.reduce((acc, node) => {
    if (!acc[node.category]) {
      acc[node.category] = [];
    }
    acc[node.category].push(node);
    return acc;
  }, {} as Record<string, StoryNode[]>);

  return (
    <div className="h-full flex flex-col bg-slate-800/90 w-full md:w-80 font-sans backdrop-blur-xl">
      <div className="p-6 border-b border-slate-700/50">
        {/* Mission Statement / Abstract */}
        <p className="text-[10px] text-slate-400 font-sans leading-relaxed mb-6 border-l-2 border-gold-500 pl-3 italic opacity-80">
          "An Open Source MVP Proof of Concept demonstrating a novel methodology for encoding human heritage onto the planetary surface, preserving our shared human story for future generations."
        </p>

        <h2 className="text-xs font-mono text-gold-500 uppercase tracking-widest mb-1">Index</h2>
        <h1 className="text-xl font-serif text-paper-100 font-bold">Research Nodes</h1>
      </div>

      <div className="p-3 flex-1 overflow-y-auto custom-scrollbar">
        {Object.entries(groupedNodes).map(([category, nodes]) => (
          <div key={category} className="mb-6">
            <div className="flex items-center gap-2 mb-2 px-2">
                <div className="h-px w-3 bg-gold-500/50"></div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {category}
                </div>
                <div className="h-px flex-1 bg-slate-700/50"></div>
            </div>
            
            <div className="space-y-1">
              {nodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => onSelectNode(node)}
                  className={`w-full text-left px-3 py-2.5 rounded-md transition-all duration-200 group ${
                    selectedNodeId === node.id
                      ? 'bg-slate-700 border-l-2 border-gold-500 text-gold-500 shadow-sm'
                      : 'hover:bg-slate-700/50 text-slate-300 border-l-2 border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm truncate pr-2">
                      {node.title}
                    </span>
                  </div>
                  {selectedNodeId === node.id && (
                      <div className="text-[9px] font-mono text-slate-400 mt-1 flex gap-2 opacity-80">
                          <span>LAT: {node.coordinates.lat.toFixed(2)}</span>
                          <span>LNG: {node.coordinates.lng.toFixed(2)}</span>
                      </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-slate-700/50 bg-slate-900/30">
        <div className="text-[10px] text-slate-500 font-sans text-center leading-relaxed">
          <span className="font-semibold text-slate-400">License: CC BY 4.0</span>
          <br/>
          <span className="italic">Astronaut Resilience | Heritage Preservation</span>
          <br/>
          <div className="flex justify-center items-center gap-1.5 mt-2 opacity-60">
             <span>Powered by</span>
             <span className="font-bold text-gold-500">Gemini 3 Pro</span>
          </div>
        </div>
      </div>
    </div>
  );
};
