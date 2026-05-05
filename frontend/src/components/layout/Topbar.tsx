"use client";

import { Bell, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-3 flex-1 max-w-sm">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search stocks, topics..."
          className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none"
        />
      </div>
      <div className="flex items-center gap-3">
        <button className="relative rounded-full p-2 hover:bg-gray-50 transition-colors">
          <Bell className="h-4 w-4 text-gray-500" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="h-7 w-7 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-semibold">
          A
        </div>
      </div>
    </header>
  );
}
