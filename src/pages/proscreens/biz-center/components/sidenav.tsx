// components/sidenav.tsx
import { NavLink } from "react-router-dom";
import Assets from "../../../../assets";


interface SidenavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidenav({ isOpen, onClose }: SidenavProps) {
  const navItems = [
    {
      label: "Dashboard",
      icon: Assets.dashboard,
      href: "/dashboard",
    },
    {
      label: "Tasks",
      icon: Assets.projects,
      href: "/tasks",
    },
    {
      label: "Orders",
      icon: Assets.ordersinvoices,
      href: "/orders",
    },
    {
      label: "Customers",
      icon: Assets.clients,
      href: "/customers",
    },
    {
      label: "Setup",
      icon: Assets.setupshop,
      href: "/setup",
    },
  ];

  return (
    <>
      {/* Side Navigation */}
    <nav
      className={`
        fixed lg:relative top-0 left-0 h-full text-black 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 z-40 w-64 bg-white border-r border-gray-50
        overflow-y-auto
      `}
    >
      {/* Navigation Items */}
      <div className="px-4 py-4">
        <ul className="space-y-2">
        {navItems.map((item, idx) => (
          <li key={idx}>
            <NavLink
            to={item.href}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-colors
              ${isActive ? "bg-primary text-white" : "hover:bg-primary/80 hover:text-white"}`
            }
            onClick={onClose}
            >
            {item.icon && (
              typeof item.icon === "string" ? (
                <img
                  src={item.icon}
                  alt={`${item.label} icon`}
                  width={20}
                  height={20}
                  className="flex-shrink-0"
                />
              ) : (
                <item.icon
                  width={20}
                  height={20}
                  className="flex-shrink-0"
                  aria-label={`${item.label} icon`}
                />
              )
            )}
            <span className="ml-3 text-sm font-medium">{item.label}</span>
            </NavLink>
          </li>
        ))}
        </ul>
      </div>
    </nav>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={onClose}
        />
      )}
    </>
  );
}
