"use client";

import { useState, useMemo, useTransition } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimpleCostTab } from "@/components/calculator/simple-cost-tab";
import { MaterialTab } from "@/components/calculator/material-tab";
import { MaterialPreview } from "@/components/calculator/material-preview";
import { ManufacturingTab } from "@/components/calculator/manufacturing-tab";
import { LaborTab } from "@/components/calculator/labor-tab";
import { SummaryTab } from "@/components/summary/summary-tab";
import { CostItem, Project, CostItemMetadata, MaterialShape, MaterialDimensions } from "@/lib/types";
import { syncCostItems } from "@/app/actions/cost-items";
import { Button } from "@/components/ui/button";
import { ChevronRight, Package, Clock, Banknote, Percent } from "lucide-react";
import Link from "next/link";

interface CalculatorWrapperProps {
  project: Project;
  initialItems: CostItem[];
}

export default function CalculatorWrapper({ project, initialItems }: CalculatorWrapperProps) {
  const [activeTab, setActiveTab] = useState("material");
  const [items, setItems] = useState<CostItem[]>(initialItems);
  const [activeItemId, setActiveItemId] = useState<string | null>(initialItems[0]?.id || null);
  const [draftMaterial, setDraftMaterial] = useState<CostItemMetadata | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeItem = useMemo(() => 
    items.find(i => i.id === activeItemId) || items[0],
  [items, activeItemId]);

  const tabs = [
    { id: "local-purchase", label: "Local Purchase", type: "local_purchase" },
    { id: "material", label: "Material", type: "material" },
    { id: "manufacturing", label: "Manufacturing", type: "manufacturing" },
    { id: "consumable", label: "Consumable", type: "consumable" },
    { id: "service", label: "Service", type: "service" },
    { id: "labor", label: "Labor", type: "labor" },
    { id: "summary", label: "Summary", type: "summary" },
  ];

  const filteredItems = (type: string) => items.filter((i) => i.type === type);

  const handleUpdateItems = (newItems: CostItem[], type: string) => {
    setItems((prev) => {
      let updated = [
        ...prev.filter((i) => i.type !== type),
        ...newItems,
      ];
      if (type === "material") {
        const materialIds = new Set(newItems.map((m) => m.id));
        updated = updated.filter((i) => {
          if (i.type === "manufacturing") {
            return materialIds.has(i.metadata?.materialId as string);
          }
          return true;
        });
      }
      return updated;
    });
  };

  const handleSave = async () => {
    startTransition(async () => {
      await syncCostItems(project.id, items);
    });
  };

  const totalCost = useMemo(() => {
    return items.reduce((sum, i) => {
      const base = i.quantity * i.unitPrice;
      switch (i.type) {
        case "labor":
          return sum + base * (i.metadata?.hours || 0);
        case "material":
          return sum + base * (i.metadata?.weight || 0);
        default:
          return sum + base;
      }
    }, 0);
  }, [items]);

  const manHours = useMemo(() => 
    items.filter(i => i.type === "labor").reduce((sum, i) => sum + (i.metadata?.hours || 0) * i.quantity, 0),
  [items]);

  return (
    <div className="max-w-[1400px] mx-auto p-6 lg:p-10">
      {/* Page Title & Actions */}
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div className="flex flex-col gap-1 min-w-0">
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
            <Link className="hover:text-[#ec5b13]" href="/">Projects</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="text-slate-600 truncate max-w-[200px]">{project.name}</span>
          </nav>
          <h1 className="text-slate-900 text-3xl font-black leading-tight tracking-tight truncate max-w-full" title={project.name}>{project.name}</h1>
          <p className="text-slate-500 text-base font-normal">Manage industrial workforce roles, man-hours, and specialized rates.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Button variant="outline" className="flex items-center gap-2 border-slate-200 rounded-lg text-slate-700 bg-white hover:bg-slate-50 font-semibold text-sm">
             Import
          </Button>
          <Button onClick={handleSave} disabled={isPending} className="bg-[#ec5b13] hover:bg-orange-600 text-white rounded-lg font-semibold text-sm shadow-sm min-w-[120px]">
             {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex border-b border-slate-200 bg-white px-4 md:px-10 gap-8 h-auto rounded-none overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id} 
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#ec5b13] data-[state=active]:text-[#ec5b13] rounded-none bg-transparent shadow-none py-3 px-0 text-sm font-bold leading-normal tracking-[0.015em] text-slate-500 hover:text-slate-700 transition-colors shrink-0"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Summary KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KPI icon={<Package className="w-4 h-4 text-slate-400" />} label="Total Items" value={items.length} />
            <KPI icon={<Clock className="w-4 h-4 text-slate-400" />} label="Total Man-Hours" value={manHours.toLocaleString()} unit="Hrs" />
            <KPI icon={<Banknote className="w-4 h-4 text-slate-400" />} label="Weekly Prime Cost" value={`IDR ${totalCost.toLocaleString()}`} />
            <KPI icon={<Percent className="w-4 h-4 text-[#ec5b13]" />} label="Budget Utilization" value={`${((totalCost / 10000000) * 100).toFixed(1)}%`} progress={(totalCost / 10000000) * 100} />
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="focus-visible:outline-none focus-visible:ring-0">
             <div className="bg-transparent p-0">
                {["local_purchase", "consumable", "service"].includes(tab.type) ? (
                  <SimpleCostTab
                    type={tab.type as "local_purchase" | "consumable" | "service"}
                    items={filteredItems(tab.type)}
                    onUpdate={(newItems) => handleUpdateItems(newItems, tab.type)}
                  />
                ) : tab.type === "material" ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7">
                      <MaterialTab
                        items={filteredItems("material")}
                        activeItemId={activeItemId}
                        onActiveItemChange={setActiveItemId}
                        onUpdate={(newItems) => handleUpdateItems(newItems, "material")}
                        onLiveUpdate={setDraftMaterial}
                      />
                    </div>
                    <div className="lg:col-span-5 space-y-4 sticky top-6 self-start">
                        {(activeItemId || draftMaterial) ? (
                            <MaterialPreview 
                                shape={activeItemId ? (activeItem?.metadata?.shape as MaterialShape) : (draftMaterial?.shape as MaterialShape)} 
                                dimensions={activeItemId ? (activeItem?.metadata?.dimensions as MaterialDimensions) : (draftMaterial?.dimensions as MaterialDimensions)} 
                                density={activeItemId ? (activeItem?.metadata?.density as number) : (draftMaterial?.density as number)}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-[400px] border-2 border-dashed rounded-xl bg-white text-slate-400">
                                <p className="text-xs">Configure or select a material</p>
                            </div>
                        )}
                    </div>
                  </div>
                ) : tab.type === "manufacturing" ? (
                  <ManufacturingTab
                    materialItems={filteredItems("material")}
                    manufacturingItems={filteredItems("manufacturing")}
                    onUpdate={(newItems) => handleUpdateItems(newItems, "manufacturing")}
                  />
                ) : tab.type === "labor" ? (
                  <LaborTab
                    items={filteredItems("labor")}
                    onUpdate={(newItems) => handleUpdateItems(newItems, "labor")}
                  />
                ) : tab.type === "summary" ? (
                  <SummaryTab
                    project={project}
                    items={items}
                  />
                ) : null}
             </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

interface KPIProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  progress?: number;
}

function KPI({ label, value, unit, icon, progress }: KPIProps) {
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm min-w-0">
            <div className="flex items-center gap-2 mb-1">
                {icon}
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate" title={label}>{label}</p>
            </div>
            <p className="text-2xl font-black text-slate-900 truncate" title={String(value)}>
                {value} {unit && <span className="text-sm font-normal text-slate-500 ml-1">{unit}</span>}
            </p>
            {progress !== undefined && (
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#ec5b13] h-full rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                </div>
            )}
        </div>
    );
}
