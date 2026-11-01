// src/components/customer/VietQRModal.tsx
import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  ArrowRight,
} from 'lucide-react';

interface VietQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  orderCode: string;
  amount: number;
  paymentMethod: 'VIETQR' | 'MOMO' | 'BEPAY';
  restaurantName: string;
}

export const VietQRModal: React.FC<VietQRModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  orderCode,
  amount,
  paymentMethod,
  restaurantName,
}) => {
  const [timeLeft, setTimeLeft] = useState(900); // 15:00 minutes countdown
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || isSuccess) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isSuccess]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const bankName = paymentMethod === 'MOMO' ? 'Ví Điện Tử MoMo' : 'MB Bank (Ngân Hàng Quân Đội)';
  const accountNumber = paymentMethod === 'MOMO' ? '0908123456' : '0908123456';
  const accountHolder = 'CONG TY CO PHAN BE GROUP - BEFOOD';
  const transferContent = `BEFOOD ${orderCode}`;

  // VietQR Dynamic Standard Image URL
  const qrUrl =
    paymentMethod === 'MOMO'
      ? `https://img.vietqr.io/image/MB-0908123456-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
          transferContent
        )}&accountName=${encodeURIComponent(accountHolder)}`
      : `https://img.vietqr.io/image/MB-0908123456-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
          transferContent
        )}&accountName=${encodeURIComponent(accountHolder)}`;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSimulateSuccess = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      setTimeout(() => {
        onPaymentSuccess();
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="px-5 py-4 bg-[#00204A] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#FFC700] text-slate-950 rounded-xl shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider block">
                {paymentMethod === 'MOMO' ? 'Ví Điện Tử MoMo' : 'VietQR Napas 247'}
              </span>
              <h3 className="font-extrabold text-sm text-white">Quét mã thanh toán đơn hàng</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Success Banner */}
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-xl animate-bounce">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h4 className="font-black text-lg text-slate-900">Thanh toán thành công!</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                beFood đã nhận được {amount.toLocaleString('vi-VN')}đ. Đang chuyển tới màn hình theo dõi tài xế giao hàng...
              </p>
            </div>
          ) : (
            <>
              {/* Countdown timer */}
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-2xl">
                <span className="text-amber-900 font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                  Mã QR hết hạn trong:
                </span>
                <span className="font-mono text-xs font-black text-rose-600 bg-white px-2 py-0.5 rounded-lg border border-amber-200">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
              </div>

              {/* Dynamic QR Display */}
              <div className="flex flex-col items-center justify-center p-3.5 bg-slate-50 rounded-3xl border border-slate-200 shadow-inner">
                <div className="relative p-2 bg-white rounded-2xl shadow-md border border-slate-200">
                  <img
                    src={qrUrl}
                    alt="VietQR Code"
                    className="w-48 h-48 object-contain rounded-xl"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="p-1.5 bg-[#FFC700] rounded-xl shadow-lg border-2 border-white">
                      <span className="font-black text-[10px] text-slate-950">beFood</span>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-2.5">
                  <span className="text-[11px] font-extrabold text-slate-800 block">
                    {amount.toLocaleString('vi-VN')}₫
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Mở app Ngân hàng hoặc MoMo quét mã QR trên
                  </span>
                </div>
              </div>

              {/* Bank Details Table */}
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-2 text-[11px]">
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Ngân hàng:</span>
                  <span className="font-bold text-slate-900">{bankName}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Số tài khoản:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-900">{accountNumber}</span>
                    <button
                      onClick={() => copyToClipboard(accountNumber, 'acc')}
                      className="text-amber-600 hover:text-amber-700 p-1 rounded hover:bg-slate-200 cursor-pointer"
                      title="Sao chép số tài khoản"
                    >
                      {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Chủ tài khoản:</span>
                  <span className="font-bold text-slate-900 text-right">{accountHolder}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Số tiền:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-rose-600">{amount.toLocaleString('vi-VN')}đ</span>
                    <button
                      onClick={() => copyToClipboard(amount.toString(), 'amt')}
                      className="text-amber-600 hover:text-amber-700 p-1 rounded hover:bg-slate-200 cursor-pointer"
                      title="Sao chép số tiền"
                    >
                      {copiedField === 'amt' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500">Nội dung CK:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded">
                      {transferContent}
                    </span>
                    <button
                      onClick={() => copyToClipboard(transferContent, 'content')}
                      className="text-amber-600 hover:text-amber-700 p-1 rounded hover:bg-slate-200 cursor-pointer"
                      title="Sao chép nội dung"
                    >
                      {copiedField === 'content' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleSimulateSuccess}
                  disabled={isVerifying}
                  className="w-full py-2.5 px-4 rounded-2xl bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-300/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                      <span>Hệ thống đang xác thực giao dịch...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Xác nhận đã thanh toán (Hoặc Giả lập thành công)</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Giao dịch bảo mật 100% qua Napas &amp; beFood Bảo An
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

