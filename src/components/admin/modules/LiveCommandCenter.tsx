import React, { useState } from 'react';
import {
  Radio,
  MapPin,
  Bike,
  Store,
  Clock,
  Compass,
  Zap,
  TrendingUp,
  AlertTriangle,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { DaNangLiveMap } from '../../customer/DaNangLiveMap';
import { useApp } from '../../../context/AppContext';

export const LiveCommandCenter: React.FC = () => {
  const { orders, showToast, playNotificationSound } = useApp();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [isSmartDispatchActive, setIsSmartDispatchActive] = useState<boolean>(true);

  // Active district zones in Da Nang with delivery fees and surge pricing
  const districts = [
    { id: 'ALL', name: 'Toàn TP. Đà Nẵng', activeOrders: 128, activeDrivers: 142, surge: '1.0x (Bình thường)' },
    { id: 'HC', name: 'Quận Hải Châu', activeOrders: 54, activeDrivers: 62, surge: '1.2x (Giờ trưa cao điểm)' },
    { id: 'ST', name: 'Quận Sơn Trà', activeOrders: 36, activeDrivers: 40, surge: '1.0x (Bình thường)' },
    { id: 'TK', name: 'Quận Thanh Khê', activeOrders: 20, activeDrivers: 24, surge: '1.0x (Bình thường)' },
    { id: 'NHS', name: 'Quận Ngũ Hành Sơn', activeOrders: 12, activeDrivers: 10, surge: '1.1x (Khách du lịch)' },
    { id: 'LC', name: 'Quận Liên Chiểu', activeOrders: 6, activeDrivers: 6, surge: '1.0x (Bình thường)' },
  ];

  const activeDeliveries = orders.filter(
    (o) => o.orderStatus === 'DELIVERING' || o.orderStatus === 'PREPARING' || o.orderStatus === 'DRIVER_ASSIGNED'
  );

  const toggleSmartDispatch = () => {
    setIsSmartDispatchActive(!isSmartDispatchActive);
    playNotificationSound();
    showToast(
      !isSmartDispatchActive
        ? 'Đã BẬT Smart Dispatch AI: Tự động ghép tài xế gần quán nhất trong 5s'
        : 'Đã TẮT Smart Dispatch AI: Chuyển sang điều phối thủ công',
      !isSmartDispatchActive ? 'success' : 'info'
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header Card */}
      <div className="bg-[#00204A] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-xl text-white">Live Command Center Đà Nẵng</h2>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Realtime GPS
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Trung tâm điều phối live: 142 tài xế BeBike trực tuyến • 128 đơn đang vận chuyển
              </p>
            </div>
          </div>

          {/* Smart Dispatch Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSmartDispatch}
              className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs font-black shadow-lg transition-all cursor-pointer ${
                isSmartDispatchActive
                  ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-amber-400/20'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{isSmartDispatchActive ? 'Smart Dispatch AI: ĐANG BẬT' : 'Smart Dispatch: TẮT'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* District Zone Heatmap Metric Chips */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        {districts.map((d) => (
          <div
            key={d.id}
            onClick={() => setSelectedDistrict(d.id)}
            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedDistrict === d.id
                ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-400/20'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="font-bold text-slate-900 block truncate">{d.name}</span>
            <div className="flex items-center justify-between mt-2 font-black">
              <span className="text-amber-600">{d.activeOrders} đơn</span>
              <span className="text-blue-600">{d.activeDrivers} xe</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block truncate">{d.surge}</span>
          </div>
        ))}
      </div>

      {/* Main Grid: Google Maps GPS Heatmap + Realtime Dispatch Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Map View (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <span className="font-extrabold text-sm sm:text-base">
                Bản Đồ Nhiệt Đơn Hàng & Vị Trí Xe BeBike Trực Tuyến
              </span>
            </div>
            <span className="text-xs text-slate-400">Google Maps Roadmap & Satellite</span>
          </div>

          <div className="h-[460px] w-full relative">
            <DaNangLiveMap
              restaurantLat={16.0615}
              restaurantLng={108.2045}
              restaurantName="Mì Quảng Bà Mua - Trung tâm Hải Châu"
              customerLat={16.0682}
              customerLng={108.2145}
              customerAddressTitle="155 Nguyễn Văn Linh, Đà Nẵng"
              driverName="Nguyễn Văn Be (43-C1 888.68)"
              progressPercent={65}
              isDelivering={true}
            />
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs gap-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-bold text-slate-700">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Đơn đang giao (68)
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-700">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span> Chờ lấy món (42)
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-700">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span> Xe rảnh sẵn sàng (32)
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Tự động làm mới mỗi 5 giây</span>
          </div>
        </div>

        {/* Right Active Dispatch Queue (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-sm">Hàng Đợi Điều Phối Thông Minh</h3>
            </div>
            <span className="bg-amber-100 text-amber-900 font-black text-xs px-2 py-0.5 rounded-full">
              {activeDeliveries.length || 6} đang giao
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[460px] text-xs">
            <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-xs text-slate-950 bg-amber-400 px-2 py-0.5 rounded-md">
                  BE-DN-9941
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                  Tài xế cách quán 300m
                </span>
              </div>
              <div className="font-bold text-slate-900">Mì Quảng Bà Mua ➔ 155 Nguyễn Văn Linh</div>
              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-amber-200/50">
                <span>TX: Nguyễn Văn Be (43-C1 888.68)</span>
                <strong className="text-slate-900">137.000đ</strong>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-xs text-slate-950 bg-slate-200 px-2 py-0.5 rounded-md">
                  BE-DN-8812
                </span>
                <span className="text-[10px] font-bold text-blue-600 bg-white px-2 py-0.5 rounded-full border border-blue-200">
                  Đang chế biến tại bếp
                </span>
              </div>
              <div className="font-bold text-slate-900">Bún Chả Cá Hờn 113A ➔ Novotel Bạch Đằng</div>
              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200">
                <span>TX: Lê Văn Hùng (43-D1 678.90)</span>
                <strong className="text-slate-900">86.000đ</strong>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-xs text-slate-950 bg-slate-200 px-2 py-0.5 rounded-md">
                  BE-DN-7734
                </span>
                <span className="text-[10px] font-bold text-purple-600 bg-white px-2 py-0.5 rounded-full border border-purple-200">
                  Đang giao khách
                </span>
              </div>
              <div className="font-bold text-slate-900">Hải Sản Bé Mặn ➔ Khách sạn Mường Thanh</div>
              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200">
                <span>TX: Trần Đình Trọng (43-K1 234.56)</span>
                <strong className="text-slate-900">320.000đ</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

