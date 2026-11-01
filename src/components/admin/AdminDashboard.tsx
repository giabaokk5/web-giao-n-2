// src/components/admin/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SidebarLayout, SidebarItem } from '../common/SidebarLayout';
import { Pagination } from '../common/Pagination';
import { Restaurant, FoodItem, Order, OrderStatus } from '../../types';
import {
  MOCK_INVENTORY_ITEMS,
  MOCK_SETTLEMENTS,
  MOCK_SUPPORT_TICKETS,
} from '../../data/mockData';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  BarChart3,
  Users,
  Store,
  Bike,
  ShoppingBag,
  UtensilsCrossed,
  Boxes,
  Ticket,
  BadgeDollarSign,
  AlertTriangle,
  Bot,
  FileSpreadsheet,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Download,
  Filter,
  Eye,
  RefreshCw,
  Sliders,
  Sparkles,
  Lock,
  Unlock,
  Building2,
  Calendar,
  Radio,
  MapPin,
  Compass,
  ShieldCheck,
  Cpu,
  ArrowUpRight,
  TrendingUp,
  Key,
  LogOut,
  Terminal,
  Server,
  Database,
  Power,
  AlertCircle,
  Check,
  Send,
  ChevronRight,
  Clock,
  Car,
  Receipt,
  Layers,
  Map,
  Star,
  MessageSquare,
} from 'lucide-react';
import { adminService, DashboardStats } from '../../services/adminService';
import { AdminAIChat } from '../chatbot/AdminAIChat';
import { Customer360Modal } from './modules/Customer360Modal';
import { LiveCommandCenter } from './modules/LiveCommandCenter';
import { FinanceSettlementCenter } from './modules/FinanceSettlementCenter';
import { SystemInfraCenter } from './modules/SystemInfraCenter';

// Interfaces for Super Admin
interface AuditLog {
  id: string;
  time: string;
  admin: string;
  action: string;
  target: string;
  ip: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR';
}

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-1', time: '12:24 01/11', admin: 'Super Admin Quang', action: 'Duyệt đối soát tuần 4', target: 'Mì Quảng Bà Mua (31.570.000₫)', ip: '118.69.182.20', status: 'SUCCESS' },
  { id: 'log-2', time: '11:50 01/11', admin: 'Super Admin Quang', action: 'Kích hoạt voucher giờ vàng', target: 'BEFOOD50 (Giảm 50%)', ip: '118.69.182.20', status: 'SUCCESS' },
  { id: 'log-3', time: '10:15 01/11', admin: 'Hệ thống tự động', action: 'Đồng bộ thực đơn 20 quán', target: 'Catalog Đà Nẵng 2026', ip: '10.0.0.1', status: 'SUCCESS' },
  { id: 'log-4', time: '09:30 01/11', admin: 'Super Admin Quang', action: 'Duyệt hồ sơ tài xế mới', target: 'Nguyễn Văn Be (43-D1 888.68)', ip: '118.69.182.20', status: 'SUCCESS' },
  { id: 'log-5', time: '08:00 01/11', admin: 'AI Fraud Sentinel', action: 'Quét cảnh báo đơn bất thường', target: 'Đơn BE-992140 (Trùng IP Hải Châu)', ip: '10.0.0.1', status: 'WARNING' },
];

interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'merchant' | 'driver' | 'admin' | 'accounting' | 'support' | 'kitchen';
  status: 'active' | 'locked';
  joinedDate: string;
  totalOrders: number;
  walletBalance: number;
}

