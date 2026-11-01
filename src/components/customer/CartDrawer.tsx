// src\components\customer\CartDrawer.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckoutModal } from './CheckoutModal';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Tag,
  MapPin,
  ShoppingBag,
  ArrowRight,
  Ticket,
  Check,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartRestaurant,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    deliveryFee,
    discountAmount,
    cartTotal,
    appliedVoucher,
    applyVoucher,
    availableVouchers,
    currentAddress,
    setIsAddressModalOpen,
  } = useApp();

  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCustomVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const found = availableVouchers.find(
      (v) => v.code.toUpperCase() === voucherCodeInput.trim().toUpperCase()
    );
    if (found) {
      applyVoucher(found);
      setVoucherCodeInput('');
    } else {
      alert('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in">
        {/* Backdrop */}
        <div
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-100 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-[#FFC700] rounded-xl text-slate-900 shadow-xs">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Giỏ hàng beFood</h3>
                  <p className="text-xs text-slate-500">
                    {cartRestaurant ? cartRestaurant.name : 'Chưa có món ăn'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-slate-500 hover:text-rose-600 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-100"
                    title="Xóa toàn bộ giỏ"
                  >
                    Xóa tất cả
                  </button>
                )}
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Empty State */}
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-4 text-amber-400">
                  <ShoppingBag className="w-12 h-12" />
                </div>
                <h4 className="font-bold text-slate-800 text-base mb-1">Giỏ hàng của bạn đang trống</h4>
                <p className="text-xs text-slate-400 max-w-xs mb-6">
                  Hãy khám phá hàng ngàn món ăn ngon lành và trà sữa thơm lừng từ beFood nhé!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer"
                >
                  Khám phá món ngon ngay
                </button>
              </div>
            ) : (
              <>
                {/* Scrollable Items List */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
                  {/* Address Summary */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 max-w-[260px]">
                      <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                      <div className="truncate">
                        <div className="font-bold text-slate-800">{currentAddress.title}</div>
                        <div className="text-[11px] text-slate-500 truncate">{currentAddress.detail}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsAddressModalOpen(true)}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
                    >
                      Đổi
                    </button>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start space-x-2.5">
                            <img
                              src={item.food.image}
                              alt={item.food.name}
                              className="w-12 h-12 rounded-xl object-cover shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900 text-xs">{item.food.name}</div>
                              {item.options.size && (
                                <div className="text-[11px] text-slate-500">
                                  Kích cỡ: <span className="font-medium">{item.options.size.name}</span>
                                </div>
                              )}
                              {item.options.toppings.length > 0 && (
                                <div className="text-[11px] text-slate-500">
                                  Topping: {item.options.toppings.map((t) => t.name).join(', ')}
                                </div>
                              )}
                              {item.options.sugarLevel && (
                                <div className="text-[11px] text-slate-400">
                                  {item.options.sugarLevel} • {item.options.iceLevel}
                                </div>
                              )}
                              {item.options.note && (
                                <div className="text-[11px] text-amber-700 italic mt-0.5">
                                  Ghi chú: "{item.options.note}"
                                </div>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-slate-300 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Quantity and Line Total */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
                            <button
                              onClick={() => updateCartItemQuantity(item.cartItemId, -1)}
                              className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center font-bold text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartItemQuantity(item.cartItemId, 1)}
                              className="w-6 h-6 rounded-lg bg-[#FFC700] flex items-center justify-center text-slate-950 font-bold hover:bg-amber-400 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="font-black text-slate-900 text-sm">
                            {item.totalPrice.toLocaleString('vi-VN')}đ
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Voucher Section */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                        <Ticket className="w-4 h-4 text-amber-500" />
                        Mã giảm giá beFood
                      </span>
                      {appliedVoucher && (
                        <button
                          onClick={() => applyVoucher(null)}
                          className="text-[11px] text-rose-500 hover:underline cursor-pointer"
                        >
                          Gỡ mã
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleApplyCustomVoucher} className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Nhập mã ưu đãi (VD: BEWELCOME)"
                        value={voucherCodeInput}
                        onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                        className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none uppercase font-bold text-slate-800"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Áp dụng
                      </button>
                    </form>

                    {/* Quick Voucher Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {availableVouchers.map((v) => {
                        const isApplied = appliedVoucher?.code === v.code;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => applyVoucher(isApplied ? null : v)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all flex items-center space-x-1 cursor-pointer ${
                              isApplied
                                ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs'
                                : 'bg-amber-50/60 hover:bg-amber-100 text-amber-900 border-amber-200'
                            }`}
                          >
                            <span>{v.code}</span>
                            {isApplied && <Check className="w-3 h-3 text-slate-950" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 mt-4">
                    <div className="flex justify-between text-slate-600">
                      <span>Tạm tính ({cart.reduce((s, it) => s + it.quantity, 0)} món):</span>
                      <span className="font-bold text-slate-800">
                        {cartSubtotal.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Phí giao hàng:</span>
                      <span className="font-bold text-slate-800">
                        {deliveryFee === 0 ? (
                          <span className="text-emerald-600 font-extrabold">Freeship 0đ</span>
                        ) : (
                          `${deliveryFee.toLocaleString('vi-VN')}đ`
                        )}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-rose-600 font-semibold">
                        <span>Giảm giá voucher:</span>
                        <span>-{discountAmount.toLocaleString('vi-VN')}đ</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
                      <span className="font-black text-slate-900">Tổng cộng:</span>
                      <span className="font-black text-lg text-rose-600">
                        {cartTotal.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Checkout CTA */}
                <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-slate-400">Tổng thanh toán</span>
                    <div className="text-lg font-black text-rose-600 leading-none">
                      {cartTotal.toLocaleString('vi-VN')}đ
                    </div>
                  </div>

                  <button
                    onClick={() => setIsCheckoutModalOpen(true)}
                    className="flex-1 py-3 px-6 bg-[#00204A] hover:bg-[#002b66] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <span>Giao hàng ngay</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
    </>
  );
};

