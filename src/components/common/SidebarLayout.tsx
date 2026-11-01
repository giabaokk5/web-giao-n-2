import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  X,
  Bell,
  Search,
  User as UserIcon,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Sun,
  Moon,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface SidebarLayoutProps {
  title: string;
  subtitle: string;
  roleBadge: string;
  items: SidebarItem[];
  activeItemId: string;
  onSelectItem: (id: string) => void;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  onGlobalSearch?: (query: string) => void;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  title,
  subtitle,
  roleBadge,
  items,
  activeItemId,
  onSelectItem,
  children,
  headerActions,
  onGlobalSearch,
}) => {
  const { currentUser, playNotificationSound } = useApp();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  // Realtime notification items
  const [notifications, setNotifications] = useState([
    { id: 'notif-1', title: 'Đơn mới nổ cuốc #BE-DN-9941', time: 'Vừa xong', read: false },
    { id: 'notif-2', title: 'Tài xế Nguyễn Văn Be hoàn thành cuốc 45k', time: '3 phút trước', read: false },
    { id: 'notif-3', title: 'AI phát hiện đơn trễ tại đường Nguyễn Văn Linh', time: '12 phút trước', read: true },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSearchVal(v);
    if (onGlobalSearch) onGlobalSearch(v);
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    playNotificationSound();
  };

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-[#f4f6f9] text-slate-800'}`}>
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Collapsible Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-7 z-40 h-[calc(100vh-28px)] bg-[#001D4A] text-white flex flex-col justify-between transition-all duration-300 border-r border-slate-800 shadow-2xl ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand & Role Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className={`flex items-center space-x-2.5 overflow-hidden transition-all ${isCollapsed ? 'justify-center w-full' : ''}`}>
              <div className="bg-[#FFC700] text-[#00204A] font-black text-lg tracking-tighter px-2.5 py-0.5 rounded-xl shrink-0 shadow-md">
                <span>be</span>
                <span className="font-extrabold ml-0.5">Admin</span>
              </div>
              {!isCollapsed && (
                <div className="truncate">
                  <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30 truncate">
                    {roleBadge}
                  </span>
                </div>
              )}
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items List with Collapsible mode */}
          <nav className="p-2.5 space-y-1 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-700">
            {items.map((item) => {
              const isActive = item.id === activeItemId;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectItem(item.id);
                    setIsMobileOpen(false);
                  }}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center rounded-2xl text-xs font-bold transition-all cursor-pointer group relative ${
                    isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
                  } ${
                    isActive
                      ? 'bg-[#FFC700] text-[#00204A] shadow-md shadow-amber-400/20 font-black'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 truncate'}`}>
                    <span className={`shrink-0 ${isActive ? 'text-[#00204A]' : 'text-slate-400 group-hover:text-amber-400'}`}>
                      {item.icon}
                    </span>
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-black shrink-0 ${
                        isActive
                          ? 'bg-[#00204A] text-white'
                          : 'bg-rose-500 text-white shadow-xs'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Dot indicator when collapsed */}
                  {isCollapsed && item.badge !== undefined && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Collapse Toggle Button (Desktop) */}
          <div className="p-3 border-t border-white/10 bg-black/30 hidden lg:flex items-center justify-between shrink-0">
            {!isCollapsed && (
              <span className="text-[11px] text-slate-400 font-bold truncate">Thu gọn thanh điều hướng</span>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer mx-auto"
              title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            >
              {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          {/* Footer User Profile Card */}
          <div className="p-3 border-t border-white/10 bg-black/20 flex items-center space-x-3 shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-400 shrink-0"
            />
            {!isCollapsed && (
              <div className="truncate flex-1">
                <div className="font-extrabold text-xs text-white truncate">{currentUser.name}</div>
                <span className="text-[10px] text-slate-400 truncate block">{currentUser.email}</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content View with Topbar */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className={`sticky top-7 z-30 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs border-b transition-colors ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {/* Left Title & Mobile Menu Trigger */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                {title}
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">{subtitle}</p>
            </div>
          </div>

          {/* Center: Global Search Across Entire System */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm toàn hệ thống: đơn hàng, nhà hàng, khách hàng, tài xế..."
                value={searchVal}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-amber-400 dark:text-white transition-all"
              />
            </div>
          </div>

          {/* Right Header Actions, DarkMode & Realtime Notifications */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {headerActions}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title={isDarkMode ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Realtime Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 relative hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                title="Thông báo realtime hệ thống"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotificationMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                      Thông báo Realtime ({unreadCount} mới)
                    </span>
                    <button
                      onClick={markAllRead}
                      className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                    >
                      Đọc tất cả
                    </button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border transition-colors ${
                          n.read
                            ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-500'
                            : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 text-slate-900 dark:text-slate-100 font-bold'
                        }`}
                      >
                        <div>{n.title}</div>
                        <div className="text-[10px] text-slate-400 font-normal mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {n.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
};
