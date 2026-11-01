import React from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import {
  User,
  Store,
  ChefHat,
  Package,
  Bike,
  Headphones,
  Megaphone,
  DollarSign,
  ShieldCheck,
  Bot,
  Sparkles,
  TrendingUp,
  CalendarCheck,
} from 'lucide-react';

export const RoleSwitchBanner: React.FC = () => {
  const { currentRole, setCurrentRole, orders, currentUser, openAdminAuthModal } = useApp();

  const activeOrdersCount = orders.filter(
    (o) => o.orderStatus !== 'COMPLETED' && o.orderStatus !== 'CANCELLED'
  ).length;

  const roles: { id: Role; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'customer', label: '1. Khách hàng', icon: <User className="w-3.5 h-3.5" />, desc: 'Đặt món Đà Nẵng, đặt nhóm & chia tiền' },
    { id: 'merchant', label: '2. Nhà hàng', icon: <Store className="w-3.5 h-3.5" />, desc: 'Quản lý quán & chi nhánh Đà Nẵng' },
    { id: 'kitchen', label: '3. Màn hình Bếp', icon: <ChefHat className="w-3.5 h-3.5" />, desc: 'Kitchen Display System (KDS)' },
    { id: 'warehouse', label: '4. Kho vận', icon: <Package className="w-3.5 h-3.5" />, desc: 'Định lượng & Cảnh báo hạn' },
    { id: 'driver', label: '5. Tài xế Be', icon: <Bike className="w-3.5 h-3.5" />, desc: 'Bản đồ Đà Nẵng, radar nhận cuốc & OTP' },
    { id: 'support', label: '6. CSKH', icon: <Headphones className="w-3.5 h-3.5" />, desc: 'Chat khiếu nại & Hoàn tiền bePay' },
    { id: 'marketing', label: '7. Tiếp thị', icon: <Megaphone className="w-3.5 h-3.5" />, desc: 'Voucher, BOGO & Hạng VIP' },
    { id: 'accounting', label: '8. Kế toán', icon: <DollarSign className="w-3.5 h-3.5" />, desc: 'Đối soát 18% & Rút tiền tài xế' },
    { id: 'admin', label: '9. Quản trị', icon: <ShieldCheck className="w-3.5 h-3.5" />, desc: 'Tổng điều hành & Kiểm soát sàn' },
    { id: 'ai_center', label: '10. Gemini AI', icon: <Bot className="w-3.5 h-3.5" />, desc: 'AI Vision, Viết bài & Gợi ý món' },
    { id: 'analytics', label: '11. Phân tích', icon: <TrendingUp className="w-3.5 h-3.5" />, desc: 'Machine Learning & Dự báo nhu cầu' },
    { id: 'hr', label: '12. Nhân sự', icon: <CalendarCheck className="w-3.5 h-3.5" />, desc: 'Phân ca làm việc & Chấm công' },
  ];

  return (
    <div className="bg-[#001736] text-white text-xs border-b border-slate-700/80 sticky top-0 z-50 px-3 py-1.5 transition-all shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center space-x-2 shrink-0">
          <span className="flex items-center gap-1.5 font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20 text-[10px]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#FFC700]" />
            12 PHÂN HỆ GIA BẢO FOOD ĐÀ NẴNG
          </span>
        </div>

        <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 overflow-x-auto scrollbar-none shrink-0">
          {roles.map((r) => {
            const isActive = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setCurrentRole(r.id);
                  if (r.id === 'admin' && (!currentUser || currentUser.role !== 'admin')) {
                    openAdminAuthModal('signin');
                  }
                }}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FFC700] text-slate-950 font-black shadow-md shadow-amber-400/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title={r.desc}
              >
                {r.icon}
                <span>{r.label}</span>
                {r.id === 'merchant' && activeOrdersCount > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
