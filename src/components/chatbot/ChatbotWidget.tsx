import React, { useState } from 'react';
import { Sparkles, MessageSquare, X } from 'lucide-react';
import { ChatbotWindow } from './ChatbotWindow';

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {/* Tooltip bubble on first load */}
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-[#00204A] text-white px-3.5 py-2 rounded-2xl shadow-xl text-xs font-bold border border-amber-400/40 cursor-pointer hover:bg-slate-900 transition-all animate-bounce"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>Hỏi AI món ngon Đà Nẵng</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
        )}

        {/* Main Floating Round Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 cursor-pointer group relative ${
            isOpen
              ? 'bg-slate-900 text-white rotate-90 scale-95'
              : 'bg-amber-400 hover:bg-amber-500 text-slate-950 scale-100 hover:scale-110 ring-4 ring-amber-300/40 shadow-amber-400/30'
          }`}
          title={isOpen ? 'Đóng AI Chatbot' : 'Mở Trợ lý AI BeFood'}
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform" />
          ) : (
            <>
              <Sparkles className="w-7 h-7 fill-current group-hover:rotate-12 transition-transform" />
              {/* Notification Badge */}
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                AI
              </span>
            </>
          )}
        </button>
      </div>

      {/* Chatbot Window Container */}
      <ChatbotWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

