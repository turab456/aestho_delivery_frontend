import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import {
 
  ChevronDown,
  Grid3X3,
  LogOut,
 
} from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";


type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <Grid3X3 />,
    name: "Clothing Management",
    subItems: [{ name: "Category Management", path: "/dashboard", pro: false },
    { name: "Collections Management", path: "/dashboard/collections", pro: false },
    { name: "Product Management", path: "/dashboard/products", pro: false },
    { name: "Variants Management", path: "/dashboard/variants", pro: false },
    ],
  },
  // {
  //   icon: <CalenderIcon />,
  //   name: "Calendar",
  //   path: "/calendar",
  // },
  // {
  //   icon: <UserCircleIcon />,
  //   name: "User Profile",
  //   path: "/profile",
  // },
  // {
  //   name: "Forms",
  //   icon: <ListIcon />,
  //   subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  // },
  // {
  //   name: "Tables",
  //   icon: <TableIcon />,
  //   subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  // },
  // {
  //   name: "Pages",
  //   icon: <PageIcon />,
  //   subItems: [
  //     { name: "Blank Page", path: "/blank", pro: false },
  //     { name: "404 Error", path: "/error-404", pro: false },
  //   ],
  // },
];

const othersItems: NavItem[] = [
  //   {
  //     icon: <PieChartIcon />,
  //     name: "Charts",
  //     subItems: [
  //       { name: "Line Chart", path: "/line-chart", pro: false },
  //       { name: "Bar Chart", path: "/bar-chart", pro: false },
  //     ],
  //   },
  //   {
  //     icon: <BoxCubeIcon />,
  //     name: "UI Elements",
  //     subItems: [
  //       { name: "Alerts", path: "/alerts", pro: false },
  //       { name: "Avatar", path: "/avatars", pro: false },
  //       { name: "Badge", path: "/badge", pro: false },
  //       { name: "Buttons", path: "/buttons", pro: false },
  //       { name: "Images", path: "/images", pro: false },
  //       { name: "Videos", path: "/videos", pro: false },
  //     ],
  //   },
  //   {
  //     icon: <PlugInIcon />,
  //     name: "Authentication",
  //     subItems: [
  //       { name: "Sign In", path: "/signin", pro: false },
  //       { name: "Sign Up", path: "/signup", pro: false },
  //     ],
  //   },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
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
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`group cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                gap: '0.75rem',
                padding: '0.5rem 0.75rem',
                fontWeight: '500',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                backgroundColor: openSubmenu?.type === menuType && openSubmenu?.index === index ? '#374151' : 'transparent',
                color: openSubmenu?.type === menuType && openSubmenu?.index === index ? '#ffffff' : '#ffffff'
              }}
            >
              <span
                style={{
                  color: openSubmenu?.type === menuType && openSubmenu?.index === index ? '#ffffff' : '#ffffff'
                }}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDown
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className="group"
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  gap: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  fontWeight: '500',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: isActive(nav.path) ? '#374151' : 'transparent',
                  color: isActive(nav.path) ? '#ffffff' : '#ffffff',
                  textDecoration: 'none'
                }}
              >
                <span
                  style={{
                    color: isActive(nav.path) ? '#ffffff' : '#ffffff'
                  }}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{nav.name}</span>
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
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        borderRadius: '0.5rem',
                        padding: '0.625rem 0.75rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        backgroundColor: isActive(subItem.path) ? '#374151' : 'transparent',
                        color: isActive(subItem.path) ? '#ffffff' : '#ffffff',
                        textDecoration: 'none'
                      }}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            style={{
                              display: 'block',
                              borderRadius: '9999px',
                              padding: '0.125rem 0.625rem',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              textTransform: 'uppercase',
                              color: '#465fff',
                              backgroundColor: isActive(subItem.path) ? '#dde9ff' : '#ecf3ff',
                              marginLeft: 'auto'
                            }}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            style={{
                              display: 'block',
                              borderRadius: '9999px',
                              padding: '0.125rem 0.625rem',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              textTransform: 'uppercase',
                              color: '#465fff',
                              backgroundColor: isActive(subItem.path) ? '#dde9ff' : '#ecf3ff',
                              marginLeft: 'auto'
                            }}
                          >
                            pro
                          </span>
                        )}
                      </span>
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

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 h-screen transition-all duration-300 ease-in-out z-50 border-r shadow-sm
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      style={{
        backgroundColor: '#000000',
        borderColor: '#374151',
        color: '#ffffff'
      }}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/logo.svg"
                alt="Logo"
                width={200}
                height={50}
              />
              <img
                className="hidden dark:block"
                src="/logo.svg"
                alt="Logo"
                width={200}
                height={50}
              />
            </>
          ) : (
            <img
              src="/logo.svg"
              alt="Logo"
              width={40}
              height={40}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: "0.75rem",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              fontWeight: 500,
              fontSize: "0.875rem",
              color: "#ffffff",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <span>
              <LogOut />
            </span>
            {(isExpanded || isHovered || isMobileOpen) && (
              <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                Sign out
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
