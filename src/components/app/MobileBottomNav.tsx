'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Calendar, ShoppingBag, User } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/feed', icon: Home },
  { label: 'Boss Up', href: '/communities', icon: Users },
  { label: 'Events', href: '/events', icon: Calendar },
  { label: 'Market', href: '/marketplace', icon: ShoppingBag },
  { label: 'Profile', href: '/profile', icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 h-16 flex items-center justify-around px-2 pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname?.startsWith(item.href) || false;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 py-1 ${
              isActive ? 'text-[#8E44AD] font-bold' : 'text-slate-500 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
