"use client";

import { CostItem } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { TrendingUp } from "lucide-react";
import React from "react";

interface ManufacturingTabProps {
  materialItems: CostItem[];
  manufacturingItems: CostItem[];
  onUpdate: (items: CostItem[]) => void;
}

export function ManufacturingTab({ materialItems, manufacturingItems, onUpdate }: ManufacturingTabProps) {
  const handlePriceChange = (materialId: string, process: string, value: number) => {
    const existing = manufacturingItems.find((i) => i.metadata?.materialId === materialId);
    let newItems: CostItem[];

    if (existing) {
      newItems = manufacturingItems.map((i) => {
        if (i.metadata?.materialId === materialId) {
          return {
            ...i,
            metadata: { ...i.metadata, [process]: value },
            unitPrice: Object.entries({ ...i.metadata, [process]: value })
              .filter(([k]) => ["cutting", "forming", "welding", "painting"].includes(k))
              .reduce((sum, [, v]) => sum + (Number(v) || 0), 0),
          };
        }
        return i;
      });
    } else {
      const material = materialItems.find((m) => m.id === materialId);
      newItems = [
        ...manufacturingItems,
        {
          id: `mfg-${materialId}`,
          type: "manufacturing",
          name: `Manufacturing - ${material?.name}`,
          quantity: material?.quantity || 1,
          unitPrice: value,
          metadata: {
            materialId,
            [process]: value,
          },
        },
      ];
    }
    onUpdate(newItems);
  };

  const getVal = (materialId: string, process: string): number => {
    const item = manufacturingItems.find((i) => i.metadata?.materialId === materialId);
    const val = item?.metadata?.[process];
    return typeof val === "number" ? val : 0;
  };

  const totalCost = manufacturingItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Process Cost" value={`IDR ${totalCost.toLocaleString()}`} trend="+2.4% vs last period" />
        <StatCard label="Base Currency" value="IDR" sub="Internal rates audited weekly" />
        <StatCard label="Cost Efficiency" value="94.2%" progress={94.2} />
        <StatCard label="Active Routes" value={materialItems.length} sub="Configured items" />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 border-y border-slate-200">
              <TableRow>
                <TableHead className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider">Material Item</TableHead>
                <TableHead className="px-4 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider text-center">Cutting</TableHead>
                <TableHead className="px-4 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider text-center">Forming</TableHead>
                <TableHead className="px-4 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider text-center">Welding</TableHead>
                <TableHead className="px-4 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider text-center">Painting</TableHead>
                <TableHead className="px-6 py-4 text-slate-900 text-xs font-bold uppercase tracking-wider text-right bg-slate-100/50">Row Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100">
              {materialItems.map((m) => {
                  const subtotal = getVal(m.id, "cutting") + getVal(m.id, "forming") + getVal(m.id, "welding") + getVal(m.id, "painting");
                  return (
                    <TableRow key={m.id} className="hover:bg-slate-50/50 group transition-colors">
                        <TableCell className="px-6 py-5">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="size-10 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                    <PrecisionManufacturingIcon className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-slate-900 text-sm font-bold truncate max-w-[150px] sm:max-w-[200px]" title={m.name}>{m.name}</p>
                                    <p className="text-slate-400 text-xs truncate" title={String(m.metadata?.shape)}>{String(m.metadata?.shape)}</p>
                                </div>
                            </div>
                        </TableCell>
                        <ProcessInput value={getVal(m.id, "cutting")} onChange={(v: number) => handlePriceChange(m.id, "cutting", v)} />
                        <ProcessInput value={getVal(m.id, "forming")} onChange={(v: number) => handlePriceChange(m.id, "forming", v)} />
                        <ProcessInput value={getVal(m.id, "welding")} onChange={(v: number) => handlePriceChange(m.id, "welding", v)} />
                        <ProcessInput value={getVal(m.id, "painting")} onChange={(v: number) => handlePriceChange(m.id, "painting", v)} />
                        <TableCell className="px-6 py-5 text-right font-bold text-slate-900 bg-slate-50/30 whitespace-nowrap">
                            IDR {(subtotal * m.quantity).toLocaleString()}
                        </TableCell>
                    </TableRow>
                  )
              })}
              {materialItems.length === 0 && (
                  <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-slate-400 text-sm italic">Add materials first to configure routing.</TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  sub?: string;
  progress?: number;
}

function StatCard({ label, value, trend, sub, progress }: StatCardProps) {
    return (
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-slate-50 border border-slate-100 min-w-0">
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider truncate" title={label}>{label}</p>
            <p className="text-slate-900 text-3xl font-bold leading-tight truncate" title={String(value)}>{value}</p>
            {trend && (
                <div className="flex items-center gap-1 text-emerald-600">
                    <TrendingUp className="w-3 h-3 shrink-0" />
                    <p className="text-xs font-bold leading-normal truncate" title={trend}>{trend}</p>
                </div>
            )}
            {sub && <p className="text-slate-400 text-xs font-medium truncate" title={sub}>{sub}</p>}
            {progress !== undefined && (
                 <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            )}
        </div>
    )
}

interface ProcessInputProps {
  value: number;
  onChange: (val: number) => void;
}

function ProcessInput({ value, onChange }: ProcessInputProps) {
    return (
        <TableCell className="px-4 py-5 text-center">
            <Input 
                type="number" 
                min="0"
                value={value === 0 ? "" : value} 
                onChange={(e) => {
                  const val = e.target.value;
                  onChange(val === "" ? 0 : Math.max(0, Number(val)));
                }}
                className="w-24 mx-auto text-center text-sm font-medium bg-white border border-slate-200 rounded-lg py-2 focus:ring-[#ec5b13] focus:border-[#ec5b13] h-9" 
            />
        </TableCell>
    )
}

function PrecisionManufacturingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8.5 22 1.1-2.7a2 2 0 0 1 1.9-1.3h5a2 2 0 0 1 1.9 1.3l1.1 2.7" />
      <path d="M9 12a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" />
      <path d="M9 16H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-4" />
      <path d="M10 7V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2" />
    </svg>
  )
}
