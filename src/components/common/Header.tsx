import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GroupOrderModal } from '../customer/GroupOrderModal';
import { PriceCompareModal } from '../customer/PriceCompareModal';
import { VoiceImageSearchModal } from '../customer/VoiceImageSearchModal';
import {
  MapPin,
  Search,
  ShoppingBag,
  Bot,
  Clock,
  ChevronDown,
  Sparkles,
  Users,
  Scale,
  Mic,
  Camera,
  LogIn,
  LogOut,
  User as UserIcon,
  CreditCard,
  Gift,
  ShieldCheck,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentAddress,
    setIsAddressModalOpen,
    cart,
    cartTotal,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    setIsAuthModalOpen,
    openAuthModal,
    openAdminAuthModal,
    currentUser,
    isAuthenticated,
    logout,
    setIsChatbotOpen,
    orders,
    setActiveOrder,
    setSelectedCategory,
  } = useApp();

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isPriceCompareOpen, setIsPriceCompareOpen] = useState(false);
  const [isVoiceImageModalOpen, setIsVoiceImageModalOpen] = useState(false);
  const [voiceImageMode, setVoiceImageMode] = useState<'voice' | 'image'>('voice');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setTimeout(() => {
      const el = document.getElementById('restaurant-listing');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const activeDeliveryOrder = orders.find(
    (o) => o.orderStatus !== 'COMPLETED' && o.orderStatus !== 'CANCELLED'
  );

  return (
    <>
      <header className="sticky top-[38px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 gap-2 sm:gap-4">
            {/* Logo Gia Bảo Food */}
            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('cat-all');
                }}
                className="flex items-center space-x-1.5 group cursor-pointer"
                title="Về trang chủ Gia Bảo Food Đà Nẵng"
              >
                <div className="bg-gradient-to-r from-[#FFC700] via-amber-400 to-[#FFB700] text-[#00204A] font-black text-xl sm:text-2xl tracking-tighter px-3 py-1.5 rounded-2xl shadow-md group-hover:scale-105 transition-all flex items-center gap-1.5 border border-amber-300">
                  <span className="bg-[#00204A] text-[#FFC700] text-[10px] font-black px-1.5 py-0.5 rounded-lg tracking-wider shadow-inner">
                    GB
                  </span>
                  <span>Gia Bảo</span>
                  <span className="text-[#00204A] font-extrabold ml-0.5">Food</span>
                </div>
              </button>

              {/* Address Selector */}
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="hidden md:flex items-center space-x-1.5 text-left bg-slate-100/90 hover:bg-amber-50 hover:border-amber-300 border border-transparent rounded-full px-3 py-1.5 transition-all cursor-pointer text-xs"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <div className="max-w-[170px] truncate">
                  <span className="text-slate-400 font-normal">Giao đến: </span>
                  <span className="font-semibold text-slate-800">{currentAddress.title}</span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            {/* Search Bar with Voice & Image triggers */}
            <div className="flex-1 max-w-lg relative">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm Mì Quảng, bánh tráng cuốn, bún chả cá, hải sản, trà sữa..."
                  className="w-full bg-slate-100/90 border border-slate-200 text-slate-800 rounded-full pl-9 pr-18 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 focus:bg-white transition-all shadow-inner"
                />
                <button
                  type="submit"
                  className="p-1 rounded-full text-slate-400 hover:text-amber-600 absolute left-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                  title="Tìm kiếm"
                >
                  <Search className="w-4 h-4 text-slate-400 hover:text-amber-600 transition-colors" />
                </button>

                {/* Voice & Camera buttons inside search bar */}
                <div className="absolute right-2.5 flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceImageMode('voice');
                      setIsVoiceImageModalOpen(true);
                    }}
                    className="p-1 rounded-full text-slate-400 hover:text-amber-600 hover:bg-slate-200 cursor-pointer"
                    title="Tìm bằng giọng nói"
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceImageMode('image');
                      setIsVoiceImageModalOpen(true);
                    }}
                    className="p-1 rounded-full text-slate-400 hover:text-amber-600 hover:bg-slate-200 cursor-pointer"
                    title="Nhận diện món qua ảnh AI"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Smart Customer Action Utilities */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              {/* Group Order Button */}
              <button
                onClick={() => setIsGroupModalOpen(true)}
                className="hidden xl:flex items-center space-x-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer"
                title="Đặt món theo nhóm & chia tiền"
              >
                <Users className="w-3.5 h-3.5 text-amber-600" />
                <span>Đặt nhóm</span>
              </button>

              {/* Price Compare Button */}
              <button
                onClick={() => setIsPriceCompareOpen(true)}
                className="hidden xl:flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer"
                title="So sánh giá món ăn giữa các quán"
              >
                <Scale className="w-3.5 h-3.5 text-slate-600" />
                <span>So giá</span>
              </button>

              {/* Active order badge */}
              {activeDeliveryOrder && (
                <button
                  onClick={() => setActiveOrder(activeDeliveryOrder)}
                  className="hidden lg:flex items-center space-x-1.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-full px-2.5 py-1.5 text-xs font-semibold hover:bg-amber-100 transition-colors animate-pulse-slow shadow-xs cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                  <span>1 Đơn đang giao</span>
                </button>
              )}

              {/* AI Assistant Chatbot Button */}
              <button
                onClick={() => setIsChatbotOpen(true)}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold px-3 py-1.5 rounded-full text-xs hover:shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-amber-300/40"
                title="Trợ lý Gemini AI"
              >
                <Bot className="w-4 h-4 text-slate-900" />
                <span className="hidden sm:inline">AI Gia Bảo</span>
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center space-x-2 bg-[#00204A] hover:bg-[#002b66] text-white px-3 py-1.5 rounded-full font-medium text-xs shadow-md transition-all cursor-pointer"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  {totalCartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                      {totalCartCount}
                    </span>
                  )}
                </div>
                <span className="hidden md:inline font-bold">
                  {cartTotal > 0 ? `${cartTotal.toLocaleString('vi-VN')}đ` : 'Giỏ hàng'}
                </span>
              </button>

              {/* User Authentication: Separate Login / Register & User Dropdown */}
              {!isAuthenticated ? (
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-all cursor-pointer"
                  >
                    Đăng ký
                  </button>
                  <button
                    onClick={() => openAuthModal('signin')}
                    className="inline-flex items-center space-x-1 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-300/30 transition-all active:scale-95 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Đăng nhập</span>
                  </button>
                  <button
                    onClick={() => openAdminAuthModal('signin')}
                    className="hidden md:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-full bg-[#001736] hover:bg-[#00204A] text-amber-300 font-bold text-xs border border-amber-400/30 transition-all cursor-pointer shadow-xs"
                    title="Cổng Quản Trị Hệ Thống Nội Bộ"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Cổng Admin</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <div className="relative">
                    {/* Trigger button for logged-in user */}
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full border border-slate-200 hover:border-amber-400 bg-white hover:bg-slate-50 transition-all cursor-pointer text-xs shadow-xs"
                      title="Menu tài khoản"
                    >
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-amber-400"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="hidden lg:flex flex-col text-left">
                        <span className="font-bold text-slate-800 text-xs max-w-[85px] truncate leading-tight">
                          {currentUser.name}
                        </span>
                        <span className="text-[9px] text-amber-600 font-bold uppercase tracking-wider">
                          {currentUser.loyaltyTier}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                          isUserMenuOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                  {/* Dropdown Menu for Logged In User */}
                  {isUserMenuOpen && (
                    <>
                      {/* Backdrop for clicking outside */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUserMenuOpen(false)}
                      ></div>

                      <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95">
                        {/* Header Profile Summary */}
                        <div className="p-4 bg-gradient-to-br from-[#00204A] to-[#082855] text-white">
                          <div className="flex items-center space-x-3">
                            <img
                              src={currentUser.avatar}
                              alt={currentUser.name}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#FFC700]"
                            />
                            <div className="truncate flex-1">
                              <div className="font-bold text-sm truncate">{currentUser.name}</div>
                              <div className="text-[11px] text-slate-300 truncate">{currentUser.email}</div>
                              <span className="inline-block bg-[#FFC700] text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full mt-1 uppercase">
                                {currentUser.loyaltyTier} MEMBER
                              </span>
                            </div>
                          </div>

                          {/* Quick Wallet & Points */}
                          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10 text-xs">
                            <div className="bg-white/10 p-2 rounded-xl">
                              <div className="text-[10px] text-slate-300 flex items-center gap-1">
                                <CreditCard className="w-3 h-3 text-amber-300" /> Ví bePay
                              </div>
                              <div className="font-black text-amber-300 text-xs mt-0.5">
                                {currentUser.walletBalance.toLocaleString('vi-VN')}đ
                              </div>
                            </div>
                            <div className="bg-white/10 p-2 rounded-xl">
                              <div className="text-[10px] text-slate-300 flex items-center gap-1">
                                <Gift className="w-3 h-3 text-yellow-300" /> Điểm Be
                              </div>
                              <div className="font-black text-yellow-300 text-xs mt-0.5">
                                {currentUser.loyaltyPoints} pts
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2 space-y-1 text-xs">
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              openAuthModal('profile');
                            }}
                            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold transition-colors cursor-pointer text-left"
                          >
                            <UserIcon className="w-4 h-4 text-slate-500" />
                            <span>Hồ sơ & Cài đặt tài khoản</span>
                          </button>

                          {activeDeliveryOrder && (
                            <button
                              onClick={() => {
                                setIsUserMenuOpen(false);
                                setActiveOrder(activeDeliveryOrder);
                              }}
                              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-amber-900 bg-amber-50 hover:bg-amber-100 font-bold transition-colors cursor-pointer text-left"
                            >
                              <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                              <span>Theo dõi 1 đơn đang giao</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              openAuthModal('profile');
                            }}
                            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold transition-colors cursor-pointer text-left"
                          >
                            <Gift className="w-4 h-4 text-slate-500" />
                            <span>Đổi voucher & Quà tặng</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              openAuthModal('signin');
                            }}
                            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold transition-colors cursor-pointer text-left"
                          >
                            <LogIn className="w-4 h-4 text-slate-500" />
                            <span>Đăng nhập tài khoản khác</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              openAdminAuthModal('signin');
                            }}
                            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-amber-900 bg-amber-50/70 hover:bg-amber-100 font-bold transition-colors cursor-pointer text-left border border-amber-200/80"
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-600" />
                            <div className="flex-1 truncate">
                              <div className="text-xs">Cổng Quản Trị Super Admin</div>
                              <div className="text-[10px] text-amber-700 font-normal">Đăng nhập tài khoản điều hành sàn</div>
                            </div>
                          </button>
                        </div>

                        {/* Logout Section - PROMINENT 1-CLICK RED BUTTON */}
                        <div className="p-2.5 bg-rose-50/50 border-t border-rose-100">
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold transition-all active:scale-98 cursor-pointer text-xs shadow-md shadow-rose-600/20"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>ĐĂNG XUẤT TÀI KHOẢN</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <GroupOrderModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />
      <PriceCompareModal
        isOpen={isPriceCompareOpen}
        onClose={() => setIsPriceCompareOpen(false)}
      />
      <VoiceImageSearchModal
        isOpen={isVoiceImageModalOpen}
        onClose={() => setIsVoiceImageModalOpen(false)}
        initialMode={voiceImageMode}
      />
    </>
  );
};
