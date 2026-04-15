import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationStore } from "@/lib/notification-store";
import { LayoutDashboard, Building2, FileText, BarChart3, ScrollText, Settings, LogOut, UserPlus, ClipboardList, Headphones, Bell, Check, Shield, LifeBuoy, MessageSquare, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSignupStore } from "@/lib/signup-store";
import { useEnquiryStore } from "@/lib/enquiry-store";
import { useSupportStore } from "@/lib/support-store";
import { useState, useRef, useEffect } from "react";
import logo from "@/assets/warrantylogo.png";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Dealers", icon: Building2, path: "/admin/dealers" },
  { label: "Signup Requests", icon: UserPlus, path: "/admin/signup-requests" },
  { label: "Warranties", icon: FileText, path: "/admin/warranties" },
  { label: "All Claims", icon: ClipboardList, path: "/admin/claims" },
  { label: "Revenue", icon: BarChart3, path: "/admin/revenue" },
  { label: "Enquiries", icon: MessageSquare, path: "/admin/enquiries" },
  { label: "Support Tickets", icon: Headphones, path: "/admin/support" },
  { label: "System Logs", icon: ScrollText, path: "/admin/logs" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { signupRequests } = useSignupStore();
  const supportStore = useSupportStore();
  const enquiryStore = useEnquiryStore();
  const notifStore = useNotificationStore();
  const userId = user?.id || "";
  const unreadCount = notifStore.unreadCount(userId);
  const notifications = notifStore.getNotifications(userId);
  const [showNotifs, setShowNotifs] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const pendingCount = signupRequests.filter(r => r.status === "pending").length;
  const openTickets = supportStore.tickets.filter(t => t.status === "open" || t.status === "in_progress").length;
  const enquiryCount = enquiryStore.unreadCount;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  const notifIcon = (type: string) => {
    if (type === "claim") return ClipboardList;
    if (type === "warranty") return Shield;
    if (type === "expiry") return FileText;
    if (type === "signup") return UserPlus;
    if (type === "support") return LifeBuoy;
    return Bell;
  };

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 flex-shrink-0 border-r border-border/50 bg-card/40 backdrop-blur-sm flex-col hidden md:flex">
        <div className="p-4 border-b border-border/50">
          <img src={logo} alt="WarrantyVault" className="h-6" />
          <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold mt-1 block">Super Admin</span>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            const showBadge = item.path === "/admin/signup-requests" && pendingCount > 0;
            const showSupportBadge = item.path === "/admin/support" && openTickets > 0;
            const showEnquiryBadge = item.path === "/admin/enquiries" && enquiryCount > 0;
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}>
                <item.icon className="w-4 h-4" />
                <span className="flex-1">{item.label}</span>
                {showBadge && (
                  <span className="bg-[hsl(var(--cta))] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{pendingCount}</span>
                )}
                {showSupportBadge && (
                  <span className="bg-amber-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{openTickets}</span>
                )}
                {showEnquiryBadge && (
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{enquiryCount}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border/50">
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-14 border-b border-border/50 flex items-center px-4 gap-3 bg-card/40">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <img src={logo} alt="WarrantyVault" className="h-5" />
          <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">Admin</span>
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
        {mobileNav && (
          <div className="md:hidden border-b border-border/50 bg-card/60 backdrop-blur-sm px-2 py-2 space-y-1 animate-fade-in">
            {navItems.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} onClick={() => setMobileNav(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}>
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
        <div className="hidden md:flex items-center justify-end px-6 py-2 border-b border-border/30">
          <div className="relative" ref={notifRef}>
            <Button variant="ghost" size="icon" className="relative h-9 w-9" onClick={() => setShowNotifs(!showNotifs)}>
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">{unreadCount}</span>
              )}
            </Button>
            {showNotifs && <NotificationDropdown notifications={notifications} notifStore={notifStore} userId={userId} navigate={navigate} onClose={() => setShowNotifs(false)} notifIcon={notifIcon} />}
          </div>
        </div>
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function NotificationDropdown({ notifications, notifStore, userId, navigate, onClose, notifIcon }: any) {
  return (
    <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-auto rounded-xl border border-border bg-card shadow-xl z-50 animate-fade-in">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <h3 className="font-semibold text-sm">Notifications</h3>
        <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => notifStore.markAllRead(userId)}>
          <Check className="w-3 h-3 mr-1" /> Mark all read
        </Button>
      </div>
      {notifications.length === 0 ? (
        <p className="p-4 text-sm text-muted-foreground text-center">No notifications</p>
      ) : (
        <div className="divide-y divide-border/30">
          {notifications.slice(0, 15).map((n: any) => {
            const Icon = notifIcon(n.type);
            return (
              <button
                key={n.id}
                className={`w-full text-left px-4 py-3 hover:bg-secondary/50 transition-colors flex items-start gap-3 ${!n.read ? "bg-primary/5" : ""}`}
                onClick={() => {
                  notifStore.markRead(userId, n.id);
                  if (n.link) navigate(n.link);
                  onClose();
                }}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${!n.read ? "bg-primary/15" : "bg-secondary"}`}>
                  <Icon className={`w-3.5 h-3.5 ${!n.read ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!n.read ? "font-medium" : "text-muted-foreground"}`}>{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
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
