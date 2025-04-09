import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import SidebarWidget from "./SidebarWidget";
import { useSidebar } from "../../../../context/SidebarContext";
import Assets from "../../../../assets";
import { Link } from "react-router-dom";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <Assets.Activemessage />,
    name: "Dashboard",
    path: "/calendar",
  },
  {
    icon: <Assets.Activemessage />,
    name: "Tasks",
    path: "/calendar",
  },
  {
    icon: <Assets.Activemessage />,
    name: "Orders",
    path: "/calendar",
  },
  {
    icon: <Assets.Activemessage />,
    name: "Customers",
    path: "/calendar",
  },
  {
    icon: <Assets.Activemessage />,
    name: "Setup",
    path: "/calendar",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = navItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-1">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`flex items-center w-full px-3 py-2 rounded-lg group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              } ${
                !isExpanded && !isHovered ? "justify-center" : "justify-between"
              }`}
            >
              <div className="flex items-center">
                <span
                  className={`flex items-center justify-center w-6 h-6 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "text-brand-500"
                      : "text-gray-500"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="ml-3 text-sm font-medium">{nav.name}</span>
                )}
              </div>
              {(isExpanded || isHovered || isMobileOpen) && (
                <Assets.Activemessage
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : "text-gray-400"
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`flex items-center w-full px-3 py-2 rounded-lg group ${
                  isActive(nav.path)
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                } ${
                  !isExpanded && !isHovered ? "justify-center" : "justify-start"
                }`}
              >
                <span
                  className={`flex items-center justify-center w-6 h-6 ${
                    isActive(nav.path) ? "text-brand-500" : "text-gray-500"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="ml-3 text-sm font-medium">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="py-1 pl-9 pr-2 space-y-1">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg ${
                        isActive(subItem.path)
                          ? "bg-brand-50 text-brand-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {subItem.name}
                      {(subItem.new || subItem.pro) && (
                        <span className="flex items-center gap-1">
                          {subItem.new && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-800">
                              new
                            </span>
                          )}
                          {subItem.pro && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-800">
                              pro
                            </span>
                          )}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col overflow-y-auto pt-5 duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-row gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <Assets.Activemessage />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
