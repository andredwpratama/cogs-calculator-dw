"use client";

import { useState } from "react";
import { CostItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Package } from "lucide-react";

interface SimpleCostTabProps {
  type: "local_purchase" | "consumable" | "service";
  items: CostItem[];
  onUpdate: (items: CostItem[]) => void;
}

export function SimpleCostTab({ type, items, onUpdate }: SimpleCostTabProps) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);

  const handleAddItem = () => {
    const item: CostItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      name: name || "New Item",
      quantity,
      unitPrice,
    };
    onUpdate([...items, item]);
    setName("");
    setQuantity(1);
    setUnitPrice(0);
  };

  const handleRemoveItem = (id: string) => {
    onUpdate(items.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Quick Add */}
      <section className="bg-slate-50 rounded-xl border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Item Name</label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Hydraulic Support Brackets"
              className="h-11 bg-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Quantity</label>
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
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Unit Price (IDR)</label>
            <Input 
              type="number"
              min="0"
              value={unitPrice === 0 ? "" : unitPrice} 
              onChange={(e) => {
                const val = e.target.value;
                setUnitPrice(val === "" ? 0 : Math.max(0, Number(val)));
              }}
              className="h-11 bg-white text-sm"
            />
          </div>
          <Button onClick={handleAddItem} className="h-11 bg-[#ec5b13] hover:bg-orange-600 font-bold col-span-full lg:col-span-1">
            <Plus className="w-4 h-4 mr-2" /> Add Item
          </Button>
        </div>
      </section>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold uppercase text-[10px] tracking-wider px-6">Item Details</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-wider px-4 text-right">Quantity</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-wider px-4 text-right">Unit Price</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-wider px-6 text-right">Subtotal</TableHead>
              <TableHead className="px-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="hover:bg-slate-50/50">
                <TableCell className="font-semibold text-slate-900 px-6 py-4 text-sm min-w-0">
                    <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[200px]" title={item.name}>{item.name}</span>
                    </div>
                </TableCell>
                <TableCell className="text-right px-4 py-4 text-sm whitespace-nowrap">{item.quantity}</TableCell>
                <TableCell className="text-right font-mono px-4 py-4 text-sm whitespace-nowrap">IDR {item.unitPrice.toLocaleString()}</TableCell>
                <TableCell className="text-right font-mono font-bold text-slate-900 px-6 py-4 text-sm whitespace-nowrap">
                  IDR {(item.quantity * item.unitPrice).toLocaleString()}
                </TableCell>
                <TableCell className="text-right px-6 py-4">
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-slate-400 text-sm italic">No items added yet.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
