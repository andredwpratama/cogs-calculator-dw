import Link from "next/link";
import { DraftingCompass } from "lucide-react";

export function TopBar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
      <Link href="/" className="flex items-center gap-3">
        <div className="size-10 bg-[#ec5b13] rounded-lg flex items-center justify-center text-white shrink-0">
          <DraftingCompass className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 leading-none">COGS Calculator</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Prototype System</p>
        </div>
      </Link>
    </header>
  );
}
