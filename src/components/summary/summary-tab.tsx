"use client";

import { useMemo, useState, useTransition } from "react";
import { CostItem, Project } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TrendingUp, Lightbulb, Save } from "lucide-react";
import { updateProject } from "@/app/actions/projects";
import React from "react";

interface SummaryTabProps {
  project: Project;
  items: CostItem[];
}

export function SummaryTab({ project, items }: SummaryTabProps) {
  const [targetGP, setTargetGP] = useState(project.gpPercent);
  const overhead = project.overheadPercent;
  const [isPending, startTransition] = useTransition();

  const directCost = useMemo(() => {
    return items.reduce((sum, i) => {
      if (i.type === "labor") return sum + i.quantity * i.unitPrice * (i.metadata?.hours || 0);
      if (i.type === "material") return sum + (i.metadata?.weight || 0) * i.unitPrice * i.quantity;
      return sum + i.quantity * i.unitPrice;
    }, 0);
  }, [items]);

  const sellingPrice = directCost / (1 - (overhead + targetGP) / 100);
  const gpValue = sellingPrice * (targetGP / 100);
  const markup = sellingPrice / (directCost || 1);

  return (
    <div className="flex flex-col lg:flex-row gap-8 grow">
      {/* Left Panel: Cost Breakdown Summary */}
      <div className="flex-[1.5] flex flex-col gap-6">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-slate-900 font-bold text-lg">Cost Breakdown Summary</h3>
            <button className="text-[#ec5b13] text-sm font-bold flex items-center gap-1">
              <ExportNotesIcon className="w-4 h-4" /> Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-white hover:bg-transparent text-[10px]">
                  <TableHead className="px-6 py-4 text-slate-500 font-bold uppercase tracking-wider">Line Item</TableHead>
                  <TableHead className="px-6 py-4 text-slate-500 font-bold uppercase tracking-wider text-right">Unit Price</TableHead>
                  <TableHead className="px-6 py-4 text-slate-500 font-bold uppercase tracking-wider text-right">Quantity</TableHead>
                  <TableHead className="px-6 py-4 text-slate-500 font-bold uppercase tracking-wider text-right">Total Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100">
                {items.map((item) => {
                    const total = item.type === "labor" 
                        ? item.quantity * item.unitPrice * (item.metadata?.hours || 0)
                        : item.type === "material"
                        ? (item.metadata?.weight || 0) * item.unitPrice * item.quantity
                        : item.quantity * item.unitPrice;
                    
                    return (
                        <TableRow key={item.id} className="hover:bg-slate-50 transition-colors">
                            <TableCell className="px-6 py-4 text-slate-900 font-medium truncate max-w-[200px]" title={item.name}>{item.name}</TableCell>
                            <TableCell className="px-6 py-4 text-slate-700 text-right font-mono whitespace-nowrap">IDR {item.unitPrice.toLocaleString()}</TableCell>
                            <TableCell className="px-6 py-4 text-slate-700 text-right whitespace-nowrap">{item.quantity}</TableCell>
                            <TableCell className="px-6 py-4 text-slate-900 text-right font-bold whitespace-nowrap">IDR {total.toLocaleString()}</TableCell>
                        </TableRow>
                    )
                })}
                {items.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-slate-400 italic text-sm">No items added yet.</TableCell>
                    </TableRow>
                )}
              </TableBody>
              <tfoot>
                <TableRow className="bg-slate-900 hover:bg-slate-900">
                  <TableCell className="px-6 py-4 text-slate-200 font-bold uppercase text-xs tracking-widest" colSpan={3}>Total Estimated Direct Cost</TableCell>
                  <TableCell className="px-6 py-4 text-white text-right font-bold text-lg whitespace-nowrap">IDR {directCost.toLocaleString()}</TableCell>
                </TableRow>
              </tfoot>
            </Table>
          </div>
        </div>
      </div>

      {/* Right Panel: Negotiation Controls */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 flex flex-col gap-8 shadow-inner">
          <h3 className="text-slate-900 font-bold text-xl flex items-center gap-2">
            <AnalyticsIcon className="w-5 h-5 text-[#ec5b13]" /> Pricing Controls
          </h3>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <label className="text-slate-600 font-bold text-sm uppercase tracking-wide">Target Gross Profit (%)</label>
              <span className="text-[#ec5b13] text-3xl font-black">{targetGP}%</span>
            </div>
            <div className="relative w-full h-2 bg-slate-200 rounded-full">
              <input 
                className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-10 accent-[#ec5b13]" 
                max="65" min="5" type="range" 
                value={targetGP} 
                onChange={(e) => setTargetGP(Number(e.target.value))}
              />
              <div className="absolute top-0 left-0 h-2 bg-[#ec5b13] rounded-full" style={{ width: `${targetGP}%` }}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <MetricCard label="Final Selling Price" value={`IDR ${sellingPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} trend="Recommended for Approval" />
            <MetricCard label="Projected Gross Profit" value={`IDR ${gpValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
            
            <div className="bg-slate-900 p-5 rounded-lg flex justify-between items-center gap-4">
              <div className="min-w-0">
                <p className="text-slate-400 text-[10px] uppercase font-bold truncate">Markup</p>
                <p className="text-white text-lg font-bold truncate">{markup.toFixed(2)}x</p>
              </div>
              <div className="text-right min-w-0">
                <p className="text-slate-400 text-[10px] uppercase font-bold truncate">Breakeven</p>
                <p className="text-white text-lg font-bold truncate" title={`IDR ${directCost.toLocaleString()}`}>IDR {directCost.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-slate-200">
            <Button className="bg-[#ec5b13] hover:bg-orange-600 text-white font-bold py-6 rounded-xl shadow-lg shadow-orange-200">
              Generate Proposal Draft
            </Button>
            <Button 
                onClick={() => startTransition(() => updateProject(project.id, { gpPercent: targetGP, overheadPercent: overhead }))}
                disabled={isPending}
                variant="outline" 
                className="bg-white text-slate-900 border border-slate-200 font-bold py-6 rounded-xl hover:bg-slate-50 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" /> {isPending ? "Saving..." : "Save Simulation"}
            </Button>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex gap-4">
          <Lightbulb className="w-5 h-5 text-[#ec5b13] shrink-0" />
          <div className="flex flex-col gap-1">
            <p className="text-slate-900 text-sm font-bold">Negotiation Insight</p>
            <p className="text-slate-600 text-xs leading-relaxed">Increasing core API volume by 15% could unlock tier-2 discount, improving margin by 2.4%.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  trend?: string;
}

function MetricCard({ label, value, trend }: MetricCardProps) {
    return (
        <div className="bg-white p-5 rounded-lg border border-slate-100 flex flex-col gap-1 min-w-0">
            <p className="text-slate-500 text-[10px] font-bold uppercase truncate" title={label}>{label}</p>
            <p className="text-slate-900 text-2xl font-black truncate" title={value}>{value}</p>
            {trend && (
                <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-500 shrink-0" />
                    <span className="text-green-600 text-[10px] font-bold truncate" title={trend}>{trend}</span>
                </div>
            )}
        </div>
    )
}

function AnalyticsIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  )
}

function ExportNotesIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
      <path d="M12 8h3" />
    </svg>
  )
}
