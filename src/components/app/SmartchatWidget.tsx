'use client';
import { useState } from 'react';
import { MessageCircle, X, Sparkles, Send } from 'lucide-react';

export default function SmartchatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden mb-4 animate-in slide-in-from-bottom-5 duration-200">
          <div className="bg-gradient-to-r from-[#F21C29] to-[#C0121D] p-4 flex items-center justify-between text-white">
             <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#F7C844]" />
                <h3 className="font-bold text-sm">Smartchat AI Advisor</h3>
             </div>
             <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                <X className="w-5 h-5" />
             </button>
          </div>
          
          <div className="h-64 bg-slate-50 p-4 overflow-y-auto flex flex-col space-y-3">
             <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F21C29] to-[#C0121D] flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                   <Sparkles className="w-4 h-4 text-[#F7C844]" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-3 text-sm text-slate-800 shadow-sm leading-relaxed">
                   Hello! How can I assist your business strategy, proposal, or ad copy today?
                </div>
             </div>
          </div>

          <div className="px-3 pb-2 pt-1 overflow-x-auto no-scrollbar whitespace-nowrap bg-slate-50 border-t border-slate-100">
             <button className="inline-block bg-white border border-slate-200 text-[#F21C29] text-xs font-semibold px-3 py-1.5 rounded-full mr-2 hover:bg-red-50 transition-colors">
               Negotiate bulk pricing
             </button>
             <button className="inline-block bg-white border border-slate-200 text-[#F21C29] text-xs font-semibold px-3 py-1.5 rounded-full mr-2 hover:bg-red-50 transition-colors">
               Request portfolio samples
             </button>
          </div>
          
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
             <input 
               type="text" 
               placeholder="Type your question..." 
               className="flex-1 bg-slate-100 border-none outline-none rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:ring-1 focus:ring-[#F21C29]"
             />
             <button className="bg-[#F21C29] text-white p-2.5 rounded-xl hover:bg-[#D01420] transition-colors shadow-sm flex items-center justify-center">
                <Send className="w-4 h-4" />
             </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-[#F21C29] to-[#C0121D] rounded-full shadow-xl flex items-center justify-center text-white hover:opacity-90 transition-all hover:scale-105 active:scale-95 border-2 border-white"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
