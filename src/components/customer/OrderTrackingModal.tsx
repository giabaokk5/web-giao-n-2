import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { DaNangLiveMap } from './DaNangLiveMap';
import {
  X,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  ShieldCheck,
  Bike,
  CheckCircle2,
  Navigation,
  Star,
  Send,
  Store,
} from 'lucide-react';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ order, onClose }) => {
  const { updateOrderStatus, showToast, restaurants } = useApp();
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'driver'; text: string; time: string }[]>([
    { sender: 'driver', text: 'Chào anh/chị, em đang nhận món ở quán và sẽ giao ngay ạ!', time: '10:43' },
  ]);
  const [inputText, setInputText] = useState('');
  const [driverPositionProgress, setDriverPositionProgress] = useState(65); // percentage along route (0 to 100)

  const matchedRestaurant = restaurants.find((r) => r.id === order?.restaurantId);

  // Simulation: slowly advance driver position towards destination if delivering
  useEffect(() => {
    if (!order || order.orderStatus !== 'DELIVERING') return;
    const interval = setInterval(() => {
      setDriverPositionProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [order]);

  if (!order) return null;

  const steps: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'PENDING', label: 'Đặt đơn', desc: 'Hệ thống đã gửi đơn' },
    { status: 'CONFIRMED', label: 'Quán nhận', desc: 'Quán đã tiếp nhận' },
    { status: 'PREPARING', label: 'Nấu món', desc: 'Bếp đang chuẩn bị' },
    { status: 'DRIVER_ASSIGNED', label: 'Tìm tài xế', desc: 'Tài xế đang đến quán' },
    { status: 'DELIVERING', label: 'Đang giao', desc: 'Tài xế đang tới bạn' },
    { status: 'COMPLETED', label: 'Giao xong', desc: 'Chúc bạn ngon miệng' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.status === order.orderStatus);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newMsg = {
      sender: 'user' as const,
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Driver auto reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'driver',
          text: 'Dạ em ghi nhận rồi ạ, em đang chạy tới toà nhà của anh đây ạ! 🛵',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#00204A] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#FFC700] text-slate-950 rounded-2xl shadow-md">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                  Mã đơn: {order.orderCode}
                </span>
                <span className="text-xs text-slate-300">Không ghép đơn ⚡</span>
              </div>
              <h3 className="font-extrabold text-base text-white mt-0.5">
                Theo dõi hành trình giao hàng trực tuyến
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
          {/* Live Progress Bar Stepper */}
          <div className="relative">
            <div className="flex justify-between items-center relative z-10">
              {steps.map((st, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={st.status} className="flex flex-col items-center text-center w-16">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${
                        isCurrent
                          ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30 scale-110 shadow-md'
                          : isPassed
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] mt-1.5 font-bold line-clamp-1 ${
                        isCurrent ? 'text-amber-600' : isPassed ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Connecting progress track */}
            <div className="absolute top-4 left-6 right-6 h-1 bg-slate-200 -z-0">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-500"
                style={{
                  width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Real Interactive Leaflet Da Nang GPS Live Map */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-amber-500" />
                <span>Bản đồ lộ trình OpenStreetMap Đà Nẵng trực tiếp</span>
              </span>
              <div className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-600 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                <span>Dự kiến: {order.estimatedDeliveryTime}</span>
              </div>
            </div>

            <DaNangLiveMap
              restaurantLat={matchedRestaurant?.lat || 16.062}
              restaurantLng={matchedRestaurant?.lng || 108.2045}
              restaurantName={order.restaurantName}
              customerLat={order.deliveryAddress.lat || 16.0682}
              customerLng={order.deliveryAddress.lng || 108.2145}
              customerAddressTitle={order.deliveryAddress.title}
              driverName={order.driver?.name || 'Nguyễn Văn Be'}
              driverLicensePlate={order.driver?.licensePlate || '43-D1 888.68'}
              progressPercent={driverPositionProgress}
              isDelivering={order.orderStatus === 'DELIVERING'}
            />
          </div>

          {/* Driver Profile Card */}
          {order.driver && (
            <div className="p-4 bg-gradient-to-r from-amber-50/70 to-yellow-50/70 rounded-3xl border border-amber-200 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="relative">
                  <img
                    src={order.driver.avatar}
                    alt={order.driver.name}
                    className="w-13 h-13 rounded-2xl object-cover ring-2 ring-amber-400 shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 font-black text-[9px] px-1 py-0.2 rounded-md">
                    be
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-sm text-slate-900">
                      {order.driver.name}
                    </span>
                    <span className="flex items-center text-amber-600 font-bold text-xs bg-amber-100 px-1.5 py-0.2 rounded-md">
                      <Star className="w-3 h-3 fill-current mr-0.5" />
                      {order.driver.rating}
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px] font-medium mt-0.5">
                    {order.driver.vehicleType} • <span className="font-black text-slate-900">{order.driver.licensePlate}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Đã hoàn thành {order.driver.completedTrips.toLocaleString()} chuyến giao
                  </div>
                </div>
              </div>

              {/* Action Buttons: Call & Chat */}
              <div className="flex items-center space-x-2 shrink-0">
                <a
                  href={`tel:${order.driver.phone}`}
                  onClick={(e) => {
                    e.preventDefault();
                    showToast(`Đang kết nối cuộc gọi tới tài xế ${order.driver?.phone}...`, 'info');
                  }}
                  className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-md transition-all cursor-pointer flex items-center space-x-1"
                  title="Gọi tài xế"
                >
                  <Phone className="w-4 h-4" />
                </a>

                <button
                  onClick={() => setChatOpen(!chatOpen)}
                  className="p-3 bg-[#00204A] hover:bg-[#002e6b] text-white rounded-2xl shadow-md transition-all cursor-pointer flex items-center space-x-1"
                  title="Nhắn tin với tài xế"
                >
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
          )}

          {/* In-app Chat Box with Driver */}
          {chatOpen && (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                  Chat trực tiếp với tài xế ({order.driver?.name})
                </span>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <div className="max-h-40 overflow-y-auto space-y-2 p-1">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`p-2.5 rounded-2xl max-w-[80%] text-xs ${
                        m.sender === 'user'
                          ? 'bg-[#00204A] text-white rounded-br-none'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5 px-1">{m.time}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Gửi tin nhắn cho bác tài..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 text-xs p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-amber-400 text-slate-950 font-bold rounded-xl hover:bg-amber-500 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Order Items Recap */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <span className="font-bold text-slate-900 block mb-1">Chi tiết món đã đặt</span>
            {order.items.map((it) => (
              <div key={it.cartItemId} className="flex justify-between items-center text-slate-700">
                <span>
                  <strong className="text-slate-900">{it.quantity}x</strong> {it.food.name}
                  {it.options.size && ` (${it.options.size.name})`}
                </span>
                <span className="font-semibold">{it.totalPrice.toLocaleString('vi-VN')}đ</span>
              </div>
            ))}
            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
              <span>Tổng tiền thanh toán ({order.paymentMethod}):</span>
              <span className="text-rose-600 text-sm">{order.totalAmount.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>
        </div>

        {/* Footer simulation action for testing workflow */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 hidden sm:inline">Phím tắt mô phỏng quy trình:</span>
          <div className="flex space-x-2 w-full sm:w-auto">
            {order.orderStatus === 'DELIVERING' && (
              <button
                onClick={() => {
                  updateOrderStatus(order.id, 'COMPLETED', 'Đã giao thành công cho khách hàng');
                }}
                className="flex-1 sm:flex-none py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Xác nhận đã nhận được món 🎉
              </button>
            )}
            {order.orderStatus === 'COMPLETED' && (
              <button
                onClick={() => {
                  showToast('Cảm ơn bạn đã gửi đánh giá 5 sao cho beFood và quán!', 'success');
                  onClose();
                }}
                className="flex-1 sm:flex-none py-2 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Star className="w-4 h-4 fill-current" />
                <span>Đánh giá 5 sao</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

