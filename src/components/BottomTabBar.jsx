import React from 'react';
import { 
  Home, 
  LayoutGrid, 
  Radio, 
  Library, 
  Search 
} from 'lucide-react';

export default function BottomTabBar({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'new', label: 'New', icon: LayoutGrid },
    { id: 'radio', label: 'Radio', icon: Radio },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'search', label: 'Search', icon: Search }
  ];

  return (
    <div className="fixed bottom-3 inset-x-3 sm:inset-x-6 max-w-lg mx-auto z-40 pointer-events-auto">
      <nav className="h-[64px] bg-[#1c1c1e]/90 backdrop-blur-3xl border border-white/10 rounded-[32px] px-2 shadow-2xl shadow-black/80 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-200 select-none ${
                isActive 
                  ? 'text-[#007AFF] scale-105' 
                  : 'text-white/45 hover:text-white/80 active:scale-95'
              }`}
            >
              <div className="relative">
                <Icon size={21} strokeWidth={isActive ? 2.4 : 1.9} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#007AFF] shadow-sm shadow-[#007AFF]" />
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium tracking-tight ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
