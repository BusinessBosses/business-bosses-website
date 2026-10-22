'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Calendar, ShoppingBag, MessageSquare, User, PlusCircle } from 'lucide-react';

const navItems = [
  { label: 'Home Feed', href: '/feed', icon: Home },
  { label: 'Boss Up Hub', href: '/communities', icon: Users },
  { label: 'Live Events', href: '/events', icon: Calendar },
  { label: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
  { label: 'Messages', href: '/messages', icon: MessageSquare, badgeKey: 'unreadMessages' },
  { label: 'My Profile', href: '/profile', icon: User },
];

export default function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-[260px] fixed h-screen border-r border-slate-200 bg-white p-4">
      <div className="mb-8 px-2 flex items-center justify-between">
        <Link href="/feed" className="flex items-center space-x-1.5">
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Business <span className="text-[#F21C29]">Bosses</span>
          </span>
        </Link>
        <span className="bg-[#F7C844] text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
          PRO
        </span>
      </div>

      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/feed' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive 
                  ? 'bg-red-50 text-[#F21C29] font-bold shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] text-[#F21C29]' : 'stroke-2 text-slate-400'}`} />
              <span>{item.label}</span>
              {item.badgeKey && (
                <span className="ml-auto bg-[#F21C29] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  3
                </span>
              )}
            </Link>
          );
        })}

        <Link
          href="/feed"
          className="w-full mt-6 bg-[#F21C29] text-white rounded-xl py-3 px-4 flex items-center justify-center space-x-2 hover:bg-[#D01420] shadow-md transition-all active:scale-[0.98]"
        >
            <PlusCircle className="w-5 h-5" />
            <span className="font-bold text-sm">Create Post</span>
        </Link>
      </nav>

      <div className="mt-auto border-t border-slate-200 pt-4 px-2">
         <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-slate-200" />
            <div className="flex-1 min-w-0">
               <p className="text-sm font-semibold text-slate-900 truncate">Alex Doe</p>
               <p className="text-xs text-slate-500 truncate">@alexdoe</p>
            </div>
         </div>
      </div>
    </aside>
  );
}
