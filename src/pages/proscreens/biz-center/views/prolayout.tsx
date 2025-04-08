// components/layout.tsx
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidenav from "../components/sidenav";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidenav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 overflow-auto bg-white">
        <Outlet />
      </div>
    </div>
  );
}
