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
      <div className="mb-8 px-2 flex items-center space-x-2">
         {/* Adjust based on actual logo */}
        <span className="text-xl font-bold text-[#6C3483]">Business Bosses</span>
        <span className="bg-[#E67E22] text-white text-xs font-bold px-2 py-1 rounded-full">PRO</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-[#F8FAFC] text-[#8E44AD] font-semibold' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span>{item.label}</span>
              {item.badgeKey && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  3 {/* Placeholder for unread count */}
                </span>
              )}
            </Link>
          );
        })}

        <button className="w-full mt-6 bg-[#8E44AD] text-white rounded-lg py-2.5 px-4 flex items-center justify-center space-x-2 hover:bg-[#6C3483] transition-colors">
            <PlusCircle className="w-5 h-5" />
            <span className="font-semibold">Create Post</span>
        </button>
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
