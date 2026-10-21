'use client';

export default function RightContextRail() {
  return (
    <aside className="hidden xl:block w-[320px] fixed right-0 top-0 h-screen border-l border-slate-200 bg-white p-4 overflow-y-auto">
      
      {/* Pro Upgrade Card */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 mb-6">
        <h3 className="font-bold text-slate-900 mb-1">Upgrade to Pro</h3>
        <p className="text-sm text-slate-600 mb-3">Boost your business visibility and get exclusive tools.</p>
        <button className="w-full bg-[#E67E22] text-white font-semibold rounded-lg py-2 hover:bg-[#d67118] transition-colors">
          Get Pro Today
        </button>
      </div>

      {/* Trending Topics */}
      <div className="mb-6">
        <h3 className="font-bold text-slate-900 mb-3">Trending Communities</h3>
        <div className="space-y-3">
           {/* Placeholders */}
           {[1, 2, 3].map((i) => (
             <div key={i} className="flex items-start space-x-3 cursor-pointer">
                <div className="w-8 h-8 rounded-md bg-slate-100 flex-shrink-0" />
                <div>
                   <p className="text-sm font-semibold text-slate-900 hover:underline">Tech & Startups</p>
                   <p className="text-xs text-slate-500">1.2k members</p>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <h3 className="font-bold text-slate-900 mb-3">Upcoming Events</h3>
        <div className="space-y-3">
           {[1, 2].map((i) => (
             <div key={i} className="flex flex-col p-3 rounded-lg border border-slate-100 hover:border-slate-200 cursor-pointer transition-colors">
                <p className="text-xs font-semibold text-[#8E44AD] mb-1">TOMORROW, 2:00 PM</p>
                <p className="text-sm font-semibold text-slate-900">Marketing Masterclass Q&A</p>
                <p className="text-xs text-slate-500 mt-1 flex items-center">
                  <span className="w-4 h-4 rounded-full bg-slate-200 mr-2" />
                  Sarah Jenkins
                </p>
             </div>
           ))}
        </div>
      </div>

    </aside>
  );
}
