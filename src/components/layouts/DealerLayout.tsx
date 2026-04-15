import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationStore } from "@/lib/notification-store";
import {
  LayoutDashboard, FileText, Plus, ClipboardList, Users, MessageSquare,
  FolderOpen, Settings, LogOut, ChevronLeft, Menu, Phone, Shield, Headphones, Sliders, LifeBuoy,
  Bell, Check, Sparkles, Wallet, ToggleLeft, ToggleRight, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect, createContext, useContext } from "react";
import logo from "@/assets/warrantylogo.png";
import ThemeToggle from "@/components/ThemeToggle";

// Simple Mode context
const SimpleModeContext = createContext<{ simple: boolean; toggle: () => void }>({ simple: false, toggle: () => {} });
export const useSimpleMode = () => useContext(SimpleModeContext);

type NavGroup = {
  label: string;
  items: { label: string; icon: any; path: string; simpleMode?: boolean }[];
};

const navGroups: NavGroup[] = [
  {
    label: "Core",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/dealer", simpleMode: true },
      { label: "Warranties", icon: FileText, path: "/dealer/warranties", simpleMode: true },
      { label: "Add Warranty", icon: Plus, path: "/dealer/warranties/new" },
      { label: "Claims", icon: ClipboardList, path: "/dealer/claims", simpleMode: true },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "Claim Assist", icon: Headphones, path: "/dealer/claim-assist" },
      { label: "DisputeIQ", icon: Sparkles, path: "/dealer/disputeiq", simpleMode: true },
      { label: "Warranty Fund", icon: Wallet, path: "/dealer/warranty-fund" },
    ],
  },
  {
    label: "Customers",
    items: [
      { label: "Customers", icon: Users, path: "/dealer/customers" },
      { label: "Requests", icon: MessageSquare, path: "/dealer/requests" },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Cover Templates", icon: Shield, path: "/dealer/cover-templates" },
      { label: "Warranty Line", icon: Phone, path: "/dealer/warranty-line" },
      { label: "Documents", icon: FolderOpen, path: "/dealer/documents" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Claim Settings", icon: Sliders, path: "/dealer/claim-settings" },
      { label: "Knowledge Base", icon: BookOpen, path: "/knowledge-base", simpleMode: true },
      { label: "Support", icon: LifeBuoy, path: "/dealer/support" },
      { label: "Settings", icon: Settings, path: "/dealer/settings" },
    ],
  },
];

