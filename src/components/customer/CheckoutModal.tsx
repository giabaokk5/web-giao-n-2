// src\components\customer\CheckoutModal.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { VietQRModal } from './VietQRModal';
import {
  X,
  CreditCard,
  Wallet,
  DollarSign,
  QrCode,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  Check,
  Calendar,
  Gift,
  AlertTriangle,
  Building,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    cartRestaurant,
    currentAddress,
    cartTotal,
    cartSubtotal,
    deliveryFee,
    discountAmount,
    appliedVoucher,
    createOrder,
    setIsCartOpen,
    currentUser,
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('BEPAY');
  const [driverTip, setDriverTip] = useState<number>(5000);
  const [customerNote, setCustomerNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Advanced features
  const [deliveryScheduleType, setDeliveryScheduleType] = useState<'NOW' | 'PRE_ORDER' | 'RECURRING'>('NOW');
  const [scheduledTime, setScheduledTime] = useState('11:45 Hôm nay');
  const [recurringPattern, setRecurringPattern] = useState('Thứ 2 đến Thứ 6 (Giờ ăn trưa)');
  const [isOrderingForOther, setIsOrderingForOther] = useState(false);
  const [recipientName, setRecipientName] = useState('Bác An');
  const [recipientPhone, setRecipientPhone] = useState('0913 999 888');

  // VietQR / MoMo Modal State
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [tempOrderCode, setTempOrderCode] = useState('');

  if (!isOpen || !cartRestaurant) return null;

  const tipOptions = [0, 5000, 10000, 20000];
  const finalTotal = cartTotal + driverTip;

  // Check for allergy collision
  const allergenWarnings: string[] = [];
  cart.forEach((it) => {
    if (it.food.allergens) {
      it.food.allergens.forEach((alg) => {
        if (currentUser.allergies.includes(alg)) {
          allergenWarnings.push(`Món "${it.food.name}" có chứa "${alg}" (bạn đã lưu dị ứng trong hồ sơ)`);
        }
      });
    }
  });

  const executeOrderCreation = (method: Order['paymentMethod']) => {
    let finalNote = customerNote;
    if (isOrderingForOther) {
      finalNote = `[ĐẶT HỘ: ${recipientName} - SĐT: ${recipientPhone}] ${finalNote}`;
    }
    if (deliveryScheduleType === 'PRE_ORDER') {
      finalNote = `[GIAO LÚC ${scheduledTime}] ${finalNote}`;
    } else if (deliveryScheduleType === 'RECURRING') {
      finalNote = `[ĐẶT ĐỊNH KỲ: ${recurringPattern}] ${finalNote}`;
    }

    createOrder(method, driverTip, finalNote);
    setIsSubmitting(false);
    setIsQRModalOpen(false);
    onClose();
    setIsCartOpen(false);
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'VIETQR' || paymentMethod === 'MOMO') {
      const code = 'BE-' + Math.floor(100000 + Math.random() * 900000);
      setTempOrderCode(code);
      setIsQRModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      executeOrderCreation(paymentMethod);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="px-6 py-4 bg-[#00204A] text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> beFood Smart Checkout
            </span>
            <h3 className="font-extrabold text-lg text-white">Xác nhận thanh toán & Giao hàng</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Allergy Warning Box */}
          {allergenWarnings.length > 0 && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 space-y-1 animate-in fade-in">
              <div className="flex items-center space-x-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>CẢNH BÁO DỊ ỨNG THỰC PHẨM:</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-rose-700">
                {allergenWarnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Delivery Schedule Options (Giao ngay / Đặt trước / Định kỳ) */}
          <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2">
            <span className="font-bold text-slate-900 block">Thời gian nhận món:</span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setDeliveryScheduleType('NOW')}
                className={`py-2 px-1 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                  deliveryScheduleType === 'NOW'
                    ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                Giao ngay (20p)
              </button>
              <button
                type="button"
                onClick={() => setDeliveryScheduleType('PRE_ORDER')}
                className={`py-2 px-1 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                  deliveryScheduleType === 'PRE_ORDER'
                    ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                Đặt trước theo giờ
              </button>
              <button
                type="button"
                onClick={() => setDeliveryScheduleType('RECURRING')}
                className={`py-2 px-1 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                  deliveryScheduleType === 'RECURRING'
                    ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                Định kỳ hàng tuần
              </button>
            </div>

            {deliveryScheduleType === 'PRE_ORDER' && (
              <div className="pt-1 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <input
                  type="text"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  placeholder="Khung giờ muốn giao (VD: 11:45 Hôm nay)"
                  className="flex-1 text-xs p-2 bg-white border border-amber-300 rounded-xl outline-none"
                />
              </div>
            )}

            {deliveryScheduleType === 'RECURRING' && (
              <div className="pt-1 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                <input
                  type="text"
                  value={recurringPattern}
                  onChange={(e) => setRecurringPattern(e.target.value)}
                  placeholder="Lịch lặp lại (VD: Thứ 2 đến Thứ 6)"
                  className="flex-1 text-xs p-2 bg-white border border-amber-300 rounded-xl outline-none"
                />
              </div>
            )}
          </div>

          {/* Order For Someone Else (Đặt hộ người thân) */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-rose-500" />
                Đặt món tặng / Đặt hộ người thân
              </span>
              <input
                type="checkbox"
                checked={isOrderingForOther}
                onChange={(e) => setIsOrderingForOther(e.target.checked)}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </div>

            {isOrderingForOther && (
              <div className="grid grid-cols-2 gap-2 pt-1 animate-in fade-in">
                <input
                  type="text"
                  placeholder="Tên người nhận (VD: Mẹ, Bạn Nam)"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="p-2 bg-white border border-slate-200 rounded-xl outline-none text-xs"
                />
                <input
                  type="tel"
                  placeholder="SĐT người nhận"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="p-2 bg-white border border-slate-200 rounded-xl outline-none text-xs"
                />
              </div>
            )}
          </div>

          {/* Delivery Address */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center space-x-2 text-slate-500 font-bold mb-1">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Giao đến địa chỉ:</span>
            </div>
            <div className="font-bold text-slate-900 text-sm">{currentAddress.title}</div>
            <p className="text-slate-600 mt-0.5">{currentAddress.detail}</p>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">
              Phương thức thanh toán <span className="text-rose-500">*</span>
            </h4>
            <div className="space-y-1.5">
              <label
                onClick={() => setPaymentMethod('VIETQR')}
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'VIETQR'
                    ? 'border-blue-500 bg-blue-50/60 font-bold text-slate-900 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-blue-600 text-white font-black">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">Quét mã VietQR Napas 247</span>
                      <span className="text-[9px] bg-blue-600 text-white font-black px-1.5 py-0.2 rounded">Tất cả ngân hàng</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">MB Bank, VCB, Techcombank, VPBank, TPBank...</span>
                  </div>
                </div>
                {paymentMethod === 'VIETQR' && <Check className="w-4 h-4 text-blue-600" />}
              </label>

              <label
                onClick={() => setPaymentMethod('MOMO')}
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'MOMO'
                    ? 'border-pink-500 bg-pink-50/60 font-bold text-slate-900 ring-2 ring-pink-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-pink-600 text-white font-black">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Ví MoMo QR</span>
                    <span className="text-[11px] text-slate-500 block">Quét mã qua ứng dụng MoMo</span>
                  </div>
                </div>
                {paymentMethod === 'MOMO' && <Check className="w-4 h-4 text-pink-600" />}
              </label>

              <label
                onClick={() => setPaymentMethod('BEPAY')}
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'BEPAY'
                    ? 'border-amber-400 bg-amber-50/60 font-bold text-slate-900 ring-2 ring-amber-400/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Ví điện tử bePay</span>
                    <span className="text-[11px] text-slate-500 block">Số dư ví: 350.000đ</span>
                  </div>
                </div>
                {paymentMethod === 'BEPAY' && <Check className="w-4 h-4 text-amber-600" />}
              </label>

              <label
                onClick={() => setPaymentMethod('COD')}
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-amber-400 bg-amber-50/60 font-bold text-slate-900 ring-2 ring-amber-400/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white font-black">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Tiền mặt khi nhận hàng (COD)</span>
                    <span className="text-[11px] text-slate-500 block">Thanh toán trực tiếp cho tài xế Be</span>
                  </div>
                </div>
                {paymentMethod === 'COD' && <Check className="w-4 h-4 text-emerald-600" />}
              </label>
            </div>
          </div>

          {/* Driver Tip */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-900 uppercase tracking-wider">
                Tiền boa cho tài xế Be 🛵
              </span>
              <span className="text-[11px] text-amber-600 font-semibold">Tài xế nhận 100%</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {tipOptions.map((tip) => (
                <button
                  key={tip}
                  type="button"
                  onClick={() => setDriverTip(tip)}
                  className={`py-2 px-1 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                    driverTip === tip
                      ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {tip === 0 ? 'Không boa' : `+${(tip / 1000).toFixed(0)}k`}
                </button>
              ))}
            </div>
          </div>

          {/* Order Note */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-1.5">
              Ghi chú cho tài xế & quán
            </h4>
            <input
              type="text"
              placeholder="Ví dụ: Giao tới gọi trước 5 phút, để trước cửa..."
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Pricing Breakdown */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Tạm tính món:</span>
              <span className="font-bold text-slate-800">{cartSubtotal.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Phí giao hàng:</span>
              <span className="font-bold text-slate-800">
                {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">Freeship 0đ</span> : `${deliveryFee.toLocaleString('vi-VN')}đ`}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-rose-600 font-semibold">
                <span>Ưu đãi voucher ({appliedVoucher?.code}):</span>
                <span>-{discountAmount.toLocaleString('vi-VN')}đ</span>
              </div>
            )}
            {driverTip > 0 && (
              <div className="flex justify-between text-amber-700">
                <span>Tiền boa tài xế:</span>
                <span>+{driverTip.toLocaleString('vi-VN')}đ</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
              <span className="font-black text-slate-900">Tổng thanh toán:</span>
              <span className="font-black text-rose-600 text-base">
                {finalTotal.toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-slate-400">Tổng thanh toán:</span>
            <div className="text-lg font-black text-rose-600">
              {finalTotal.toLocaleString('vi-VN')}đ
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="flex-1 py-3 px-6 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-400/30 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Đang kết nối nhà hàng...</span>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>
                  {paymentMethod === 'VIETQR' || paymentMethod === 'MOMO'
                    ? 'TIẾP TỤC QUÉT MÃ QR'
                    : 'XÁC NHẬN ĐẶT ĐƠN'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* VietQR / MoMo Real Scan Modal */}
      <VietQRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        onPaymentSuccess={() => executeOrderCreation(paymentMethod)}
        orderCode={tempOrderCode}
        amount={finalTotal}
        paymentMethod={paymentMethod as 'VIETQR' | 'MOMO'}
        restaurantName={cartRestaurant.name}
      />
    </div>
  );
};
