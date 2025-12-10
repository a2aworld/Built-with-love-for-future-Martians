
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

  // Mobile Detection for Zoom Adjustment
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check initially
    handleResize();

    // Add listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Base URL for the artist's map
  const artistBaseUrl = `https://www.google.com/maps/d/embed?mid=${datasetId}&ehbc=2E312F`;
  
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
      
      // MOBILE FIX: Pull the camera back on small screens so large shapes (like Ganesha) fit.
      if (isMobile) {
          // IMPORTANT: Google Maps Legacy Embed requires INTEGER zoom levels.
          // Decimals (e.g. 7.5) can cause the map to fail/render gray.
          // We subtract 2 and ensure it's an integer.
          zoom = Math.max(2, Math.floor(zoom - 2)); 
      }
    } else {
      // Default to Ganesha if nothing selected (Safety Fallback)
      targetLat = 40.217;
      targetLng = 43.667;
      zoom = 9;
    }

    // Update Artist Map URL
    const newArtistUrl = `${artistBaseUrl}&ll=${targetLat},${targetLng}&z=${zoom}`;
    setArtistMapUrl(newArtistUrl);

    // ROLLBACK: Using the Classic 'll' param format. 
    // This is the version that worked perfectly before the 'loc:' experiment.
    const newSatUrl = `https://maps.google.com/maps?ll=${targetLat},${targetLng}&z=${zoom}&t=k&output=embed`;
    setSatelliteMapUrl(newSatUrl);
    
    // Fallback: If map loads instantly or fails, clear loader after 3s max
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
    
  }, [selectedLat, selectedLng, selectedZoom, datasetId, isMobile]);

  const handleIframeLoad = () => {
      // Give it a split second more for tiles to render, then fade out loader
      setTimeout(() => setIsLoading(false), 500);
  };

  // Header Crop Style: Pushes the map up to hide the Google Header
  const cropHeaderStyle: React.CSSProperties = {
      border: 0,
      width: '100%',
      // Add extra height to compensate for the negative margin
      height: 'calc(100% + 60px)', 
      // Pull the iframe up to hide the top header bar
      marginTop: '-60px' 
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
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-black">
         <iframe 
            key={`sat-layer-${isMobile ? 'mob' : 'desk'}`} // Key change forces reload on resize to apply new zoom
            src={satelliteMapUrl}
            style={{ ...cropHeaderStyle, filter: 'contrast(1.1) saturate(0.8) brightness(0.9)' }}
            allowFullScreen
            title="Satellite View"
        ></iframe>
      </div>

      {/* --- LAYER 2: ARTIST OVERLAY (The "Heaven on Earth" Vision) --- */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 overflow-hidden"
        style={{ 
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`, // The Reveal Magic
            opacity: artistOpacity / 100
        }}
      >
         <iframe 
            key={`artist-layer-${isMobile ? 'mob' : 'desk'}`}
            src={artistMapUrl}
            style={cropHeaderStyle}
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
        title="Drag to Reveal"
      />

      {/* --- MINIMALIST CONTROLS (Bottom Right) --- */}
      {/* Added bottom padding for mobile to clear the Nav Bar */}
      <div 
        className="absolute bottom-24 md:bottom-4 right-4 z-[100] flex flex-col gap-1 items-end pointer-events-auto"
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-600/50 rounded-full px-3 py-2 flex items-center gap-3 shadow-lg group hover:bg-slate-900 transition-colors">
              <span className="text-[9px] text-gold-500 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute right-full mr-3 whitespace-nowrap">
                  Overlay Opacity
              </span>
              <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={artistOpacity}
                onChange={(e) => setArtistOpacity(parseInt(e.target.value))}
                className="w-24 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-gold-500"
              />
          </div>
      </div>

      {/* --- COPYRIGHT WATERMARK --- */}
      {/* Mobile: Top-Left | Desktop: Bottom-Left */}
      {/* Z-Index increased to 50 to ensure it's visible but below interactive controls */}
      <div className="absolute top-3 left-3 md:top-auto md:bottom-3 z-50 pointer-events-none">
         <div className="bg-slate-900/70 backdrop-blur-sm px-3 py-1.5 rounded border border-slate-700/50 shadow-lg">
             <p className="text-[10px] text-slate-400 font-sans tracking-wide">
                 <span className="text-gold-500 font-bold">A2A WORLD</span> | <span className="hidden sm:inline">Open Research Initiative |</span> Apache 2.0
                 <span className="block text-[8px] text-slate-500 mt-0.5">Astronaut Resilience | Heritage Preservation</span>
             </p>
         </div>
      </div>

    </div>
  );
};