export default function DealerLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [simpleMode, setSimpleMode] = useState(() => {
    try { return localStorage.getItem("wv-simple-mode") === "true"; } catch { return false; }
  });
  const notifStore = useNotificationStore();
  const userId = user?.id || "";
  const unreadCount = notifStore.unreadCount(userId);
  const notifications = notifStore.getNotifications(userId);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleSimple = () => {
    const next = !simpleMode;
    setSimpleMode(next);
    try { localStorage.setItem("wv-simple-mode", String(next)); } catch {}
  };

  const handleLogout = () => { logout(); navigate("/"); };

  const notifIcon = (type: string) => {
    if (type === "claim") return ClipboardList;
    if (type === "warranty") return Shield;
    if (type === "expiry") return FileText;
    if (type === "support") return LifeBuoy;
    return Bell;
  };

  // Flatten for mobile
  const allItems = navGroups.flatMap(g => g.items);
  const visibleMobileItems = simpleMode ? allItems.filter(i => i.simpleMode) : allItems;

  return (
    <SimpleModeContext.Provider value={{ simple: simpleMode, toggle: toggleSimple }}>
      <div className="min-h-screen flex bg-[hsl(222_30%_6%)]">
        {/* Sidebar */}
        <aside className={`${collapsed ? "w-16" : "w-60"} flex-shrink-0 border-r border-white/[0.06] bg-[hsl(222_28%_8%)]/80 backdrop-blur-sm flex flex-col transition-all duration-300 hidden md:flex relative`}>
          {/* Subtle corner glow */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/[0.03] rounded-full blur-[40px] pointer-events-none" />

          <div className="p-3 flex items-center justify-between border-b border-white/[0.06]">
            {!collapsed && <img src={logo} alt="WarrantyVault" className="h-5" />}
            <Button variant="ghost" size="icon" className="h-7 w-7 text-white/40 hover:text-white/70" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <Menu className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </Button>
          </div>

          {/* Simple Mode Toggle */}
          {!collapsed && (
            <button onClick={toggleSimple} className="mx-3 mt-3 mb-1 flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition-all hover:bg-white/[0.04]">
              {simpleMode ? <ToggleRight className="w-4 h-4 text-primary" /> : <ToggleLeft className="w-4 h-4 text-white/30" />}
              <span className={simpleMode ? "text-primary font-medium" : "text-white/35"}>Simple Mode</span>
              {simpleMode && <span className="text-[9px] text-primary/50 ml-auto">streamlined</span>}
            </button>
          )}

          <nav className="flex-1 px-2 py-1 overflow-y-auto">
            {navGroups.map(group => {
              const visibleItems = simpleMode
                ? group.items.filter(i => i.simpleMode)
                : group.items;
              if (visibleItems.length === 0) return null;

              return (
                <div key={group.label} className="mb-3">
                  {!collapsed && (
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/20 px-3 pt-3 pb-1.5">
                      {group.label}
                    </p>
                  )}
                  {visibleItems.map(item => {
                    const active = location.pathname === item.path;
                    return (
                      <Link key={item.path} to={item.path}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all duration-200 relative group ${
                          active
                            ? "bg-primary/10 text-primary font-medium shadow-[0_0_12px_-4px_hsl(172,66%,40%,0.2)]"
                            : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
                        }`}
                      >
                        {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-primary" />}
                        <item.icon className="w-[15px] h-[15px] flex-shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </nav>

          <div className="p-2.5 border-t border-white/[0.06]">
            {!collapsed && (
              <div className="px-3 py-2 mb-1.5">
                <p className="text-sm font-medium text-white/70 truncate">{user?.name}</p>
                <p className="text-[11px] text-white/30 truncate">{user?.email}</p>
              </div>
            )}
            <ThemeToggle collapsed={collapsed} />
            <Button variant="ghost" size="sm" className="w-full justify-start text-white/30 hover:text-white/60 text-xs" onClick={handleLogout}>
              <LogOut className="w-3.5 h-3.5 mr-2" /> {!collapsed && "Sign Out"}
            </Button>
          </div>
        </aside>

        {/* Mobile header */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="md:hidden h-14 border-b border-white/[0.06] flex items-center px-4 gap-3 bg-[hsl(222_28%_8%)]">
            <img src={logo} alt="WarrantyVault" className="h-5" />
            <div className="flex-1" />
            <div className="relative" ref={notifRef}>
              <Button variant="ghost" size="icon" className="relative h-9 w-9" onClick={() => setShowNotifs(!showNotifs)}>
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">{unreadCount}</span>
                )}
              </Button>
              {showNotifs && <NotificationDropdown notifications={notifications} notifStore={notifStore} userId={userId} navigate={navigate} onClose={() => setShowNotifs(false)} notifIcon={notifIcon} />}
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="w-4 h-4" /></Button>
          </header>
          {/* Mobile nav */}
          <div className="md:hidden flex overflow-x-auto border-b border-white/[0.06] bg-[hsl(222_28%_9%)] px-2 scrollbar-hide">
            {visibleMobileItems.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}
                  className={`flex flex-col items-center gap-1 px-3 py-2 text-xs whitespace-nowrap flex-shrink-0 ${
                    active ? "text-primary" : "text-white/40"
                  }`}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop top bar */}
          <div className="hidden md:flex items-center justify-between px-6 py-2 border-b border-white/[0.06] bg-[hsl(222_28%_8%)]/50">
            <div className="flex items-center gap-2">
              <Button size="sm" className="btn-cta rounded-lg h-8 text-xs px-4 shadow-[0_0_12px_-3px_hsl(24,100%,50%,0.25)]" onClick={() => navigate("/dealer/warranties/new")}>
                <Plus className="w-3.5 h-3.5 mr-1" /> New Warranty
              </Button>
              <Button size="sm" variant="outline" className="rounded-lg h-8 text-xs px-4 border-white/[0.08] text-white/50 bg-transparent hover:bg-white/[0.04]" onClick={() => navigate("/dealer/claims")}>
                <ClipboardList className="w-3.5 h-3.5 mr-1" /> New Claim
              </Button>
            </div>
            <div className="relative" ref={notifRef}>
              <Button variant="ghost" size="icon" className="relative h-8 w-8 text-white/40 hover:text-white/70" onClick={() => setShowNotifs(!showNotifs)}>
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">{unreadCount}</span>
                )}
              </Button>
              {showNotifs && <NotificationDropdown notifications={notifications} notifStore={notifStore} userId={userId} navigate={navigate} onClose={() => setShowNotifs(false)} notifIcon={notifIcon} />}
            </div>
          </div>

          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-[hsl(222_30%_6%)]">
            {children}
          </main>
        </div>
      </div>
    </SimpleModeContext.Provider>
  );
}

function NotificationDropdown({ notifications, notifStore, userId, navigate, onClose, notifIcon }: any) {
  return (
    <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-auto rounded-xl border border-white/[0.08] bg-[hsl(222_28%_10%)] shadow-xl z-50 animate-fade-in">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <h3 className="font-semibold font-display text-sm">Notifications</h3>
        <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => notifStore.markAllRead(userId)}>
          <Check className="w-3 h-3 mr-1" /> Mark all read
        </Button>
      </div>
      {notifications.length === 0 ? (
        <p className="p-4 text-sm text-muted-foreground text-center">No notifications</p>
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {notifications.slice(0, 15).map((n: any) => {
            const Icon = notifIcon(n.type);
            return (
              <button
                key={n.id}
                className={`w-full text-left px-4 py-3 hover:bg-white/[0.04] transition-colors flex items-start gap-3 ${!n.read ? "bg-primary/[0.04]" : ""}`}
                onClick={() => {
                  notifStore.markRead(userId, n.id);
                  if (n.link) navigate(n.link);
                  onClose();
                }}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${!n.read ? "bg-primary/15" : "bg-white/[0.04]"}`}>
                  <Icon className={`w-3.5 h-3.5 ${!n.read ? "text-primary" : "text-white/40"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!n.read ? "font-medium text-white/80" : "text-white/40"}`}>{n.title}</p>
                  <p className="text-xs text-white/30 mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-xs text-white/15 mt-1">
                    {new Date(n.timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    {" · "}
                    {new Date(n.timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
