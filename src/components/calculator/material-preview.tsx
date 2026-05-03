"use client";

import { useMemo } from "react";
import { Cuboid, ZoomIn, RefreshCw } from "lucide-react";
import { calculateWeight, MaterialShape } from "@/lib/calculations";

interface MaterialPreviewProps {
  shape: MaterialShape;
  dimensions: {
    length: number;
    width?: number;
    thickness?: number;
    outerDiameter?: number;
    height?: number;
    webThickness?: number;
    flangeWidth?: number;
    flangeThickness?: number;
  };
  density: number;
}

export function MaterialPreview({ shape, dimensions, density }: MaterialPreviewProps) {
  const weight = useMemo(() => {
    return calculateWeight(shape, dimensions, density);
  }, [shape, dimensions, density]);

  const viewData = useMemo(() => {
    const { 
        length = 0, width = 0, thickness = 0, 
        outerDiameter = 0, height = 0, 
        flangeWidth = 0, webThickness = 0, 
        flangeThickness = 0 
    } = dimensions;
    
    // Base scale factors
    const l = Math.max(length, 1);
    const h = Math.max(height || width || outerDiameter || 1, 1);
    const w = Math.max(width || flangeWidth || outerDiameter || 1, 1);
    const t = Math.max(thickness || webThickness || flangeThickness || 1, 0.5);

    const maxDim = Math.max(l, h);
    const scale = 140 / maxDim;

    return {
        l: l * scale,
        h: h * scale,
        w: w * scale,
        t: Math.max(t * scale * 2, 2)
    };
  }, [dimensions]);

  const render3DShape = () => {
    const { l, h, w, t } = viewData;
    const color = "currentColor";
    const x = 120 - (l / 2);
    const y = 60 + (h / 4);

    switch (shape) {
      case "plate":
        return (
          <g transform={`translate(${x}, ${y})`}>
            <path d={`M 0 0 L ${l} 0 L ${l+15} -15 L 15 -15 Z`} fill={color} fillOpacity="0.4" stroke={color} strokeWidth="1" />
            <path d={`M 0 0 L 0 ${h/2} L ${l} ${h/2} L ${l} 0 Z`} fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1" />
            <path d={`M ${l} 0 L ${l+15} -15 L ${l+15} ${h/2-15} L ${l} ${h/2} Z`} fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1" />
          </g>
        );
      case "round-bar":
      case "pipe":
        const r = h / 3;
        return (
          <g transform={`translate(${x}, 60)`}>
            <rect x="0" y={-r} width={l} height={r*2} fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1" />
            <ellipse cx="0" cy="0" rx={r/2} ry={r} fill={color} fillOpacity="0.05" stroke={color} strokeWidth="1" />
            <ellipse cx={l} cy="0" rx={r/2} ry={r} fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1" />
            {shape === "pipe" && (
                <ellipse cx={l} cy="0" rx={r/3} ry={r/1.5} fill="none" stroke={color} strokeWidth="0.5" strokeDasharray="2" />
            )}
          </g>
        );
      case "h-beam":
        const fW = w / 1.5;
        const fT = t;
        return (
          <g transform={`translate(${x}, ${y})`}>
            <path d={`M 0 0 H ${fW} V ${fT} H ${fW/2+fT/2} V ${h/2-fT} H ${fW} V ${h/2} H 0 V ${h/2-fT} H ${fW/2-fT/2} V ${fT} H 0 Z`} fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1" />
            <path d={`M ${fW} 0 L ${fW+20} -20 H 20 L 0 0`} fill={color} fillOpacity="0.4" stroke={color} strokeWidth="1" />
            <g transform={`translate(${l}, 0)`}>
                 <path d={`M 0 0 H ${fW} V ${fT} H ${fW/2+fT/2} V ${h/2-fT} H ${fW} V ${h/2} H 0 V ${h/2-fT} H ${fW/2-fT/2} V ${fT} H 0 Z`} fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1" />
            </g>
            <line x1={fW} y1="0" x2={fW+l} y2="0" stroke={color} strokeWidth="1" strokeOpacity="0.3" />
            <line x1={fW} y1={h/2} x2={fW+l} y2={h/2} stroke={color} strokeWidth="1" strokeOpacity="0.3" />
          </g>
        );
      case "angle":
        return (
          <g transform={`translate(${x}, ${y})`}>
            <path d={`M 0 0 V ${h/2} H ${w/2} V ${h/2-t} H ${t} V 0 Z`} fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1" />
            <path d={`M 0 0 L 20 -20 H ${20+t} L ${t} 0 Z`} fill={color} fillOpacity="0.4" stroke={color} strokeWidth="1" />
            <path d={`M ${w/2} ${h/2} L ${w/2+20} ${h/2-20} V ${h/2-t-20} L ${w/2} ${h/2-t} Z`} fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1" />
            <line x1="0" y1="0" x2={l} y2="0" stroke={color} strokeWidth="1" strokeOpacity="0.2" />
          </g>
        );
      case "unp":
        return (
            <g transform={`translate(${x}, ${y})`}>
                <path d={`M 0 0 H ${w/2} V ${t} H ${t} V ${h/2-t} H ${w/2} V ${h/2} H 0 Z`} fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1" />
                <path d={`M 0 0 L 20 -20 H ${20+w/2} L ${w/2} 0 Z`} fill={color} fillOpacity="0.4" stroke={color} strokeWidth="1" />
                <line x1={w/2} y1="0" x2={w/2+l} y2="0" stroke={color} strokeWidth="1" strokeOpacity="0.2" />
            </g>
        )
      default:
        return <rect x="40" y="30" width={l} height={h/2} fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                <Cuboid className="w-4 h-4 text-slate-400" /> Technical Preview
            </div>
            <div className="flex gap-2 text-slate-400">
                <ZoomIn className="w-4 h-4 cursor-pointer hover:text-[#ec5b13]" />
                <RefreshCw className="w-4 h-4 cursor-pointer hover:text-[#ec5b13]" />
            </div>
        </div>
        <div className="relative flex-1 bg-[#1a110c] overflow-hidden min-h-[350px] flex items-center justify-center">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="grid grid-cols-12 h-full w-full">
                    {Array.from({ length: 144 }).map((_, i) => (
                        <div key={i} className="border border-white/20"></div>
                    ))}
                </div>
            </div>
            
            <div className="relative z-10 w-full flex flex-col items-center">
                <div className="w-full flex justify-center py-8">
                    <svg viewBox="0 0 240 120" className="w-64 h-48 text-[#ec5b13] transition-all duration-300 drop-shadow-[0_0_10px_rgba(236,91,19,0.2)]">
                        {render3DShape()}
                    </svg>
                </div>
                
                <div className="mt-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ec5b13]/10 border border-[#ec5b13]/20 text-[#ec5b13] text-[9px] font-black uppercase tracking-[0.2em] mb-3">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ec5b13] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ec5b13]"></span>
                        </span>
                        {shape.replace("-", " ")} Rendering
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-y-1 gap-x-3 px-6 text-white/40 text-[10px] font-mono leading-relaxed">
                        <Dim label="L" val={dimensions.length} />
                        {dimensions.width && dimensions.width > 0 && <Dim label="W" val={dimensions.width} />}
                        {dimensions.height && dimensions.height > 0 && <Dim label="H" val={dimensions.height} />}
                        {dimensions.thickness && dimensions.thickness > 0 && <Dim label="T" val={dimensions.thickness} />}
                        {dimensions.outerDiameter && dimensions.outerDiameter > 0 && <Dim label="Ø" val={dimensions.outerDiameter} />}
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                <SummaryMetric label="Est. Weight" value={weight > 1000 ? (weight/1000).toFixed(2) : weight.toFixed(2)} unit={weight > 1000 ? "t" : "kg"} />
                <SummaryMetric label="Material" value={(density * 1000000).toFixed(2)} unit="g/cm³" />
            </div>
        </div>
    </div>
  );
}

interface DimProps {
  label: string;
  val: number;
}

function Dim({ label, val }: DimProps) {
    return (
        <span className="bg-white/5 px-1.5 py-0.5 rounded">
            <span className="text-[#ec5b13]/70 mr-1">{label}:</span>
            <span className="text-white/70">{val.toLocaleString()}</span>
        </span>
    )
}

interface SummaryMetricProps {
  label: string;
  value: string | number;
  unit: string;
}

function SummaryMetric({ label, value, unit }: SummaryMetricProps) {
    return (
        <div className="flex-1 bg-black/40 backdrop-blur-md px-3 py-2 rounded-lg border border-white/5">
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-sm font-black text-white">{value} <span className="text-[10px] font-normal text-white/40">{unit}</span></p>
        </div>
    );
}
