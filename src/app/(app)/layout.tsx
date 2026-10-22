import DesktopSidebar from '../../components/app/DesktopSidebar';
import MobileBottomNav from '../../components/app/MobileBottomNav';
import AppTopHeader from '../../components/app/AppTopHeader';
import RightContextRail from '../../components/app/RightContextRail';
import SmartchatWidget from '../../components/app/SmartchatWidget';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <DesktopSidebar />
      
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[260px] xl:pr-[320px]">
        <AppTopHeader />
        
        <main className="flex-1 w-full mx-auto pb-24 lg:pb-8 pt-4 lg:pt-8 px-3 sm:px-4 md:px-6 relative">
          {children}
        </main>
        
        <MobileBottomNav />
      </div>

      <RightContextRail />
      <SmartchatWidget />
    </div>
  );
}
