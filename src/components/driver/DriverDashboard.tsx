import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DaNangLiveMap } from '../customer/DaNangLiveMap';
import {
  Bike,
  Power,
  Navigation,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Star,
  Clock,
  Store,
  ChevronRight,
  ShieldCheck,
  Users,
  Compass,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  Award,
  ChevronDown
} from 'lucide-react';

interface DriverProfile {
  id: string;
  name: string;
  avatar: string;
  vehicle: string;
  plate: string;
  rating: number;
  completedTrips: number;
  todayEarnings: number;
  acceptanceRate: string;
  district: string;
  status: 'ONLINE' | 'BUSY' | 'OFFLINE';
  phone: string;
}

const MOCK_DRIVERS: DriverProfile[] = [
  {
    id: 'drv-01',
    name: 'Nguyễn Văn Be',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    vehicle: 'Honda Wave Alpha',
    plate: '43-C1 888.68',
    rating: 4.98,
    completedTrips: 3412,
    todayEarnings: 285000,
    acceptanceRate: '98.5%',
    district: 'Quận Hải Châu',
    status: 'ONLINE',
    phone: '0905 123 456'
  },
  {
    id: 'drv-02',
    name: 'Lê Văn Hùng',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    vehicle: 'Yamaha Grande Hybrid',
    plate: '43-D1 678.90',
    rating: 4.96,
    completedTrips: 2840,
    todayEarnings: 310000,
    acceptanceRate: '99.1%',
    district: 'Quận Thanh Khê',
    status: 'ONLINE',
    phone: '0914 987 654'
  },
  {
    id: 'drv-03',
    name: 'Trần Đình Trọng',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    vehicle: 'Honda Winner X 150',
    plate: '43-K1 234.56',
    rating: 4.92,
    completedTrips: 1950,
    todayEarnings: 220000,
    acceptanceRate: '96.8%',
    district: 'Quận Sơn Trà',
    status: 'ONLINE',
    phone: '0935 444 777'
  },
  {
    id: 'drv-04',
    name: 'Huỳnh Minh Đức',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    vehicle: 'Honda Air Blade 160',
    plate: '43-E1 999.88',
    rating: 4.99,
    completedTrips: 4120,
    todayEarnings: 360000,
    acceptanceRate: '100%',
    district: 'Quận Ngũ Hành Sơn',
    status: 'ONLINE',
    phone: '0908 333 222'
  },
  {
    id: 'drv-05',
    name: 'Võ Thị Kim Oanh',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    vehicle: 'Yamaha Janus Premium',
    plate: '43-G1 112.34',
    rating: 4.95,
    completedTrips: 2310,
    todayEarnings: 270000,
    acceptanceRate: '97.5%',
    district: 'Quận Cẩm Lệ',
    status: 'ONLINE',
    phone: '0977 888 999'
  }
];