const INITIAL_USERS: AdminUserItem[] = [
  { id: 'usr-1', name: 'Trần Minh Quang', email: 'minhquang@befood.vn', phone: '0908 123 456', role: 'customer', status: 'active', joinedDate: '15/01/2024', totalOrders: 32, walletBalance: 350000 },
  { id: 'usr-2', name: 'Bà Mua - Chủ Quán', email: 'merchant@bamua.vn', phone: '0905 123 456', role: 'merchant', status: 'active', joinedDate: '10/02/2024', totalOrders: 1420, walletBalance: 24500000 },
  { id: 'usr-3', name: 'Nguyễn Văn Be', email: 'driver.be@gmail.com', phone: '0933 445 566', role: 'driver', status: 'active', joinedDate: '01/03/2024', totalOrders: 3412, walletBalance: 4850000 },
  { id: 'usr-4', name: 'Lê Hoàng Yến (Sơn Trà)', email: 'hoangyen.danang@gmail.com', phone: '0977 112 233', role: 'customer', status: 'active', joinedDate: '20/04/2024', totalOrders: 18, walletBalance: 120000 },
  { id: 'usr-5', name: 'Super Admin Tổng beFood', email: 'admin@befood.vn', phone: '0900 888 999', role: 'admin', status: 'active', joinedDate: '01/01/2024', totalOrders: 0, walletBalance: 99999999 },
  { id: 'usr-6', name: 'Kế toán viên Thu Hà', email: 'ketoan@befood.vn', phone: '0905 666 777', role: 'accounting', status: 'active', joinedDate: '15/03/2024', totalOrders: 0, walletBalance: 0 },
  { id: 'usr-7', name: 'Bếp Trưởng KDS Hải Châu', email: 'kitchen@bamua.vn', phone: '0905 888 111', role: 'kitchen', status: 'active', joinedDate: '01/04/2024', totalOrders: 980, walletBalance: 0 },
  { id: 'usr-8', name: 'Vũ Đức Thịnh (Spam OTP)', email: 'ducthinh.spam@yahoo.com', phone: '0988 777 666', role: 'customer', status: 'locked', joinedDate: '05/05/2024', totalOrders: 1, walletBalance: 0 },
];

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    openAdminAuthModal,
    logout,
    setCurrentRole,
    restaurants,
    orders,
    availableVouchers,
    addVoucher,
    deleteVoucher,
    toggleRestaurantOpen,
    reviews,
    deleteReview,
    replyReview,
    showToast,
  } = useApp();

  type TabType =
    | 'overview'
    | 'command_center'
    | 'users'
    | 'restaurants'
    | 'menu'
    | 'orders'
    | 'drivers'
    | 'delivery_areas'
    | 'finance'
    | 'vouchers'
    | 'reviews'
    | 'ai_analytics'
    | 'audit_logs'
    | 'system_infra';

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selected360User, setSelected360User] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Overview metric filter period
  const [chartPeriod, setChartPeriod] = useState<'7days' | '30days' | 'year'>('7days');

  // Users state
  const [userList, setUserList] = useState<AdminUserItem[]>(INITIAL_USERS);
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<AdminUserItem['role']>('customer');

  // Settlements state
  const [settlements, setSettlements] = useState(MOCK_SETTLEMENTS);

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // AI Assistant Chat state in Admin
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiAnswers, setAiAnswers] = useState<{ id: string; q: string; a: string; time: string }[]>([
    {
      id: 'ai-init',
      q: 'Hôm nay toàn sàn beFood Đà Nẵng có bao nhiêu đơn hàng và doanh thu thế nào?',
      a: '📊 Hôm nay toàn sàn beFood Đà Nẵng đã ghi nhận **1.842 đơn hàng** với tổng GMV đạt **185.600.000₫**. Hoa hồng sàn 18% thu về là **33.408.000₫**. Tuyến Hải Châu và Sơn Trà dẫn đầu với 70% tổng lượng đơn!',
      time: '12:15',
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Gemini API Configuration state
  const [aiModel, setAiModel] = useState('gemini-1.5-flash');
  const [aiTemperature, setAiTemperature] = useState(0.7);
  const [aiMaxTokens, setAiMaxTokens] = useState(2048);
  const [aiFraudAlert, setAiFraudAlert] = useState(true);
  const [aiAutoDispatch, setAiAutoDispatch] = useState(true);

  // System status
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Platform metrics
  const totalGMV = 185600000;
  const platformCommission = Math.round(totalGMV * 0.18);
  const totalOrdersCount = 1842;
  const activeDriversCount = 142;
  const successRate = 98.2;

  // Chart Data: 7-day vs 30-day Revenue
  const data7Days = [
    { name: 'Thứ 2', gmv: 21.5, hoaHong: 3.87, donHang: 142 },
    { name: 'Thứ 3', gmv: 24.0, hoaHong: 4.32, donHang: 165 },
    { name: 'Thứ 4', gmv: 28.5, hoaHong: 5.13, donHang: 195 },
    { name: 'Thứ 5', gmv: 26.2, hoaHong: 4.71, donHang: 180 },
    { name: 'Thứ 6', gmv: 36.0, hoaHong: 6.48, donHang: 245 },
    { name: 'Thứ 7', gmv: 45.5, hoaHong: 8.19, donHang: 310 },
    { name: 'Chủ Nhật', gmv: 52.0, hoaHong: 9.36, donHang: 365 },
  ];

  // District distribution
  const districtData = [
    { name: 'Hải Châu', percent: 42, color: '#00204A' },
    { name: 'Sơn Trà', percent: 28, color: '#0052CC' },
    { name: 'Thanh Khê', percent: 16, color: '#FFC700' },
    { name: 'Ngũ Hành Sơn', percent: 10, color: '#10B981' },
    { name: 'Liên Chiểu', percent: 4, color: '#F43F5E' },
  ];

  // Payment methods
  const paymentData = [
    { name: 'Ví bePay', value: 48, color: '#FFC700' },
    { name: 'Thẻ Quốc tế', value: 24, color: '#00204A' },
    { name: 'Ví MoMo', value: 16, color: '#EC4899' },
    { name: 'Tiền mặt (COD)', value: 12, color: '#10B981' },
  ];

  // Sidebar navigation items
  const sidebarItems: SidebarItem[] = [
    { id: 'overview', label: '1. Dashboard Tổng Quan', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'command_center', label: '2. Live Command Center', icon: <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />, badge: 'LIVE' },
    { id: 'users', label: '3. Tài Khoản & Phân Quyền', icon: <Users className="w-4 h-4" />, badge: `${userList.length}` },
    { id: 'restaurants', label: '4. Nhà Hàng & Đối Tác', icon: <Store className="w-4 h-4" />, badge: `${restaurants.length}` },
    { id: 'menu', label: '5. Món Ăn & Thực Đơn', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'orders', label: '6. Đơn Hàng Chuyên Sâu', icon: <ShoppingBag className="w-4 h-4" />, badge: '32 mới' },
    { id: 'drivers', label: '7. Đội Xe Tài Xế Be', icon: <Bike className="w-4 h-4" />, badge: '142 on' },
    { id: 'delivery_areas', label: '8. Khu Vực & Phụ Phí', icon: <Map className="w-4 h-4" /> },
    { id: 'finance', label: '9. Tài Chính & Đối Soát', icon: <BadgeDollarSign className="w-4 h-4" /> },
    { id: 'vouchers', label: '10. Marketing & Voucher', icon: <Ticket className="w-4 h-4" /> },
    { id: 'reviews', label: '11. Quản Lý Đánh Giá & Bình Luận', icon: <MessageSquare className="w-4 h-4 text-amber-500" />, badge: `${reviews.length}` },
    { id: 'ai_analytics', label: '12. Gemini AI Analyst', icon: <Bot className="w-4 h-4 text-amber-400" />, badge: 'AI' },
    { id: 'audit_logs', label: '13. Nhật Ký & Bảo Mật', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'system_infra', label: '14. Hạ Tầng & Sao Lưu', icon: <Server className="w-4 h-4 text-blue-400" /> },
  ];

  // Handle User Toggle Lock
  const handleToggleUserLock = (userId: string) => {
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'active' ? 'locked' : 'active';
          showToast(`Đã ${newStatus === 'locked' ? 'khóa' : 'mở khóa'} tài khoản ${u.name}`, newStatus === 'locked' ? 'warning' : 'success');
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  // Handle Reset Password
  const handleResetPassword = (u: AdminUserItem) => {
    showToast(`Đã đặt lại mật khẩu cho ${u.name} về mặc định "123456"`, 'info');
  };

  // Handle Remote Logout
  const handleRemoteLogout = (u: AdminUserItem) => {
    showToast(`Đã hủy toàn bộ phiên đăng nhập của ${u.name} trên mọi thiết bị`, 'warning');
  };

  // Handle Add User
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      showToast('Vui lòng điền đầy đủ tên và email', 'warning');
      return;
    }
    const newUser: AdminUserItem = {
      id: `usr-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      phone: newUserPhone.trim() || '0908 999 888',
      role: newUserRole,
      status: 'active',
      joinedDate: 'Hôm nay',
      totalOrders: 0,
      walletBalance: 0,
    };
    setUserList([newUser, ...userList]);
    setIsAddUserModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    showToast(`Đã tạo tài khoản ${newUser.name} thành công!`, 'success');
  };

  // Handle AI Question Ask
  const handleAskAi = async (customPrompt?: string) => {
    const q = (customPrompt || aiPrompt).trim();
    if (!q) return;

    setIsAiLoading(true);
    setAiPrompt('');

    try {
      const res = await adminService.queryAiAnalyst(q);
      const answer = res.data?.answer || 'Đã phân tích số liệu sàn beFood Đà Nẵng thành công.';
      setAiAnswers((prev) => [
        {
          id: `ai-${Date.now()}`,
          q,
          a: answer,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev,
      ]);
    } catch {
      setAiAnswers((prev) => [
        {
          id: `ai-${Date.now()}`,
          q,
          a: '🤖 [AI Business Analyst]: Dựa trên dữ liệu thời gian thực của beFood Đà Nẵng, hệ thống đang hoạt động ổn định với 20/20 nhà hàng mở bán, 142 tài xế trực tuyến, và thời gian giao hàng trung bình là 18.5 phút khắp 6 quận Đà Nẵng.',
          time: 'Vừa xong',
        },
        ...prev,
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Filtered users
  const filteredUsers = userList.filter((u) => {
    if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q)
      );
    }
    return true;
  });

  return (
    <SidebarLayout
      title="Trung Tâm Điều Hành Super Admin beFood"
      subtitle="Quản lý toàn diện hoạt động vận hành, tài chính, đội xe và đối tác tại TP. Đà Nẵng"
      roleBadge="SUPER ADMIN ĐÀ NẴNG"
      items={sidebarItems}
      activeItemId={activeTab}
      onSelectItem={(id) => {
        setActiveTab(id as TabType);
        setCurrentPage(1);
        setSearchQuery('');
      }}
      headerActions={
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => {
              showToast('Đang đồng bộ dữ liệu thời gian thực từ SQL Server...', 'info');
              setTimeout(() => showToast('Đồng bộ dữ liệu thành công!', 'success'), 800);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            title="Đồng bộ lại dữ liệu"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Làm mới</span>
          </button>

          <button
            onClick={() => showToast('Đã trích xuất báo cáo vận hành Excel toàn sàn Đà Nẵng!', 'success')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#00204A] hover:bg-[#002b66] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#FFC700]" />
            <span className="hidden sm:inline">Xuất Excel</span>
          </button>

          <button
            onClick={() => openAdminAuthModal('signin')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:brightness-105 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            title="Đăng nhập / Đăng ký cổng quản trị"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cổng Quản Trị</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Security & Access Clearance Banner */}
        {(!currentUser || currentUser.role !== 'admin') ? (
          <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-300 p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-amber-400 text-slate-950 rounded-2xl shadow-xs shrink-0">
                <ShieldCheck className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="font-black text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                  <span>Chế độ Xem Thử Nghiệm Super Admin</span>
                  <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Chưa đăng nhập quyền Admin
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Đăng nhập qua <strong>Cổng Quản Trị Riêng Biệt</strong> để kích hoạt toàn quyền phê duyệt, đối soát 18% và radar điều vận.
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
              <button
                onClick={() => openAdminAuthModal('signin')}
                className="px-3.5 py-1.5 bg-[#001736] hover:bg-[#00204A] text-amber-300 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Đăng nhập Admin</span>
              </button>
              <button
                onClick={() => openAdminAuthModal('signup')}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Đăng ký cấp quyền
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50/90 border border-emerald-200 p-3 px-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-2xs">
            <div className="flex items-center space-x-2 text-emerald-950 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Đã xác thực đặc quyền: {currentUser.name} ({currentUser.email})</span>
            </div>
            <div className="flex items-center space-x-3 text-xs self-end sm:self-auto">
              <button
                onClick={() => openAdminAuthModal('signin')}
                className="text-emerald-700 hover:underline font-semibold cursor-pointer"
              >
                Chuyển tài khoản Admin
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => {
                  logout();
                  setCurrentRole('customer');
                }}
                className="text-rose-600 hover:underline font-bold cursor-pointer"
              >
                Đăng xuất Admin
              </button>
            </div>
          </div>
        )}
        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 Hero KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Tổng GMV Toàn Sàn
                    </span>
                    <span className="p-2 rounded-xl bg-amber-100 text-amber-900">
                      <BadgeDollarSign className="w-5 h-5 text-amber-600" />
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-2">
                    {totalGMV.toLocaleString('vi-VN')}đ
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-emerald-600 font-bold mt-3 pt-2 border-t border-slate-100">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+18.4% so với tuần trước</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Hoa Hồng Sàn (18%)
                    </span>
                    <span className="p-2 rounded-xl bg-blue-100 text-blue-900">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </span>
                  </div>
                  <div className="text-2xl font-black text-blue-950 mt-2">
                    {platformCommission.toLocaleString('vi-VN')}đ
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-blue-600 font-bold mt-3 pt-2 border-t border-slate-100">
                  <span>Net Revenue sau thuế</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Đơn Hàng Hoàn Thành
                    </span>
                    <span className="p-2 rounded-xl bg-emerald-100 text-emerald-900">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-2">
                    {totalOrdersCount.toLocaleString('vi-VN')} đơn
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-emerald-600 font-bold mt-3 pt-2 border-t border-slate-100">
                  <span>Tỷ lệ thành công: {successRate}%</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Đội Xe Be Trực Tuyến
                    </span>
                    <span className="p-2 rounded-xl bg-rose-100 text-rose-900">
                      <Bike className="w-5 h-5 text-rose-600" />
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-2">
                    {activeDriversCount} / 185 xế
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold mt-3 pt-2 border-t border-slate-100">
                  <span>Giao trung bình: 18.5 phút</span>
                </div>
              </div>
            </div>

            {/* Time Toggle & Main Chart */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    Biểu Đồ Doanh Thu Toàn Hệ Thống (GMV & Hoa Hồng)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Số liệu giao dịch thời gian thực tổng hợp khắp 6 quận Đà Nẵng
                  </p>
                </div>
                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setChartPeriod('7days')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      chartPeriod === '7days' ? 'bg-[#00204A] text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    7 Ngày gần nhất
                  </button>
                  <button
                    onClick={() => setChartPeriod('30days')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      chartPeriod === '30days' ? 'bg-[#00204A] text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Tháng này
                  </button>
                  <button
                    onClick={() => setChartPeriod('year')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      chartPeriod === 'year' ? 'bg-[#00204A] text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Năm 2026
                  </button>
                </div>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data7Days}>
                    <defs>
                      <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFC700" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#FFC700" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorHoaHong" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00204A" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#00204A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      formatter={(val: any) => [`${val} triệu VNĐ`]}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="gmv" name="Tổng GMV (Triệu VNĐ)" stroke="#d97706" fillOpacity={1} fill="url(#colorGmv)" />
                    <Area type="monotone" dataKey="hoaHong" name="Hoa Hồng Sàn 18%" stroke="#00204A" fillOpacity={1} fill="url(#colorHoaHong)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2 Sub Charts: District Breakdown & Payment Methods */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* District Breakdown */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-sm text-slate-900">
                      Tỷ Trọng Doanh Thu Theo Quận (Đà Nẵng)
                    </h3>
                    <p className="text-xs text-slate-400">Hải Châu & Sơn Trà chiếm 70% tổng lượng đơn</p>
                  </div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">
                    Hải Châu #1
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  {districtData.map((d) => (
                    <div key={d.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-700">{d.name}</span>
                        <span className="text-slate-900">{d.percent}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${d.percent}%`, backgroundColor: d.color }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods Breakdown */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                <div>
                  <h3 className="font-black text-sm text-slate-900">
                    Phương Thức Thanh Toán Sàn beFood
                  </h3>
                  <p className="text-xs text-slate-400">Ví điện tử bePay chiếm ưu thế lớn</p>
                </div>

                <div className="h-52 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {paymentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${value}%`]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: LIVE COMMAND CENTER (Module 2, 11, 12, 31) */}
        {/* ========================================================= */}
        {activeTab === 'command_center' && (
          <LiveCommandCenter />
        )}

        {/* ========================================================= */}
        {/* TAB 3: USERS & RBAC ROLES */}
        {/* ========================================================= */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center space-x-2 flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên, email, số điện thoại..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 outline-none"
                >
                  <option value="all">Tất cả vai trò</option>
                  <option value="customer">Khách hàng</option>
                  <option value="merchant">Chủ quán ăn</option>
                  <option value="driver">Tài xế Be</option>
                  <option value="admin">Quản trị viên</option>
                  <option value="accounting">Kế toán</option>
                  <option value="kitchen">Bếp KDS</option>
                </select>

                <button
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm tài khoản</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Người Dùng</th>
                      <th className="p-4">Số Điện Thoại</th>
                      <th className="p-4">Vai Trò</th>
                      <th className="p-4">Trạng Thái</th>
                      <th className="p-4">Số Dư / Đơn</th>
                      <th className="p-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-slate-400 text-[11px]">{u.email}</div>
                        </td>
                        <td className="p-4 font-mono font-medium text-slate-700">{u.phone}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              u.role === 'admin'
                                ? 'bg-purple-100 text-purple-900'
                                : u.role === 'merchant'
                                ? 'bg-emerald-100 text-emerald-900'
                                : u.role === 'driver'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-blue-100 text-blue-900'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 font-bold ${
                              u.status === 'active' ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {u.status === 'active' ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" /> Hoạt động
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" /> Đã khóa
                              </>
                            )}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-800">
                            {u.walletBalance > 0 ? `${u.walletBalance.toLocaleString('vi-VN')}đ` : '0đ'}
                          </div>
                          <div className="text-[11px] text-slate-400">{u.totalOrders} đơn hàng</div>
                        </td>
                        <td className="p-4 text-right space-x-1.5">
                          <button
                            onClick={() => setSelected360User(u)}
                            className="p-1.5 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                            title="Xem hồ sơ chuyên sâu Customer 360"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleToggleUserLock(u.id)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              u.status === 'active'
                                ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                                : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={u.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                          >
                            {u.status === 'active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => handleResetPassword(u)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Đặt lại mật khẩu"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleRemoteLogout(u)}
                            className="p-1.5 rounded-lg border border-slate-200 text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Đăng xuất từ xa"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Add User */}
            {isAddUserModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
                  <h3 className="font-black text-base text-slate-900">Thêm Tài Khoản Mới</h3>
                  <form onSubmit={handleAddUser} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Họ và tên</label>
                      <input
                        type="text"
                        required
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        placeholder="a@befood.vn"
                        className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Số điện thoại</label>
                      <input
                        type="tel"
                        value={newUserPhone}
                        onChange={(e) => setNewUserPhone(e.target.value)}
                        placeholder="0908 xxx xxx"
                        className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Phân quyền vai trò</label>
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value as any)}
                        className="w-full p-2.5 border border-slate-200 rounded-xl outline-none font-bold"
                      >
                        <option value="customer">Khách hàng</option>
                        <option value="merchant">Chủ quán ăn</option>
                        <option value="driver">Tài xế Be</option>
                        <option value="accounting">Kế toán</option>
                        <option value="kitchen">Nhân viên bếp KDS</option>
                        <option value="admin">Quản trị viên</option>
                      </select>
                    </div>

                    <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsAddUserModalOpen(false)}
                        className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-xs"
                      >
                        Tạo tài khoản
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: RESTAURANTS MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'restaurants' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="font-black text-sm text-slate-900">
                Danh Sách 20 Nhà Hàng Đối Tác Tại Đà Nẵng
              </h3>
              <span className="text-xs font-bold text-slate-400">
                Hoa hồng chuẩn sàn: 18% GMV
              </span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Nhà Hàng</th>
                      <th className="p-4">Quận / Địa Chỉ</th>
                      <th className="p-4">Hoa Hồng</th>
                      <th className="p-4">Đánh Giá</th>
                      <th className="p-4">Trạng Thái</th>
                      <th className="p-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {restaurants.map((res) => (
                      <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={res.coverImage}
                              alt={res.name}
                              className="w-10 h-10 rounded-xl object-cover"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{res.name}</div>
                              <div className="text-slate-400 text-[11px] truncate max-w-xs">{res.tagline}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                            {res.district}
                          </span>
                        </td>
                        <td className="p-4 font-black text-amber-700">18%</td>
                        <td className="p-4 font-bold text-slate-900">⭐ {res.rating} ({res.totalReviews})</td>
                        <td className="p-4">
                          <span
                            className={`font-bold inline-flex items-center gap-1 ${
                              res.isOpen ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {res.isOpen ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            {res.isOpen ? 'Đang mở cửa' : 'Tạm đóng'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              toggleRestaurantOpen(res.id);
                              showToast(`Đã thay đổi trạng thái mở quán: ${res.name}`, 'info');
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                          >
                            {res.isOpen ? 'Đóng quán' : 'Mở quán'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: MENU & FOODS MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <div>
                <h3 className="font-black text-sm text-slate-900">
                  Thực Đơn Món Ăn Đà Nẵng Toàn Hệ Thống
                </h3>
                <p className="text-xs text-slate-400">Hơn 95+ món ăn đặc sản đang mở bán</p>
              </div>

              <button
                onClick={() => showToast('Mở trình tạo món mới cho nhà hàng', 'info')}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm món mới</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {restaurants.flatMap((r) => r.menu).slice(0, 8).map((food) => (
                <div key={food.id} className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex flex-col justify-between">
                  <div>
                    <img src={food.image} alt={food.name} className="w-full h-32 rounded-xl object-cover mb-2" />
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{food.name}</h4>
                    <div className="text-[11px] text-amber-600 font-black mt-1">
                      {food.price.toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-600 font-bold">Còn hàng</span>
                    <button
                      onClick={() => showToast(`Đã cập nhật trạng thái món ${food.name}`, 'success')}
                      className="text-slate-400 hover:text-slate-800 font-semibold"
                    >
                      Ẩn món
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: ORDERS DEEP MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="font-black text-sm text-slate-900">
                Toàn Bộ Đơn Hàng Hệ Thống Đà Nẵng
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 font-bold">Tổng đơn: {orders.length}</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Mã Đơn</th>
                      <th className="p-4">Khách Hàng</th>
                      <th className="p-4">Quán Ăn</th>
                      <th className="p-4">Địa Chỉ Giao</th>
                      <th className="p-4">Tổng Tiền</th>
                      <th className="p-4">Trạng Thái</th>
                      <th className="p-4 text-right">Điều Phối</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4 font-mono font-black text-slate-900">{o.orderCode}</td>
                        <td className="p-4 font-bold text-slate-800">{o.userName}</td>
                        <td className="p-4 font-semibold text-slate-700">{o.restaurantName}</td>
                        <td className="p-4 text-slate-500 truncate max-w-xs">{o.deliveryAddress.detail}</td>
                        <td className="p-4 font-black text-rose-600">{o.totalAmount.toLocaleString('vi-VN')}đ</td>
                        <td className="p-4">
                          <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold text-[10px]">
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => showToast(`Đã điều phối lại tài xế cho đơn ${o.orderCode}!`, 'success')}
                            className="px-2.5 py-1 bg-[#FFC700] hover:bg-amber-400 font-bold text-[11px] rounded-lg cursor-pointer"
                          >
                            Đổi xế
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: DRIVER FLEET MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'drivers' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-400 font-bold uppercase">Tổng Tài Xế Be Đà Nẵng</span>
                <div className="text-xl font-black text-slate-900 mt-1">185 tài xế</div>
              </div>
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-400 font-bold uppercase">Đang Trực Tuyến</span>
                <div className="text-xl font-black text-emerald-600 mt-1">142 xe máy (76.7%)</div>
              </div>
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-400 font-bold uppercase">Tỷ Lệ Hoàn Thành Cuốc</span>
                <div className="text-xl font-black text-amber-600 mt-1">99.1%</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="font-black text-sm text-slate-900 mb-3">Tài Xế Tiêu Biểu Trong Ngày</h3>
              <div className="space-y-2">
                {[
                  { name: 'Nguyễn Văn Be', biển: '43-D1 888.68', cuốc: 32, đánhGiá: 5.0, thuNhập: 640000 },
                  { name: 'Lê Văn Tài', biển: '43-K1 556.78', cuốc: 28, đánhGiá: 4.9, thuNhập: 560000 },
                  { name: 'Trần Văn Nam', biển: '43-D2 123.45', cuốc: 25, đánhGiá: 4.95, thuNhập: 500000 },
                ].map((d) => (
                  <div key={d.biển} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{d.name} ({d.biển})</div>
                      <div className="text-slate-400">Đã chạy {d.cuốc} cuốc hôm nay • ⭐ {d.đánhGiá}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-emerald-600">{d.thuNhập.toLocaleString('vi-VN')}đ</div>
                      <button
                        onClick={() => showToast(`Đã duyệt yêu cầu rút tiền cho tài xế ${d.name}`, 'success')}
                        className="text-[10px] text-amber-600 font-bold hover:underline"
                      >
                        Duyệt rút ví
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 8: DELIVERY AREAS & SURGE PRICING */}
        {/* ========================================================= */}
        {activeTab === 'delivery_areas' && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-black text-base text-slate-900">
                Cấu Hình Khu Vực Giao Hàng & Biểu Phí Đà Nẵng
              </h3>
              <p className="text-xs text-slate-500">
                Thiết lập bán kính hoạt động, phụ phí cao điểm và biểu giá theo cự ly km
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-700">Phí cơ bản (2km đầu)</span>
                  <div className="text-lg font-black text-amber-600">15.000₫</div>
                  <span className="text-[10px] text-slate-400">Áp dụng toàn TP Đà Nẵng</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-700">Mỗi km tiếp theo</span>
                  <div className="text-lg font-black text-amber-600">+5.000₫ / km</div>
                  <span className="text-[10px] text-slate-400">Tính theo tọa độ Google Maps</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-700">Phụ phí giờ cao điểm</span>
                  <div className="text-lg font-black text-rose-600">+5.000₫ / đơn</div>
                  <span className="text-[10px] text-slate-400">11h30-13h & 18h30-20h</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 9: FINANCE & SETTLEMENTS (Module 15, 16, 17, 18) */}
        {/* ========================================================= */}
        {activeTab === 'finance' && (
          <FinanceSettlementCenter />
        )}

        {/* ========================================================= */}
        {/* TAB 10: VOUCHERS & MARKETING */}
        {/* ========================================================= */}
        {activeTab === 'vouchers' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <div>
                <h3 className="font-black text-sm text-slate-900">Quản Lý Mã Giảm Giá beFood</h3>
                <p className="text-xs text-slate-400">Các voucher đang phát hành trên toàn TP. Đà Nẵng</p>
              </div>

              <button
                onClick={() => showToast('Mở hộp thoại tạo mã giảm giá mới', 'info')}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo voucher</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableVouchers.map((v) => (
                <div key={v.id} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-slate-900 bg-amber-100 px-2.5 py-1 rounded-xl">
                      {v.code}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {v.badge || 'Đang chạy'}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-800">{v.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{v.description}</p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-amber-600 font-bold">Giảm {v.discountValue.toLocaleString('vi-VN')}đ</span>
                    <button
                      onClick={() => {
                        deleteVoucher(v.id);
                        showToast(`Đã thu hồi mã ${v.code}`, 'warning');
                      }}
                      className="text-rose-600 hover:underline font-semibold"
                    >
                      Xóa mã
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: REVIEWS & COMMENTS MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Top Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 block mb-1">Tổng lượt đánh giá</span>
                <div className="text-2xl font-black text-slate-900">{reviews.length} đánh giá</div>
                <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">100% từ khách hàng thật</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 block mb-1">Điểm TB toàn sàn</span>
                <div className="text-2xl font-black text-amber-500 flex items-center gap-1">
                  <Star className="w-5 h-5 fill-current" /> 4.96 / 5.0
                </div>
                <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">Top chất lượng Đà Nẵng</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 block mb-1">Đánh giá 5 sao</span>
                <div className="text-2xl font-black text-emerald-600">
                  {reviews.filter((r) => r.rating === 5).length}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 inline-block">Chiếm 95% tổng đánh giá</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 block mb-1">Đã phản hồi</span>
                <div className="text-2xl font-black text-blue-600">
                  {reviews.filter((r) => r.reply).length}
                </div>
                <span className="text-[11px] text-blue-500 font-bold mt-1 inline-block">Chăm sóc khách hàng tốt</span>
              </div>
            </div>

            {/* Reviews Management Feed */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Danh Sách Đánh Giá & Bình Luận Toàn Sàn BeFood
                  </h3>
                  <p className="text-xs text-slate-400">
                    Kiểm duyệt nội dung, trả lời khách hàng và theo dõi phản hồi ẩm thực Đà Nẵng
                  </p>
                </div>
                <span className="bg-amber-100 text-amber-900 font-black text-xs px-3 py-1 rounded-full">
                  {reviews.length} đánh giá hoạt động
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-5 hover:bg-slate-50/60 transition-colors space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <img
                          src={rev.userAvatar}
                          alt={rev.userName}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-900">{rev.userName}</span>
                            {rev.orderCode && (
                              <span className="bg-slate-100 text-slate-600 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                                {rev.orderCode}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>Quán: <strong className="text-slate-700">{rev.restaurantName}</strong></span>
                            {rev.foodName && (
                              <>
                                <span>•</span>
                                <span className="text-amber-800 font-semibold">Món: {rev.foodName}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>{rev.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="font-black text-xs text-slate-700">{rev.rating}.0/5</span>
                      </div>
                    </div>

                    {/* Comment text */}
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      "{rev.comment}"
                    </p>

                    {/* Attached photos */}
                    {rev.images && rev.images.length > 0 && (
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {rev.images.map((imgUrl, idx) => (
                          <img
                            key={idx}
                            src={imgUrl}
                            alt="Visual"
                            className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-200 shadow-xs"
                          />
                        ))}
                      </div>
                    )}

                    {/* Reply box if existing */}
                    {rev.reply && (
                      <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-amber-900 text-[11px]">
                          <span>💬 Phản hồi chính thức: {rev.reply.author}</span>
                          <span className="text-slate-400 font-normal">{rev.reply.date}</span>
                        </div>
                        <p className="text-slate-700 italic">{rev.reply.content}</p>
                      </div>
                    )}

                    {/* Admin Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-[11px] text-slate-400 font-semibold">
                        ❤️ {rev.likes} lượt thích hữu ích
                      </span>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            const replyText = prompt(
                              `Nhập nội dung phản hồi đánh giá của khách hàng ${rev.userName}:`,
                              rev.reply ? rev.reply.content : 'BeFood cảm ơn bạn rất nhiều vì đã ủng hộ món ngon Đà Nẵng!'
                            );
                            if (replyText && replyText.trim()) {
                              replyReview(rev.id, replyText.trim());
                            }
                          }}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          {rev.reply ? 'Sửa phản hồi' : '💬 Trả lời đánh giá'}
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc muốn xóa đánh giá của ${rev.userName}?`)) {
                              deleteReview(rev.id);
                            }
                          }}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Xóa đánh giá
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 12: GEMINI AI ANALYST & CONFIG */}
        {/* ========================================================= */}
        {activeTab === 'ai_analytics' && (
          <div className="space-y-6">
            {/* Integrated Full Admin AI Chat & Business Intelligence */}
            <AdminAIChat />

            {/* Gemini API Technical Configuration */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
                Cấu Hình Mô Hình Gemini AI
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mô hình AI</label>
                  <select
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-bold outline-none"
                  >
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Nhanh & Tối ưu chi phí)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Lập luận phân tích sâu)</option>
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-gen)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Temperature ({aiTemperature})</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={aiTemperature}
                    onChange={(e) => setAiTemperature(parseFloat(e.target.value))}
                    className="w-full mt-2 accent-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tính năng nâng cao</label>
                  <div className="space-y-1.5 mt-1.5">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={aiFraudAlert}
                        onChange={(e) => setAiFraudAlert(e.target.checked)}
                        className="rounded text-amber-500"
                      />
                      <span>Tự động phát hiện gian lận (Fraud Sentinel)</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={aiAutoDispatch}
                        onChange={(e) => setAiAutoDispatch(e.target.checked)}
                        className="rounded text-amber-500"
                      />
                      <span>Gợi ý điều phối tài xế tự động</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 12: AUDIT LOGS & SECURITY */}
        {/* ========================================================= */}
        {activeTab === 'audit_logs' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-sm text-slate-900">
                    Nhật Ký Hoạt Động Hệ Thống (Audit Trail)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Ghi lại tất cả thao tác của Quản trị viên, Backend API và bảo mật
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <button
                    onClick={() => {
                      setMaintenanceMode(!maintenanceMode);
                      showToast(`Đã ${!maintenanceMode ? 'BẬT' : 'TẮT'} Chế độ bảo trì hệ thống!`, !maintenanceMode ? 'warning' : 'success');
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                      maintenanceMode ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {maintenanceMode ? '⚠️ Đang bảo trì' : 'Chế độ bảo trì'}
                  </button>

                  <button
                    onClick={() => showToast('Đã tạo bản sao lưu Database SQL Server an toàn!', 'success')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Sao lưu DB
                  </button>
                </div>
              </div>

              {/* Status Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500">Backend API C# ASP.NET Core:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online (Port 5000)
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500">SQL Server Entity Framework:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Connected
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500">SignalR WebSocket Hub:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 185 Kết nối
                  </span>
                </div>
              </div>
            </div>

            {/* Audit Logs Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Thời Gian</th>
                      <th className="p-4">Người Thực Hiện</th>
                      <th className="p-4">Hành Động</th>
                      <th className="p-4">Đối Tượng Tác Động</th>
                      <th className="p-4">Địa Chỉ IP</th>
                      <th className="p-4 text-right">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4 font-mono font-medium text-slate-600">{log.time}</td>
                        <td className="p-4 font-bold text-slate-900">{log.admin}</td>
                        <td className="p-4 font-semibold text-slate-800">{log.action}</td>
                        <td className="p-4 text-slate-600">{log.target}</td>
                        <td className="p-4 font-mono text-slate-400">{log.ip}</td>
                        <td className="p-4 text-right">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              log.status === 'SUCCESS'
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 14: SYSTEM INFRASTRUCTURE & BACKUP (Module 38, 39, 40) */}
        {/* ========================================================= */}
        {activeTab === 'system_infra' && (
          <SystemInfraCenter />
        )}
      </div>

      {/* Customer 360 Deep Profile Modal */}
      <Customer360Modal
        user={selected360User}
        isOpen={!!selected360User}
        onClose={() => setSelected360User(null)}
        onToggleLock={handleToggleUserLock}
      />
    </SidebarLayout>
  );
};
