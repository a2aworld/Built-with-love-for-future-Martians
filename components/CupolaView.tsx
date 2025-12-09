
import React, { useState, useEffect } from 'react';

interface CupolaViewProps {
  datasetId: string; // The Google MyMap ID
  selectedLat?: number;
  selectedLng?: number;
  selectedZoom?: number;
}

export const CupolaView: React.FC<CupolaViewProps> = ({ 
  datasetId,
  selectedLat,
  selectedLng,
  selectedZoom
}) => {
  const [artistMapUrl, setArtistMapUrl] = useState('');
  const [satelliteMapUrl, setSatelliteMapUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Slider State
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100%
  const [artistOpacity, setArtistOpacity] = useState(100); // 0 to 100%

  // Base URL for the artist's map
  const artistBaseUrl = `https://www.google.com/maps/d/embed?mid=${datasetId}&ehbc=2E312F`;
  
  // Base URL for Standard Satellite (using simple embed structure)
  const satelliteBaseUrl = `https://maps.google.com/maps?t=k&output=embed`;

  useEffect(() => {
    // Trigger loading state whenever coordinates change
    setIsLoading(true);

    let targetLat = 0;
    let targetLng = 0;
    let zoom = 2;

    if (selectedLat !== undefined && selectedLng !== undefined) {
      targetLat = selectedLat;
      targetLng = selectedLng;
      zoom = selectedZoom || 6; 
    } else {
      targetLat = 20;
      targetLng = 0;
      zoom = 2;
    }

    // Update Artist Map URL
    const newArtistUrl = `${artistBaseUrl}&ll=${targetLat},${targetLng}&z=${zoom}`;
    setArtistMapUrl(newArtistUrl);

    // Update Satellite Map URL
    const newSatUrl = `${satelliteBaseUrl}&q=${targetLat},${targetLng}&z=${zoom}`;
    setSatelliteMapUrl(newSatUrl);
    
    // Fallback: If map loads instantly or fails, clear loader after 3s max
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
    
  }, [selectedLat, selectedLng, selectedZoom, datasetId]);

  const handleIframeLoad = () => {
      // Give it a split second more for tiles to render, then fade out loader
      setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-lg overflow-hidden group select-none">
      
      {/* --- A2A ALLSTAR LOADING SCREEN --- */}
      <div 
        className={`absolute inset-0 z-[60] bg-slate-900 flex items-center justify-center transition-opacity duration-700 pointer-events-none ${isLoading ? 'opacity-100' : 'opacity-0'}`}
      >
         <div className="relative flex flex-col items-center">
             {/* Elegant Loader: Rotating A2A Star */}
             <div className="relative w-16 h-16 animate-spin-slow duration-[10s]">
                 <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                    <path d="M50 5 L95 90 H5 Z" fill="none" stroke="#d4af37" strokeWidth="1.5" />
                    <path d="M50 5 L95 90 H5 Z" fill="none" stroke="#64748b" strokeWidth="1" className="rotate-180 origin-center scale-75" />
                 </svg>
             </div>
             
             <div className="mt-6 font-sans text-slate-400 text-[10px] tracking-[0.3em] uppercase">
                 Calibrating Instruments
             </div>
         </div>
      </div>

      {/* --- LAYER 1: BASE SATELLITE (The "Real" World) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <iframe 
            key="sat-layer"
            src={satelliteMapUrl}
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'contrast(1.05) saturate(0.9)' }}
            allowFullScreen
            title="Satellite View"
        ></iframe>
      </div>

      {/* --- LAYER 2: ARTIST OVERLAY (The "Heaven on Earth" Vision) --- */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300"
        style={{ 
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`, // The Reveal Magic
            opacity: artistOpacity / 100
        }}
      >
         <iframe 
            key="artist-layer"
            src={artistMapUrl}
            width="100%" 
            height="100%" 
            style={{ border: 0 }}
            allowFullScreen
            title="Artist Overlay"
            onLoad={handleIframeLoad}
        ></iframe>
      </div>

      {/* --- SLIDER HANDLE (Visual) --- */}
      <div 
        className="absolute top-0 bottom-0 z-20 w-px bg-white/50 cursor-ew-resize flex items-center justify-center pointer-events-none backdrop-blur-sm"
        style={{ left: `${sliderPosition}%` }}
      >
          <div className="w-6 h-12 bg-white/90 rounded flex items-center justify-center shadow-lg border border-slate-300">
              <svg className="w-3 h-3 text-slate-600" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/><path d="M16 5v14l-11-7z"/></svg>
          </div>
      </div>

      {/* --- SLIDER INPUT (Invisible Interactive Layer) --- */}
      {/* z-40 sits above maps but BELOW the controls panel (z-[100]) */}
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={sliderPosition} 
        onChange={(e) => setSliderPosition(parseInt(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40" 
        title="Drag to Compare"
      />

      {/* --- CONTROLS OVERLAY (Bottom Right) --- */}
      {/* z-[100] ensures this sits ON TOP of everything. stopPropagation prevents slider drag. */}
      <div 
        className="absolute bottom-6 right-6 z-[100] flex flex-col gap-2 items-end pointer-events-auto"
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
          
          <div className="bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded shadow-xl w-56">
              <div className="text-[9px] font-sans text-gold-500 mb-3 uppercase tracking-widest font-bold border-b border-slate-700 pb-2">
                  Layer Control
              </div>
              
              <div className="space-y-4">
                  <div className="flex justify-between text-[9px] text-slate-400 font-sans tracking-wide">
                      <span>NARRATIVE MAP</span>
                      <span>SATELLITE</span>
                  </div>

                  {/* Opacity Control */}
                  <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-[9px] text-slate-300">
                          <span>Map Opacity</span>
                          <span>{artistOpacity}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={artistOpacity}
                        onChange={(e) => setArtistOpacity(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-gold-500 relative z-[101]"
                      />
                  </div>
              </div>
          </div>
      </div>

      {/* --- COPYRIGHT WATERMARK --- */}
      <div className="absolute bottom-3 left-3 z-30 pointer-events-none">
         <div className="bg-slate-900/70 backdrop-blur-sm px-3 py-1.5 rounded border border-slate-700/50">
             <p className="text-[10px] text-slate-400 font-sans tracking-wide">
                 <span className="text-gold-500 font-bold">A2A WORLD</span> | Open Research Initiative | Apache 2.0
             </p>
         </div>
      </div>

      {/* HUD Elements - Static Coordinates */}
      {selectedLat !== undefined && (
        <div className="absolute top-4 right-4 text-right pointer-events-auto z-50">
            <div className="inline-block bg-slate-900/80 backdrop-blur border border-slate-700 p-2 rounded text-slate-300 font-mono text-[10px]">
                <div className="flex items-center justify-end gap-2 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span className="tracking-widest">LIVE FEED</span>
                </div>
                <div className="text-slate-400">
                    LAT: {selectedLat.toFixed(5)}<br/>
                    LNG: {selectedLng?.toFixed(5)}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};