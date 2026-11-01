import React from 'react';
import {
  X,
  User,
  ShoppingBag,
  CreditCard,
  Award,
  Clock,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Star,
  DollarSign,
  Heart
} from 'lucide-react';

interface Customer360ModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onToggleLock: (userId: string) => void;
}

export const Customer360Modal: React.FC<Customer360ModalProps> = ({
  user,
  isOpen,
  onClose,
  onToggleLock,
}) => {
  if (!isOpen || !user) return null;

  const totalSpent = (user.totalOrders || 18) * 145000;
  const isLocked = user.status === 'locked';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00204A] text-white flex items-center justify-center font-bold shadow-md">
              <User className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-slate-900">
                  Hồ Sơ Khách Hàng 360° (Customer 360)
                </h3>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  isLocked ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {isLocked ? 'ĐÃ KHÓA' : 'ĐANG HOẠT ĐỘNG'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Toàn cảnh chân dung khách hàng, hành vi đặt món và lịch sử chi tiêu tại Đà Nẵng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Quick Identity Card */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400 shadow-md shrink-0"
            />
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-base text-slate-900">{user.name}</h4>
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-md">
                  Hạng VIP GOLD
                </span>
              </div>
              <div className="text-slate-500 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {user.email}
              </div>
              <div className="text-slate-500 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> {user.phone || '0908 123 456'}
              </div>
              <div className="text-slate-400 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> 155 Nguyễn Văn Linh, Quận Hải Châu, Đà Nẵng
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
            <button
              onClick={() => onToggleLock(user.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isLocked
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
              }`}
            >
              {isLocked ? 'Mở Khóa Tài Khoản' : 'Khóa Tài Khoản'}
            </button>
            <span className="text-[11px] text-slate-400">Tham gia: {user.joinedDate || '15/01/2024'}</span>
          </div>
        </div>

        {/* 4 KPI Metrics: LTV, Orders, Basket, Points */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-slate-400 block mb-1">Tổng chi tiêu (LTV)</span>
            <div className="text-lg font-black text-slate-900">{totalSpent.toLocaleString('vi-VN')}đ</div>
            <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Khách hàng giá trị cao</span>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-slate-400 block mb-1">Số đơn hoàn thành</span>
            <div className="text-lg font-black text-amber-600">{user.totalOrders || 18} đơn</div>
            <span className="text-[10px] text-slate-400 mt-1 block">Tỷ lệ thành công: 98%</span>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-slate-400 block mb-1">Số dư ví bePay</span>
            <div className="text-lg font-black text-blue-600">{(user.walletBalance || 350000).toLocaleString('vi-VN')}đ</div>
            <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Đã liên kết MB Bank</span>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-slate-400 block mb-1">Điểm tích lũy bePoint</span>
            <div className="text-lg font-black text-purple-600">2.450 pts</div>
            <span className="text-[10px] text-purple-500 font-bold mt-1 block">Đổi được 3 voucher</span>
          </div>
        </div>

        {/* Customer Preferences & Behavioral Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Favorite foods */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center space-x-2 font-bold text-slate-900">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>Món ăn & Quán yêu thích</span>
            </div>
            <div className="space-y-2">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Mì Quảng Gà Ta Thả Vườn</div>
                  <div className="text-[11px] text-slate-400">Mì Quảng Bà Mua (Đặt 8 lần)</div>
                </div>
                <span className="font-black text-amber-600">45.000đ</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Trà Sữa Phúc Long L</div>
                  <div className="text-[11px] text-slate-400">Phúc Long Nguyễn Văn Linh (Đặt 5 lần)</div>
                </div>
                <span className="font-black text-amber-600">55.000đ</span>
              </div>
            </div>
          </div>

          {/* AI Behavioral Tagging */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center space-x-2 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Phân tích hành vi & Rủi ro AI</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-600 font-medium">Chỉ số rủi ro gian lận (Fraud Score):</span>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  0.02 (An toàn tuyệt đối)
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-600 font-medium">Khung giờ đặt nhiều nhất:</span>
                <span className="font-bold text-slate-800">11:30 - 12:30 (Giờ ăn trưa)</span>
              </div>
              <div className="flex items-center justify-between text-[11px] bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-600 font-medium">Phương thức chuộng nhất:</span>
                <span className="font-bold text-slate-800">VietQR Napas 24/7 & bePay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Đóng hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
};

