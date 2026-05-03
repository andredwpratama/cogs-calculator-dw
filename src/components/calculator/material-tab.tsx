"use client";

import { useState, useMemo, useEffect } from "react";
import { CostItem, MaterialShape, MaterialDimensions } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2, Package } from "lucide-react";
import { calculateWeight } from "@/lib/calculations";
import { MATERIAL_GRADES } from "@/lib/constants";
import React from "react";

interface MaterialTabProps {
  items: CostItem[];
  activeItemId: string | null;
  onActiveItemChange: (id: string | null) => void;
  onUpdate: (items: CostItem[]) => void;
  onLiveUpdate?: (draft: { shape: MaterialShape; dimensions: MaterialDimensions; density: number }) => void;
}

export function MaterialTab({ items, activeItemId, onActiveItemChange, onUpdate, onLiveUpdate }: MaterialTabProps) {
  const [name, setName] = useState("");
  const [shape, setShape] = useState<MaterialShape>("plate");
  const [gradeId, setGradeId] = useState(MATERIAL_GRADES[0].id);
  const [dimensions, setDimensions] = useState<MaterialDimensions>({ 
    length: 0, 
    width: 0, 
    thickness: 0,
    outerDiameter: 0,
    innerDiameter: 0,
    height: 0,
    webThickness: 0,
    flangeWidth: 0,
    flangeThickness: 0
  });
  const [quantity, setQuantity] = useState(1);
  const [unitPriceOverride, setUnitPriceOverride] = useState<number | null>(null);

  const selectedGrade = MATERIAL_GRADES.find(g => g.id === gradeId) || MATERIAL_GRADES[0];
  const density = selectedGrade.density;
  const basePrice = selectedGrade.basePrice;
  const unitPrice = unitPriceOverride ?? basePrice;

  const weight = useMemo(() => calculateWeight(shape, dimensions, density), [shape, dimensions, density]);

  useEffect(() => {
    if (onLiveUpdate) {
        onLiveUpdate({ shape, dimensions, density });
    }
  }, [shape, dimensions, density, onLiveUpdate]);

  const handleAddItem = () => {
    const item: CostItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: "material",
      name: name || `${selectedGrade.name} ${shape.replace("-", " ")}`,
      quantity,
      unitPrice,
      metadata: {
        shape,
        dimensions: { ...dimensions },
        density,
        weight,
        gradeId,
      },
    };
    onUpdate([...items, item]);
    setName("");
    setUnitPriceOverride(null);
  };

  const updateDimension = (key: keyof MaterialDimensions, val: number) => {
    setDimensions(prev => ({ ...prev, [key]: val }));
    onActiveItemChange(null); 
  };

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#ec5b13]" />
            Material Configuration
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-600 uppercase">Config Mode</span>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Shape Profile</label>
              <Select value={shape} onValueChange={(v: MaterialShape) => setShape(v)}>
                <SelectTrigger className="h-11 bg-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plate">Plate / Sheet</SelectItem>
                  <SelectItem value="round-bar">Round Bar</SelectItem>
                  <SelectItem value="pipe">Pipe / Tube</SelectItem>
                  <SelectItem value="h-beam">H-Beam / I-Beam</SelectItem>
                  <SelectItem value="angle">Angle / L-Profile</SelectItem>
                  <SelectItem value="unp">UNP / C-Channel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Material Grade</label>
              <Select value={gradeId} onValueChange={setGradeId}>
                <SelectTrigger className="h-11 bg-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MATERIAL_GRADES.map(g => (
                      <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Custom Name (Optional)</label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Main Chassis Plate"
                className="h-11 bg-white text-sm"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <DimensionInput label="Length (mm)" value={dimensions.length} onChange={(v: number) => updateDimension("length", v)} />
            
            {shape === "plate" && (
                <>
                    <DimensionInput label="Width (mm)" value={dimensions.width ?? 0} onChange={(v: number) => updateDimension("width", v)} />
                    <DimensionInput label="Thickness (mm)" value={dimensions.thickness ?? 0} onChange={(v: number) => updateDimension("thickness", v)} />
                </>
            )}

            {(shape === "round-bar" || shape === "pipe") && (
                <DimensionInput label="Outer Dia (mm)" value={dimensions.outerDiameter ?? 0} onChange={(v: number) => updateDimension("outerDiameter", v)} />
            )}

            {shape === "pipe" && (
                <DimensionInput label="Wall Thick (mm)" value={dimensions.thickness ?? 0} onChange={(v: number) => updateDimension("thickness", v)} />
            )}

            {(shape === "h-beam" || shape === "unp") && (
                <>
                    <DimensionInput label="Height (mm)" value={dimensions.height ?? 0} onChange={(v: number) => updateDimension("height", v)} />
                    <DimensionInput label="Web Thick (mm)" value={dimensions.webThickness ?? 0} onChange={(v: number) => updateDimension("webThickness", v)} />
                    <DimensionInput label="Flange Width (mm)" value={dimensions.flangeWidth ?? 0} onChange={(v: number) => updateDimension("flangeWidth", v)} />
                    <DimensionInput label="Flange Thick (mm)" value={dimensions.flangeThickness ?? 0} onChange={(v: number) => updateDimension("flangeThickness", v)} />
                </>
            )}

            {shape === "angle" && (
                <>
                    <DimensionInput label="Height (mm)" value={dimensions.height ?? 0} onChange={(v: number) => updateDimension("height", v)} />
                    <DimensionInput label="Width (mm)" value={dimensions.width ?? 0} onChange={(v: number) => updateDimension("width", v)} />
                    <DimensionInput label="Thickness (mm)" value={dimensions.thickness ?? 0} onChange={(v: number) => updateDimension("thickness", v)} />
                </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Quantity</label>
              <Input 
                type="number" 
                min="0"
                value={quantity === 0 ? "" : quantity} 
                onChange={(e) => {
                  const val = e.target.value;
                  setQuantity(val === "" ? 0 : Math.max(0, Number(val)));
                }} 
                className="h-11 bg-white text-sm" 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Price Override (IDR/kg)</label>
              <Input 
                type="number" 
                min="0"
                value={unitPriceOverride ?? ""} 
                onChange={(e) => setUnitPriceOverride(e.target.value ? Math.max(0, Number(e.target.value)) : null)} 
                placeholder={`Base: ${basePrice}`}
                className="h-11 bg-white text-sm" 
              />
            </div>
            <div className="flex flex-col justify-end">
                <Button onClick={handleAddItem} className="w-full bg-[#ec5b13] hover:bg-orange-600 text-white font-bold h-11 rounded-lg transition-all shadow-lg shadow-orange-200">
                    <PlusCircle className="w-4 h-4 mr-2" /> Add Item
                </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
            <div className="flex gap-6">
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Unit Weight</p>
                    <p className="text-lg font-black text-slate-900">{weight.toFixed(3)} kg</p>
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Total Weight</p>
                    <p className="text-lg font-black text-slate-900">{(weight * quantity).toFixed(3)} kg</p>
                </div>
            </div>
            <div className="text-right max-w-[200px]">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated Subtotal</p>
                <p className="text-xl md:text-2xl font-black text-[#ec5b13] truncate" title={(weight * unitPrice * quantity).toLocaleString()}>
                    IDR {(weight * unitPrice * quantity).toLocaleString()}
                </p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm">Project Itemization</h3>
            <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Material Cost</p>
                <p className="text-lg font-bold text-[#ec5b13]">
                    {items.reduce((sum, i) => sum + (i.metadata?.weight as number || 0) * i.quantity, 0).toFixed(2)} kg | 
                    IDR {items.reduce((sum, i) => sum + (i.metadata?.weight as number || 0) * i.unitPrice * i.quantity, 0).toLocaleString()}
                </p>
            </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 text-[10px]">
              <TableRow>
                <TableHead className="px-6 py-3 font-bold text-slate-500 uppercase tracking-wider">Item Details</TableHead>
                <TableHead className="px-6 py-3 font-bold text-slate-500 uppercase tracking-wider">Dimensions (mm)</TableHead>
                <TableHead className="px-6 py-3 font-bold text-slate-500 uppercase tracking-wider text-right">Qty</TableHead>
                <TableHead className="px-6 py-3 font-bold text-slate-500 uppercase tracking-wider text-right">Weight</TableHead>
                <TableHead className="px-6 py-3 font-bold text-slate-500 uppercase tracking-wider text-right">Subtotal</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 text-sm">
              {items.map((item) => (
                <TableRow 
                    key={item.id} 
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${activeItemId === item.id ? "bg-orange-50/50" : ""}`}
                    onClick={() => onActiveItemChange(item.id)}
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                           <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">{item.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">{String(item.metadata?.shape)}</p>
                        </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[10px] text-slate-600 font-mono">
                    {(item.metadata?.dimensions as MaterialDimensions)?.length}L 
                    {(item.metadata?.dimensions as MaterialDimensions)?.width ? ` x ${(item.metadata?.dimensions as MaterialDimensions).width}W` : ""}
                    {(item.metadata?.dimensions as MaterialDimensions)?.thickness ? ` x ${(item.metadata?.dimensions as MaterialDimensions).thickness}T` : ""}
                    {(item.metadata?.dimensions as MaterialDimensions)?.outerDiameter ? ` x ø${(item.metadata?.dimensions as MaterialDimensions).outerDiameter}` : ""}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right font-bold tabular-nums">{item.quantity}</TableCell>
                  <TableCell className="px-6 py-4 text-right tabular-nums">{(Number(item.metadata?.weight) * item.quantity).toFixed(2)} kg</TableCell>
                  <TableCell className="px-6 py-4 font-bold text-right tabular-nums whitespace-nowrap">
                    IDR {(Number(item.metadata?.weight) * item.unitPrice * item.quantity).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onUpdate(items.filter(i => i.id !== item.id)); }} className="text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

interface DimensionInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
}

function DimensionInput({ label, value, onChange }: DimensionInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{label}</label>
      <Input 
        type="number" 
        min="0"
        value={value === 0 ? "" : value} 
        onChange={(e) => {
          const val = e.target.value;
          onChange(val === "" ? 0 : Math.max(0, Number(val)));
        }} 
        className="w-full rounded border-slate-200 text-xs bg-white h-8 py-1 px-2 focus:ring-[#ec5b13] focus:border-[#ec5b13]" 
        placeholder="0" 
      />
    </div>
  );
}
