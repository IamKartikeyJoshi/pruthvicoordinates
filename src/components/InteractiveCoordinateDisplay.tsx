import { useState, useEffect, useRef } from "react";

const InteractiveCoordinateDisplay = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [coords, setCoords] = useState({
    easting: 437892.45,
    northing: 1987234.12,
    elevation: 342.567,
    hdist: 156.234,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Normalize to container dimensions
      const normX = Math.max(0, Math.min(1, x / rect.width));
      const normY = Math.max(0, Math.min(1, y / rect.height));
      
      setMousePos({ x: normX * 100, y: normY * 100 });
      
      // Calculate coordinates based on position
      // Simulating a surveying grid in UTM zone
      const baseEasting = 437000;
      const baseNorthing = 1987000;
      
      setCoords({
        easting: baseEasting + normX * 1000,
        northing: baseNorthing + normY * 500,
        elevation: 300 + Math.sin(normX * Math.PI) * 50 + Math.cos(normY * Math.PI) * 30,
        hdist: Math.sqrt(normX * normX + normY * normY) * 200,
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-foreground border border-foreground/20 overflow-hidden cursor-crosshair"
    >
      {/* Grid Background */}
      <div className="absolute inset-0">
        {/* Major grid lines */}
        <svg className="w-full h-full opacity-20">
          <defs>
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent/50" />
            </pattern>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#smallGrid)" />
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="1" className="text-accent" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Crosshair at mouse position */}
      <div 
        className="absolute w-px h-full bg-accent/60 pointer-events-none transition-all duration-75"
        style={{ left: `${mousePos.x}%` }}
      />
      <div 
        className="absolute h-px w-full bg-accent/60 pointer-events-none transition-all duration-75"
        style={{ top: `${mousePos.y}%` }}
      />
      
      {/* Crosshair center circle */}
      <div 
        className="absolute w-6 h-6 border-2 border-accent rounded-full pointer-events-none transition-all duration-75 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
      >
        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-accent rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>

      {/* Top-left: UTM Zone indicator */}
      <div className="absolute left-3 top-3 z-20">
        <div className="bg-background/90 backdrop-blur-sm border border-foreground/20 p-3 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold text-accent">UTM</span>
            <span className="font-mono text-[10px] text-foreground/60">ZONE 43N</span>
            <div className="flex gap-0.5 ml-2">
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              <div className="w-1.5 h-1.5 bg-measure rounded-full" />
            </div>
          </div>
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between gap-6">
              <span className="text-foreground/50">E:</span>
              <span className="text-accent tabular-nums">{coords.easting.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-foreground/50">N:</span>
              <span className="text-cyan-400 tabular-nums">{coords.northing.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top-right: Elevation & Distance */}
      <div className="absolute right-3 top-3 z-20">
        <div className="bg-background/90 backdrop-blur-sm border border-foreground/20 p-3 shadow-lg">
          <div className="font-mono text-[10px] text-foreground/40 mb-2 tracking-widest">MEASUREMENTS</div>
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between gap-6">
              <span className="text-foreground/50">ELEV:</span>
              <span className="text-green-400 tabular-nums">{coords.elevation.toFixed(3)}m</span>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-foreground/50">HD:</span>
              <span className="text-foreground tabular-nums">{coords.hdist.toFixed(3)}m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-foreground/20 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="font-mono text-[10px] text-foreground/60">TRACKING</span>
          </div>
          <span className="font-mono text-[10px] text-foreground/40">|</span>
          <span className="font-mono text-[10px] text-foreground/50">WGS84</span>
        </div>
        <div className="font-mono text-[10px] text-foreground/40">
          PRUTHVI COORDINATES
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-foreground/50">±1mm ACC</span>
          <div className="flex gap-0.5">
            <div className="w-1 h-3 bg-green-500/80" />
            <div className="w-1 h-3 bg-green-500/80" />
            <div className="w-1 h-3 bg-green-500/80" />
            <div className="w-1 h-3 bg-foreground/20" />
          </div>
        </div>
      </div>

      {/* Center hint text (fades on interaction) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center opacity-30">
          <div className="font-mono text-xs text-foreground/60 mb-1">MOVE CURSOR</div>
          <div className="font-mono text-[10px] text-foreground/40">to update coordinates</div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveCoordinateDisplay;