export const DriverDashboard: React.FC = () => {
  const { orders, updateOrderStatus, showToast, playNotificationSound } = useApp();
  
  // Selected driver from fleet
  const [selectedDriver, setSelectedDriver] = useState<DriverProfile>(MOCK_DRIVERS[0]);
  const [isOnline, setIsOnline] = useState(true);
  const [showFleetModal, setShowFleetModal] = useState(false);

  // Simulated radar incoming order offers for driver to pick up
  const [incomingOffers, setIncomingOffers] = useState([
    {
      id: 'offer-dn-01',
      code: 'BE-DN-7721',
      restaurantName: 'Bún Chả Cá Hờn 113A - Gia Truyền Hải Châu',
      restaurantAddress: '113/3 Nguyễn Chí Thanh, Hải Châu, Đà Nẵng',
      customerName: 'Nguyễn Thị Phương Thảo',
      customerPhone: '0935 888 123',
      deliveryAddress: 'Chung cư HAGL Lakeview, 72 Hàm Nghi, Thanh Khê',
      distanceKm: 1.8,
      fare: 32000,
      tip: 10000,
      items: '2x Bún chả cá thập cẩm tô lớn, 2x Sữa đậu nành lá dứa',
      note: 'Giao lên tầng 8 phòng 804 bấm chuông giúp em ạ'
    },
    {
      id: 'offer-dn-02',
      code: 'BE-DN-8842',
      restaurantName: 'Hải Sản Bé Mặn - Tươi Sống Biển Mỹ Khê',
      restaurantAddress: 'Lô 11 Võ Nguyên Giáp, Phường Mân Thái, Sơn Trà',
      customerName: 'Lê Hoàng Nam',
      customerPhone: '0912 345 678',
      deliveryAddress: 'Khách sạn Novotel Da Nang, 36 Bạch Đằng, Hải Châu',
      distanceKm: 3.4,
      fare: 48000,
      tip: 20000,
      items: '1x Mực một nắng nướng sa tế, 1x Nghêu hai cồi hấp sả',
      note: 'Đợi ở sảnh lễ tân em xuống nhận ngay ạ'
    }
  ]);

  // Active delivery order assigned to driver
  const activeDeliveryOrder = orders.find(
    (o) =>
      o.orderStatus === 'CONFIRMED' ||
      o.orderStatus === 'PREPARING' ||
      o.orderStatus === 'DRIVER_ASSIGNED' ||
      o.orderStatus === 'DRIVER_PICKED_UP' ||
      o.orderStatus === 'DELIVERING'
  );

  const completedTrips = orders.filter((o) => o.orderStatus === 'COMPLETED');
  const todayEarnings = selectedDriver.todayEarnings + completedTrips.length * 28000;

  const toggleOnline = () => {
    setIsOnline(!isOnline);
    playNotificationSound();
    showToast(
      !isOnline
        ? `Tài xế ${selectedDriver.name} đã BẬT nhận cuốc BeFood Đà Nẵng 🛵`
        : `Tài xế ${selectedDriver.name} đã TẮT chế độ nhận đơn`,
      !isOnline ? 'success' : 'info'
    );
  };

  const handleAcceptOffer = (offer: typeof incomingOffers[0]) => {
    playNotificationSound();
    showToast(`Đã nhận cuốc ${offer.code}! Bắt đầu di chuyển tới quán lấy món.`, 'success');
    setIncomingOffers(incomingOffers.filter(o => o.id !== offer.id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
      {/* Top Banner: Driver Fleet Management Header */}
      <div className="bg-[#00204A] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Driver Profile Info */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={selectedDriver.avatar}
                alt={selectedDriver.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-amber-400 shadow-lg"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#00204A] ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'
                }`}
              ></span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-xl sm:text-2xl text-white">{selectedDriver.name}</h2>
                <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-current" /> Tài xế 5 Sao Be
                </span>
                <span className="bg-blue-900/60 border border-blue-400/30 text-blue-200 text-xs font-bold px-2 py-0.5 rounded-full">
                  {selectedDriver.district}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {selectedDriver.vehicle} • Biển số: <span className="text-amber-300 font-black">{selectedDriver.plate}</span> • SĐT: {selectedDriver.phone}
              </p>

              <div className="flex items-center space-x-4 mt-2 text-xs text-slate-300">
                <span className="flex items-center text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current mr-1" /> {selectedDriver.rating} ({selectedDriver.completedTrips.toLocaleString()} chuyến)
                </span>
                <span>• Tỷ lệ nhận: <strong className="text-emerald-400">{selectedDriver.acceptanceRate}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Fleet Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Fleet Switcher Button (Nhiều người hơn) */}
            <button
              onClick={() => setShowFleetModal(true)}
              className="flex items-center space-x-2 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-xs font-bold text-white transition-all cursor-pointer backdrop-blur-sm"
              title="Đổi tài xế trong đội ngũ BeFood Đà Nẵng"
            >
              <Users className="w-4 h-4 text-amber-300" />
              <span>Đội ngũ ({MOCK_DRIVERS.length} tài xế)</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Toggle Online Button */}
            <button
              onClick={toggleOnline}
              className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs font-black shadow-lg transition-all cursor-pointer ${
                isOnline
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{isOnline ? 'Đang Bật Sẵn Sàng Nhận Cuốc' : 'Đang Nghỉ Ngơi (Offline)'}</span>
            </button>
          </div>
        </div>

        {/* Quick Driver Fleet Horizontal Selector (Nhiều tài xế) */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-amber-400" /> Chọn nhanh tài xế:
          </span>
          {MOCK_DRIVERS.map((driver) => (
            <button
              key={driver.id}
              onClick={() => {
                setSelectedDriver(driver);
                showToast(`Đã chuyển sang tài xế: ${driver.name} (${driver.plate})`, 'info');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedDriver.id === driver.id
                  ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-white/50'
                  : 'bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10'
              }`}
            >
              <img src={driver.avatar} alt={driver.name} className="w-5 h-5 rounded-full object-cover" />
              <span>{driver.name}</span>
              <span className="text-[10px] opacity-80">({driver.plate})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Driver Daily Earnings Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">Thu nhập hôm nay</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {todayEarnings.toLocaleString('vi-VN')}đ
          </div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Cước + Thưởng cuốc + Tip
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">Chuyến hoàn thành</span>
          <div className="text-xl sm:text-2xl font-black text-amber-600">
            {completedTrips.length + 8} chuyến
          </div>
          <span className="text-[10px] text-slate-400 mt-1 inline-block">Mục tiêu ngày: 15 chuyến</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">Tỷ lệ nhận cuốc</span>
          <div className="text-xl sm:text-2xl font-black text-blue-600">{selectedDriver.acceptanceRate}</div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">Đạt chuẩn thưởng ngày</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block mb-1">Đánh giá 5 sao</span>
          <div className="text-xl sm:text-2xl font-black text-amber-500 flex items-center gap-1">
            <Star className="w-5 h-5 fill-current" /> {selectedDriver.rating}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">Top 1% tài xế Đà Nẵng</span>
        </div>
      </div>

      {/* Main Grid: Live Google Maps + Delivery Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Google Maps Navigation (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                <Compass className="w-5 h-5 text-amber-400" />
                <span className="font-extrabold text-sm sm:text-base">
                  Bản đồ Google Maps GPS Trực Tuyến Đà Nẵng
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  GPS Active • 25 km/h
                </span>
              </div>
            </div>

            {/* Embedded Live Google Maps */}
            <div className="h-[380px] w-full relative">
              <DaNangLiveMap
                restaurantLat={16.0615}
                restaurantLng={108.2045}
                restaurantName={activeDeliveryOrder?.restaurantName || 'Mì Quảng Bà Mua - Hải Châu'}
                customerLat={16.0682}
                customerLng={108.2145}
                customerAddressTitle={activeDeliveryOrder?.deliveryAddress.title || '155 Nguyễn Văn Linh, Hải Châu'}
                driverName={selectedDriver.name}
                driverLicensePlate={selectedDriver.plate}
                progressPercent={activeDeliveryOrder ? 65 : 30}
                isDelivering={!!activeDeliveryOrder}
              />
            </div>

            {/* Map Road details bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="font-bold text-slate-700">Lộ trình:</span>
                <span className="text-slate-600">Nguyễn Tri Phương ➔ Nguyễn Văn Linh ➔ Cầu Rồng</span>
              </div>
              <div className="flex items-center gap-3 font-semibold text-slate-500">
                <span>Khoảng cách: <strong className="text-slate-900">1.8 km</strong></span>
                <span>Dự kiến: <strong className="text-emerald-600">6 phút</strong></span>
              </div>
            </div>
          </div>

          {/* Incoming Order Offers Pool (Đơn mới nổ cuốc chờ nhận) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Đơn hàng mới nổ cuốc quanh bạn ({incomingOffers.length} đơn)
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">Bán kính 2.5km</span>
            </div>

            {incomingOffers.length > 0 ? (
              <div className="space-y-3">
                {incomingOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="p-4 rounded-2xl border-2 border-amber-200/80 bg-amber-50/40 hover:bg-amber-50 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-md">
                            {offer.code}
                          </span>
                          <span className="text-xs font-bold text-slate-500">Cách bạn: {offer.distanceKm} km</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">{offer.restaurantName}</h4>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-black text-emerald-600">
                          +{(offer.fare + offer.tip).toLocaleString('vi-VN')}đ
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Cước: {offer.fare.toLocaleString()}đ • Tip: {offer.tip.toLocaleString()}đ
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1 bg-white p-2.5 rounded-xl border border-amber-100">
                      <div className="flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{offer.restaurantAddress}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{offer.deliveryAddress}</span>
                      </div>
                      <div className="text-[11px] text-amber-800 font-semibold pt-1">
                        📦 Món: {offer.items}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAcceptOffer(offer)}
                        className="flex-1 py-2.5 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Bike className="w-4 h-4" /> Nhận Cuốc Ngay (15s)
                      </button>
                      <button
                        onClick={() => setIncomingOffers(incomingOffers.filter(o => o.id !== offer.id))}
                        className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Bỏ qua
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                Hiện tại chưa có thêm đơn nổ cuốc. Hệ thống đang tiếp tục quét khu vực Đà Nẵng...
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Delivery Workflow & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Trip Execution Card */}
          {activeDeliveryOrder ? (
            <div className="bg-white rounded-3xl p-6 border-2 border-amber-400 shadow-xl space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Chuyến giao đang thực hiện
                  </h3>
                </div>
                <span className="bg-amber-100 text-amber-900 font-black text-xs px-2.5 py-1 rounded-full uppercase">
                  {activeDeliveryOrder.orderCode}
                </span>
              </div>

              {/* Route Info: Pick up & Drop off */}
              <div className="space-y-4">
                {/* 1. Restaurant */}
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 bg-slate-900 text-white rounded-xl mt-0.5 shadow-md">
                    <Store className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xs flex-1">
                    <span className="text-slate-400 font-medium">1. Điểm lấy món:</span>
                    <div className="font-bold text-slate-900 text-sm">
                      {activeDeliveryOrder.restaurantName}
                    </div>
                    <p className="text-slate-500 mt-0.5">{activeDeliveryOrder.restaurantAddress}</p>
                    <a
                      href={`tel:${activeDeliveryOrder.userPhone}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 mt-1 hover:underline"
                    >
                      <Phone className="w-3 h-3" /> Gọi nhà hàng xác nhận món
                    </a>
                  </div>
                </div>

                {/* Connecting line */}
                <div className="ml-5 w-0.5 h-6 bg-slate-200 border-dashed border-l-2"></div>

                {/* 2. Customer destination */}
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 bg-rose-600 text-white rounded-xl mt-0.5 shadow-md">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="text-xs flex-1">
                    <span className="text-slate-400 font-medium">2. Điểm giao khách:</span>
                    <div className="font-bold text-slate-900 text-sm">
                      {activeDeliveryOrder.userName} ({activeDeliveryOrder.userPhone})
                    </div>
                    <p className="text-slate-600 font-medium mt-0.5">
                      {activeDeliveryOrder.deliveryAddress.title} - {activeDeliveryOrder.deliveryAddress.detail}
                    </p>
                    {activeDeliveryOrder.customerNote && (
                      <p className="text-amber-800 bg-amber-50 p-2.5 rounded-xl mt-1.5 font-semibold border border-amber-200/60">
                        💬 Ghi chú khách: "{activeDeliveryOrder.customerNote}"
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <a
                        href={`tel:${activeDeliveryOrder.userPhone}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline"
                      >
                        <Phone className="w-3 h-3" /> Gọi cho khách
                      </a>
                      <button
                        onClick={() => showToast('Đang kết nối chat với khách hàng...', 'info')}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:underline cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3" /> Nhắn tin khách
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Step Transitions for Driver */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                {activeDeliveryOrder.orderStatus === 'CONFIRMED' && (
                  <button
                    onClick={() => {
                      updateOrderStatus(
                        activeDeliveryOrder.id,
                        'DRIVER_ASSIGNED',
                        'Tài xế đang đến nhà hàng'
                      );
                    }}
                    className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Bike className="w-5 h-5" /> 1. Bắt đầu di chuyển tới quán 🛵
                  </button>
                )}

                {activeDeliveryOrder.orderStatus === 'DRIVER_ASSIGNED' && (
                  <button
                    onClick={() => {
                      updateOrderStatus(
                        activeDeliveryOrder.id,
                        'PREPARING',
                        'Tài xế đã đến quán và đang đợi món'
                      );
                    }}
                    className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Store className="w-5 h-5" /> 2. Đã đến quán - Chờ lấy món
                  </button>
                )}

                {activeDeliveryOrder.orderStatus === 'PREPARING' && (
                  <button
                    onClick={() => {
                      updateOrderStatus(
                        activeDeliveryOrder.id,
                        'DELIVERING',
                        'Tài xế đã nhận món & đang di chuyển tới khách hàng'
                      );
                    }}
                    className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-5 h-5" /> 3. Đã nhận món - Đang giao khách 🚀
                  </button>
                )}

                {activeDeliveryOrder.orderStatus === 'DELIVERING' && (
                  <button
                    onClick={() => {
                      updateOrderStatus(
                        activeDeliveryOrder.id,
                        'COMPLETED',
                        'Tài xế đã giao thành công và thu tiền'
                      );
                    }}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" /> 4. Xác nhận ĐÃ GIAO THÀNH CÔNG 🎉
                  </button>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => showToast('Đang kết nối Trợ lý AI Tài xế hỗ trợ khẩn cấp...', 'info')}
                    className="text-[11px] text-amber-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Hỏi Chatbot AI Tài xế
                  </button>
                  <button
                    onClick={() => showToast('Đã gửi báo cáo sự cố tới bộ phận vận hành Be Đà Nẵng', 'error')}
                    className="text-[11px] text-rose-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" /> Báo sự cố cuốc xe
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-xs space-y-3">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 shadow-inner">
                <Bike className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-base">Đang radar tìm chuyến xe mới...</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Hệ thống BeFood tự động điều phối đơn hàng trong bán kính 3km Hải Châu & Sơn Trà đến bạn nhanh nhất.
              </p>
            </div>
          )}

          {/* Today Trip History List */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center justify-between">
              <span>Lịch sử chuyến hoàn thành hôm nay</span>
              <span className="text-xs text-emerald-600 font-bold">8 chuyến</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">BE-DN-9941 • Mì Quảng Bà Mua</div>
                  <div className="text-[11px] text-slate-400">11:30 • Hoàn thành xuất sắc</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-slate-900">45.000đ</div>
                  <div className="text-[10px] text-amber-500 font-bold">★ 5.0 (Khách tip 15k)</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">BE-DN-8812 • Đặc Sản Trần Hải Châu</div>
                  <div className="text-[11px] text-slate-400">10:45 • Giao đúng hẹn</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-slate-900">38.000đ</div>
                  <div className="text-[10px] text-amber-500 font-bold">★ 5.0 (Nhanh, nhiệt tình)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Modal: View all drivers in Da Nang (Nhiều người hơn) */}
      {showFleetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" /> Đội ngũ Tài xế BeFood Đà Nẵng ({MOCK_DRIVERS.length} thành viên)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chọn tài xế để chuyển đổi phiên làm việc và quản lý cuốc giao hàng theo khu vực
                </p>
              </div>
              <button
                onClick={() => setShowFleetModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {MOCK_DRIVERS.map((driver) => {
                const isCurrent = selectedDriver.id === driver.id;
                return (
                  <div
                    key={driver.id}
                    onClick={() => {
                      setSelectedDriver(driver);
                      setShowFleetModal(false);
                      showToast(`Đã chuyển sang tài xế: ${driver.name}`, 'success');
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                      isCurrent
                        ? 'border-amber-400 bg-amber-50/60 shadow-md ring-2 ring-amber-400/20'
                        : 'border-slate-200 hover:border-amber-300 hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={driver.avatar}
                      alt={driver.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-400 shadow-sm shrink-0"
                    />
                    <div className="flex-1 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900 text-sm">{driver.name}</span>
                        {isCurrent && (
                          <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded-md">
                            Đang chọn
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500">
                        {driver.vehicle} • <strong className="text-amber-600">{driver.plate}</strong>
                      </div>
                      <div className="text-slate-400">{driver.district} • SĐT: {driver.phone}</div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-amber-500 font-bold flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-current" /> {driver.rating}
                        </span>
                        <span className="font-extrabold text-slate-800">
                          {driver.todayEarnings.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowFleetModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Đóng danh sách
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
