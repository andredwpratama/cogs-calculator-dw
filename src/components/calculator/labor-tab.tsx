"use client";

import { useState } from "react";
import { CostItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Bolt } from "lucide-react";

interface LaborTabProps {
  items: CostItem[];
  onUpdate: (items: CostItem[]) => void;
}

export function LaborTab({ items, onUpdate }: LaborTabProps) {
  const [newRole, setNewRole] = useState("");
  const [newLevel, setNewLevel] = useState("Junior");
  const [newQuantity, setNewQuantity] = useState(1);
  const [newHours, setNewHours] = useState(40);
  const [newRate, setNewRate] = useState(0);

  const handleAddItem = () => {
    const item: CostItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: "labor",
      name: newRole || "New Role",
      quantity: newQuantity,
      unitPrice: newRate,
      metadata: {
        level: newLevel,
        hours: newHours,
      },
    };
    onUpdate([...items, item]);
    setNewRole("");
  };

  const handleRemoveItem = (id: string) => {
    onUpdate(items.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Quick Add Form */}
      <section className="bg-slate-50 rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bolt className="w-5 h-5 text-[#ec5b13]" />
          <h3 className="text-slate-900 text-lg font-bold">Quick Add Role</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          <div className="lg:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Specialized Role</label>
            <Input 
              value={newRole} 
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="e.g. Lead Welder (TIG)"
              className="h-11 bg-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Level</label>
            <Select value={newLevel} onValueChange={(val) => setNewLevel(val || "")}>
                <SelectTrigger className="h-11 bg-white text-sm">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Master">Master</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Qty (HC)</label>
            <Input 
              type="number"
              min="0"
              value={newQuantity === 0 ? "" : newQuantity} 
              onChange={(e) => {
                const val = e.target.value;
                setNewQuantity(val === "" ? 0 : Math.max(0, Number(val)));
              }}
              className="h-11 bg-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Est. Hours</label>
            <Input 
              type="number"
              min="0"
              value={newHours === 0 ? "" : newHours} 
              onChange={(e) => {
                const val = e.target.value;
                setNewHours(val === "" ? 0 : Math.max(0, Number(val)));
              }}
              className="h-11 bg-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rate (IDR)</label>
            <Input 
              type="number"
              min="0"
              value={newRate === 0 ? "" : newRate} 
              onChange={(e) => {
                const val = e.target.value;
                setNewRate(val === "" ? 0 : Math.max(0, Number(val)));
              }}
              className="h-11 bg-white text-sm"
            />
          </div>
          <Button onClick={handleAddItem} className="h-11 bg-[#ec5b13] hover:bg-orange-600 font-bold">
            <Plus className="w-4 h-4 mr-2" /> Allocate
          </Button>
        </div>
      </section>

      {/* Allocation Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-slate-900 font-bold text-sm">Resource Allocation Details</h3>
        </div>
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold uppercase text-[10px] tracking-wider px-6">Role Description</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-wider px-4">Level</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-wider px-4 text-right">Qty (HC)</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-wider px-4 text-right">Hours/Wk</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-wider px-4 text-right">Base Rate</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-wider px-6 text-right">Weekly Subtotal</TableHead>
              <TableHead className="text-right px-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="hover:bg-slate-50/50">
                <TableCell className="font-semibold text-slate-900 px-6 py-4 text-sm">{item.name}</TableCell>
                <TableCell className="px-4 py-4 text-xs">{item.metadata?.level}</TableCell>
                <TableCell className="text-right px-4 py-4 text-sm">{item.quantity}</TableCell>
                <TableCell className="text-right px-4 py-4 text-sm">{item.metadata?.hours}</TableCell>
                <TableCell className="text-right font-mono px-4 py-4 text-sm whitespace-nowrap">IDR {item.unitPrice.toLocaleString()}</TableCell>
                <TableCell className="text-right font-mono font-bold text-slate-900 px-6 py-4 text-sm whitespace-nowrap">
                  IDR {(item.quantity * item.unitPrice * (item.metadata?.hours || 0)).toLocaleString()}
                </TableCell>
                <TableCell className="text-right px-6 py-4">
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)} className="text-slate-400 hover:text-red-500">
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {items.length > 0 && (
              <TableRow className="bg-[#ec5b13]/5 border-t-2 border-slate-200">
                <TableCell className="font-bold text-[#ec5b13] italic px-6 py-4">Allocation Summary</TableCell>
                <TableCell className="px-4 py-4" />
                <TableCell className="text-right font-bold px-4 py-4">{items.reduce((sum, i) => sum + i.quantity, 0)}</TableCell>
                <TableCell className="text-right font-bold px-4 py-4">{items.reduce((sum, i) => sum + (i.metadata?.hours || 0), 0)}</TableCell>
                <TableCell className="px-4 py-4" />
                <TableCell className="text-right font-mono font-bold text-[#ec5b13] px-6 py-4 whitespace-nowrap text-base">
                  IDR {items.reduce((sum, i) => sum + i.quantity * i.unitPrice * (i.metadata?.hours || 0), 0).toLocaleString()}
                </TableCell>
                <TableCell className="px-6 py-4" />
              </TableRow>
            )}
            {items.length === 0 && (
                <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-slate-400 text-sm italic">No labor resources allocated.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
