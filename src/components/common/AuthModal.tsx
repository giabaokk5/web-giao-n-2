// src/components/common/AuthModal.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import {
  User,
  Phone,
  Mail,
  Lock,
  Wallet,
  Shield,
  Award,
  LogOut,
  X,
  CheckCircle2,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Sparkles,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Gift,
  Zap,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalView,
    setAuthModalView,
    openAdminAuthModal,
    currentUser,
    isAuthenticated,
    login,
    register,
    logout,
    loginWithGoogle,
    setCurrentRole,
    showToast,
  } = useApp();

  const [authView, setAuthView] = useState<'signin' | 'signup' | 'profile'>(
    authModalView || (isAuthenticated ? 'profile' : 'signin')
  );

  React.useEffect(() => {
    if (isAuthModalOpen) {
      setAuthView(authModalView);
    }
  }, [isAuthModalOpen, authModalView]);

  // Form states
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign up states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Top-up modal simulated state
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('100000');

  // Active sub-tab in Profile view
  const [profileTab, setProfileTab] = useState<'info' | 'loyalty' | 'security'>('info');

  if (!isAuthModalOpen) return null;

  // Handle Sign In submit
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      showToast('Vui lòng nhập email hoặc số điện thoại', 'warning');
      return;
    }
    if (!password) {
      showToast('Vui lòng nhập mật khẩu', 'warning');
      return;
    }
    const success = login(emailOrPhone, password, 'customer');
    if (success) {
      setIsAuthModalOpen(false);
    }
  };

  // Handle Quick Customer Demo Login
  const handleQuickCustomerLogin = () => {
    login('minhquang@befood.vn', '123456', 'customer');
    setCurrentRole('customer');
    showToast('Đã đăng nhập tài khoản Khách hàng VIP!', 'success');
    setIsAuthModalOpen(false);
  };

  // Handle Sign Up submit
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      showToast('Vui lòng nhập họ và tên', 'warning');
      return;
    }
    if (!regPhone.trim()) {
      showToast('Vui lòng nhập số điện thoại', 'warning');
      return;
    }
    if (!regEmail.trim()) {
      showToast('Vui lòng nhập email', 'warning');
      return;
    }
    if (regPassword.length < 6) {
      showToast('Mật khẩu tối thiểu 6 ký tự', 'warning');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      showToast('Mật khẩu xác nhận không trùng khớp', 'error');
      return;
    }

    const success = register(regName, regEmail, regPhone, regPassword, 'customer');
    if (success) {
      setCurrentRole('customer');
      setIsAuthModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 flex flex-col max-h-[92vh] relative">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-br from-[#00204A] via-[#092B5A] to-[#001736] text-white p-6 relative shrink-0">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Welcome Perks Pill */}
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-[#FFC700] text-[#00204A] font-black text-[10px] px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-current" />
              beID
            </span>
            <span className="text-[11px] text-amber-200 font-semibold tracking-wide">
              Tài khoản beFood TP. Đà Nẵng
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {authView === 'signin' && 'Đăng nhập vào beFood'}
            {authView === 'signup' && 'Đăng ký tài khoản beFood'}
            {authView === 'profile' && 'Tài khoản & Hội viên beFood'}
          </h2>

          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {authView === 'signin' && 'Thưởng thức vạn món ngon Đà Nẵng, tích điểm bePoint & nhận ưu đãi tới 50%'}
            {authView === 'signup' && 'Tạo tài khoản để nhận gói ưu đãi Voucher 50.000đ và Freeship 0Đ'}
            {authView === 'profile' && `Xin chào, ${currentUser.name}! Chúc bạn ngày mới ngon miệng.`}
          </p>

          {/* Clean Segmented Tab Switcher */}
          <div className="flex items-center space-x-2 mt-4 bg-black/30 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => {
                setAuthView('signin');
                setAuthModalView('signin');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authView === 'signin'
                  ? 'bg-[#FFC700] text-[#00204A] font-black shadow-md'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </button>

            <button
              onClick={() => {
                setAuthView('signup');
                setAuthModalView('signup');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authView === 'signup'
                  ? 'bg-[#FFC700] text-[#00204A] font-black shadow-md'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Đăng ký</span>
            </button>

            {isAuthenticated && (
              <button
                onClick={() => {
                  setAuthView('profile');
                  setAuthModalView('profile');
                }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authView === 'profile'
                    ? 'bg-[#FFC700] text-[#00204A] font-black shadow-md'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Hồ sơ</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* 1. SIGN IN VIEW */}
          {authView === 'signin' && (
            <div className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email hoặc Số điện thoại
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="minhquang@befood.vn hoặc 0908 123 456"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Mật khẩu</label>
                    <button
                      type="button"
                      onClick={() => showToast('Mã OTP khôi phục mật khẩu đã được gửi thử nghiệm', 'info')}
                      className="text-[11px] text-amber-600 hover:underline cursor-pointer font-semibold"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Nhập mật khẩu..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-10 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Đăng Nhập Ngay</span>
                </button>
              </form>

              {/* Google One Tap */}
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-[11px]">
                  <span className="bg-white px-2 text-slate-400 font-medium">Hoặc tiếp tục với</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  loginWithGoogle();
                  setIsAuthModalOpen(false);
                }}
                className="w-full py-2 px-3 border border-slate-200 hover:border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Đăng nhập qua Google One Tap</span>
              </button>

              {/* Fast 1-Click Customer Test Button */}
              <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-200/80">
                <button
                  type="button"
                  onClick={handleQuickCustomerLogin}
                  className="w-full py-1.5 bg-white hover:bg-amber-100 border border-amber-300 rounded-xl text-left px-3 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-base">🛍️</span>
                    <div>
                      <div className="font-bold text-xs text-amber-950">
                        Đăng nhập thử: Khách Hàng VIP
                      </div>
                      <div className="text-[10px] text-amber-700">Trần Minh Quang • 0908 123 456</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                    1 chạm
                  </span>
                </button>
              </div>

              {/* Sign up prompt */}
              <div className="text-center text-xs text-slate-500 pt-1">
                Chưa có tài khoản beFood?{' '}
                <button
                  type="button"
                  onClick={() => setAuthView('signup')}
                  className="text-amber-600 font-bold hover:underline cursor-pointer"
                >
                  Đăng ký ngay
                </button>
              </div>

              {/* SEPARATE ADMIN ACCESS LINK */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-center bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-3xl">
                <div className="text-[11px] text-slate-500 font-medium mb-1.5 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Dành riêng cho Ban Quản trị & Điều hành sàn</span>
                </div>
                <button
                  type="button"
                  onClick={() => openAdminAuthModal('signin')}
                  className="inline-flex items-center space-x-1.5 text-xs font-black text-[#00204A] hover:text-amber-600 transition-colors cursor-pointer bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-2xs hover:border-amber-400"
                >
                  <span>🔐 Đăng nhập Cổng Quản Trị Super Admin</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
                </button>
              </div>
            </div>
          )}

          {/* 2. SIGN UP VIEW */}
          {authView === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              {/* Perks Banner */}
              <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl flex items-center space-x-2.5">
                <Gift className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-amber-950">Ưu đãi chào mừng thành viên mới</div>
                  <div className="text-[11px] text-amber-700">Tặng 1.000 bePoint + Voucher Freeship 0Đ</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="09xx xxx xxx"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="ban@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="Tối thiểu 6 ký tự"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-10 pr-9 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nhập lại mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="Xác nhận mật khẩu"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 flex items-start space-x-2 pt-1">
                <input type="checkbox" required defaultChecked className="mt-0.5 rounded text-amber-500" />
                <span>
                  Tôi đồng ý với{' '}
                  <span className="text-amber-600 font-semibold underline">Điều khoản sử dụng beFood</span> và Chính sách bảo mật Be Group.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Hoàn Tất Đăng Ký Tài Khoản</span>
              </button>

              <div className="text-center text-xs text-slate-500 pt-1">
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => setAuthView('signin')}
                  className="text-amber-600 font-bold hover:underline cursor-pointer"
                >
                  Đăng nhập ngay
                </button>
              </div>

              {/* SEPARATE ADMIN ACCESS LINK */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-center bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-3xl">
                <div className="text-[11px] text-slate-500 font-medium mb-1.5 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Cán bộ nhân viên quản trị nội bộ?</span>
                </div>
                <button
                  type="button"
                  onClick={() => openAdminAuthModal('signup')}
                  className="inline-flex items-center space-x-1.5 text-xs font-black text-[#00204A] hover:text-amber-600 transition-colors cursor-pointer bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-2xs hover:border-amber-400"
                >
                  <span>📝 Yêu cầu cấp tài khoản Quản Trị BeFood →</span>
                </button>
              </div>
            </form>
          )}

          {/* 3. PROFILE & ACCOUNT DETAILS VIEW */}
          {authView === 'profile' && (
            <div className="space-y-4">
              {/* Profile Card Header */}
              <div className="flex items-center space-x-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-md shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-sm text-slate-900 truncate">
                      {currentUser.name}
                    </h3>
                    <span className="bg-[#FFC700] text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 truncate mt-0.5">{currentUser.email}</div>
                  <div className="text-xs text-slate-500 truncate">{currentUser.phone}</div>
                </div>
              </div>

              {/* bePay Wallet Box */}
              <div className="p-4 bg-gradient-to-r from-[#00204A] to-[#0a356b] rounded-2xl text-white shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-[#FFC700] text-[#00204A] rounded-lg">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">Ví bePay thanh toán</span>
                  </div>
                  <button
                    onClick={() => setShowTopUp(true)}
                    className="text-xs bg-[#FFC700] hover:bg-amber-400 text-[#00204A] font-extrabold px-3 py-1 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    + Nạp tiền
                  </button>
                </div>
                <div className="text-2xl font-black text-[#FFC700] mt-2">
                  {currentUser.walletBalance.toLocaleString('vi-VN')}đ
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  Thanh toán 1 chạm, nhận hoàn tiền tới 10% tại các quán ăn Đà Nẵng
                </p>
              </div>

              {/* Top-up Modal Simulator */}
              {showTopUp && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                    <span className="flex items-center gap-1">
                      <QrCode className="w-4 h-4 text-amber-700" /> Nạp tiền ví bePay
                    </span>
                    <button
                      onClick={() => setShowTopUp(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {['50000', '100000', '200000', '500000'].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setTopUpAmount(amt)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold flex-1 ${
                          topUpAmount === amt
                            ? 'bg-amber-500 text-white border-amber-600'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {(parseInt(amt) / 1000).toLocaleString()}k
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      currentUser.walletBalance += parseInt(topUpAmount);
                      showToast(`Nạp thành công ${parseInt(topUpAmount).toLocaleString('vi-VN')}đ vào ví bePay!`, 'success');
                      setShowTopUp(false);
                    }}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Xác nhận thanh toán VietQR / Thẻ ATM
                  </button>
                </div>
              )}

              {/* Sub-tab switcher */}
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setProfileTab('info')}
                  className={`pb-2 text-xs font-bold transition-all relative mr-5 cursor-pointer ${
                    profileTab === 'info' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Bảo mật & eKYC
                  {profileTab === 'info' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full"></span>
                  )}
                </button>
                <button
                  onClick={() => setProfileTab('loyalty')}
                  className={`pb-2 text-xs font-bold transition-all relative mr-5 cursor-pointer ${
                    profileTab === 'loyalty' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Điểm thưởng BeLoyalty
                  {profileTab === 'loyalty' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full"></span>
                  )}
                </button>
              </div>

              {profileTab === 'info' && (
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center space-x-2 text-slate-700">
                      <Shield className="w-4 h-4 text-emerald-500" />
                      <span>Xác thực căn cước eKYC</span>
                    </div>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đã xác thực
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center space-x-2 text-slate-700">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>Hạng thẻ thành viên</span>
                    </div>
                    <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                      Hội viên Vàng (Gold)
                    </span>
                  </div>

                  <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 text-slate-700 text-xs">
                    <p className="font-bold text-amber-900 mb-1">🎁 Đặc quyền đang kích hoạt:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                      <li>Ưu tiên điều phối tài xế BeBike gần nhất trong 30 giây</li>
                      <li>Free ship toàn thành phố cho đơn từ 150k</li>
                      <li>Tặng voucher 30k vào ngày sinh nhật</li>
                    </ul>
                  </div>
                </div>
              )}

              {profileTab === 'loyalty' && (
                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-2xl text-slate-950 font-bold shadow-xs">
                    <div className="text-[11px] uppercase tracking-wider text-slate-800">Điểm thưởng bePoint</div>
                    <div className="text-2xl font-black mt-1">1.450 bePoints</div>
                    <div className="w-full bg-slate-900/15 h-2 rounded-full mt-2 overflow-hidden">
                      <div className="bg-slate-900 h-full rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <div className="text-[10px] mt-1.5 flex justify-between text-slate-800">
                      <span>Cần thêm 550 điểm để đạt Hạng Kim Cương</span>
                      <span>72%</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Đổi mã giảm giá 30.000đ</div>
                      <div className="text-[11px] text-slate-500">Tiêu hao 500 bePoints</div>
                    </div>
                    <button
                      onClick={() => showToast('Đã đổi thành công mã voucher BEPOINT30K!', 'success')}
                      className="text-xs font-bold px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl cursor-pointer"
                    >
                      Đổi quà
                    </button>
                  </div>
                </div>
              )}

              {/* Logout Button */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    logout();
                    setAuthView('signin');
                  }}
                  className="w-full py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng Xuất Tài Khoản</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
