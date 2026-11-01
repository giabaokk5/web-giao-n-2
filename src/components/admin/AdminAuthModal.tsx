// src/components/admin/AdminAuthModal.tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  User,
  Phone,
  Building2,
  FileCheck2,
  X,
  Sparkles,
  ArrowRight,
  Fingerprint,
  Cpu,
  BadgeCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const AdminAuthModal: React.FC = () => {
  const {
    isAdminAuthModalOpen,
    setIsAdminAuthModalOpen,
    adminAuthModalView,
    setAdminAuthModalView,
    loginAdmin,
    registerAdmin,
    showToast,
  } = useApp();

  // Form states
  const [adminEmail, setAdminEmail] = useState('admin@befood.vn');
  const [adminPassword, setAdminPassword] = useState('admin@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [otpToken, setOtpToken] = useState('888999');
  const [selectedDept, setSelectedDept] = useState<'SUPER_ADMIN' | 'DISPATCH' | 'FINANCE' | 'SECURITY'>('SUPER_ADMIN');

  // Register Admin states
  const [employeeId, setEmployeeId] = useState('BE-DN-8899');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDept, setRegDept] = useState('Ban Quản Trị Tối Cao');
  const [secretKey, setSecretKey] = useState('BE-ADMIN-2026');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  if (!isAdminAuthModalOpen) return null;

  // Handle Admin Sign In
  const handleAdminSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim()) {
      showToast('Vui lòng nhập email công vụ Be Group', 'warning');
      return;
    }
    if (!adminPassword) {
      showToast('Vui lòng nhập mật khẩu quản trị', 'warning');
      return;
    }
    if (otpToken.length !== 6) {
      showToast('Mã xác thực bảo mật 2FA gồm 6 chữ số', 'warning');
      return;
    }

    const deptLabel =
      selectedDept === 'SUPER_ADMIN'
        ? 'Super Admin Tối Cao'
        : selectedDept === 'DISPATCH'
        ? 'Trưởng Ca Điều Vận Đà Nẵng'
        : selectedDept === 'FINANCE'
        ? 'Kế Toán Trưởng'
        : 'An Ninh Hệ Thống';

    loginAdmin(adminEmail, adminPassword, deptLabel);
  };

  // Handle Quick Admin Test Login
  const handleQuickAdminLogin = (dept: 'SUPER_ADMIN' | 'DISPATCH' | 'FINANCE') => {
    if (dept === 'SUPER_ADMIN') {
      loginAdmin('admin@befood.vn', 'admin123', 'Super Admin Tối Cao');
    } else if (dept === 'DISPATCH') {
      loginAdmin('dispatch@befood.vn', 'dispatch123', 'Trưởng Ca Điều Vận Radar');
    } else {
      loginAdmin('finance@befood.vn', 'finance123', 'Kế Toán Trưởng Sàn');
    }
  };

  // Handle Admin Registration / Access Request
  const handleAdminSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      showToast('Vui lòng nhập họ tên quản trị viên', 'warning');
      return;
    }
    if (!regEmail.trim()) {
      showToast('Vui lòng nhập email công vụ', 'warning');
      return;
    }
    if (!secretKey.trim()) {
      showToast('Vui lòng nhập mã bí mật ban điều hành', 'warning');
      return;
    }
    if (secretKey.trim() !== 'BE-ADMIN-2026') {
      showToast('Mã bí mật không đúng! Mã thử nghiệm: BE-ADMIN-2026', 'error');
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

    registerAdmin(employeeId, regName, regEmail, regPhone, regPassword, regDept);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#001736] text-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-amber-500/30 flex flex-col max-h-[94vh] relative">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#001736] via-[#092B5A] to-[#001736] p-6 border-b border-white/10 relative shrink-0">
          <button
            onClick={() => setIsAdminAuthModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Đóng cổng quản trị"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              BE-SHIELD ENTERPRISE
            </span>
            <span className="text-[11px] text-amber-300 font-semibold tracking-wider uppercase">
              Xác thực 256-Bit SSL • TP. Đà Nẵng
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Cổng Quản Trị Hệ Thống BeFood</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {adminAuthModalView === 'signin'
              ? 'Dành riêng cho Ban Giám Đốc, Kỹ sư Vận hành & Kế toán trưởng Be Group'
              : 'Yêu cầu cấp tài khoản & phê duyệt quyền truy cập nội bộ Be Group'}
          </p>

          {/* Segmented Tab Switcher */}
          <div className="flex items-center space-x-2 mt-4 bg-black/40 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setAdminAuthModalView('signin')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                adminAuthModalView === 'signin'
                  ? 'bg-[#FFC700] text-slate-950 font-black shadow-lg scale-100'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Đăng Nhập Quản Trị</span>
            </button>

            <button
              onClick={() => setAdminAuthModalView('signup')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                adminAuthModalView === 'signup'
                  ? 'bg-[#FFC700] text-slate-950 font-black shadow-lg scale-100'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Đăng Ký Cấp Quyền</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 bg-[#001736]">
          {/* VIEW 1: ADMIN SIGN IN */}
          {adminAuthModalView === 'signin' && (
            <div className="space-y-4">
              {/* Department Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Phân Hệ Quản Trị Trực Thuộc:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'SUPER_ADMIN' as const, label: '👑 Super Admin', sub: 'Toàn quyền sàn' },
                    { id: 'DISPATCH' as const, label: '⚡ Điều Vận', sub: 'Radar xe Be' },
                    { id: 'FINANCE' as const, label: '💰 Kế Toán', sub: 'Đối soát 18%' },
                    { id: 'SECURITY' as const, label: '🛡️ An Ninh', sub: 'Chống gian lận' },
                  ].map((dept) => (
                    <button
                      key={dept.id}
                      type="button"
                      onClick={() => setSelectedDept(dept.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedDept === dept.id
                          ? 'bg-amber-400/20 border-amber-400 text-white shadow-xs'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-xs font-bold">{dept.label}</div>
                      <div className="text-[10px] text-slate-400">{dept.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sign In Form */}
              <form onSubmit={handleAdminSignIn} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Công Vụ Quản Trị Viên
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@befood.vn"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mật Khẩu Quản Trị
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-9 pr-9 py-2 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Mã Xác Thực 2FA
                      </label>
                      <button
                        type="button"
                        onClick={() => setOtpToken('888999')}
                        className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                      >
                        Tự điền (888999)
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        maxLength={6}
                        value={otpToken}
                        onChange={(e) => setOtpToken(e.target.value)}
                        placeholder="888999"
                        required
                        className="w-full pl-9 pr-3 py-2 text-xs font-mono tracking-widest text-center bg-slate-900/90 border border-slate-700 rounded-xl text-amber-300 font-bold focus:ring-2 focus:ring-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#FFC700] via-yellow-400 to-amber-300 hover:brightness-105 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98 mt-2"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>XÁC THỰC & ĐĂNG NHẬP TRUNG TÂM ĐIỀU HÀNH</span>
                </button>
              </form>

              {/* Fast One-Click Admin Access */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-white/10 space-y-2">
                <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center justify-between">
                  <span>⚡ Đăng nhập thử nghiệm 1 chạm:</span>
                  <span className="text-slate-400">Dành cho Đánh giá</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickAdminLogin('SUPER_ADMIN')}
                    className="p-2.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 rounded-xl text-left transition-colors cursor-pointer"
                  >
                    <div className="font-bold text-xs text-purple-300 flex items-center gap-1">
                      👑 Super Admin
                    </div>
                    <div className="text-[10px] text-purple-200 truncate">admin@befood.vn</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickAdminLogin('DISPATCH')}
                    className="p-2.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-xl text-left transition-colors cursor-pointer"
                  >
                    <div className="font-bold text-xs text-blue-300 flex items-center gap-1">
                      ⚡ Trưởng Điều Vận
                    </div>
                    <div className="text-[10px] text-blue-200 truncate">dispatch@befood.vn</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickAdminLogin('FINANCE')}
                    className="p-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 rounded-xl text-left transition-colors cursor-pointer"
                  >
                    <div className="font-bold text-xs text-emerald-300 flex items-center gap-1">
                      💰 Kế Toán Trưởng
                    </div>
                    <div className="text-[10px] text-emerald-200 truncate">finance@befood.vn</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: ADMIN REGISTRATION / REQUEST ACCESS */}
          {adminAuthModalView === 'signup' && (
            <form onSubmit={handleAdminSignUp} className="space-y-3.5">
              <div className="bg-amber-400/10 border border-amber-400/20 p-3 rounded-2xl flex items-start space-x-2 text-xs text-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Đăng ký tài khoản Quản trị yêu cầu <strong>Mã bí mật nội bộ Be Group</strong>. Hồ sơ sẽ được kích hoạt quyền ngay sau khi đối soát thành công.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mã Định Danh Nhân Viên
                  </label>
                  <input
                    type="text"
                    required
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="BE-DN-8899"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-mono font-bold focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Họ Và Tên Quản Trị Viên
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Lê Quốc Bảo"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Công Vụ (@befood.vn)
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="baole@befood.vn"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Số Điện Thoại Bảo Mật
                  </label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0905 xxx xxx"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Phòng Ban Đảm Trách
                </label>
                <select
                  value={regDept}
                  onChange={(e) => setRegDept(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none cursor-pointer"
                >
                  <option value="Ban Quản Trị Tối Cao">👑 Ban Quản Trị Tối Cao (Super Admin)</option>
                  <option value="Trung Tâm Điều Vận Radar">⚡ Trung Tâm Điều Vận Radar Đà Nẵng</option>
                  <option value="Kế Toán & Đối Soát Doanh Thu">💰 Kế Toán & Đối Soát Doanh Thu 18%</option>
                  <option value="An Ninh & Chống Gian Lận">🛡️ An Ninh & Chống Gian Lận Đơn Hàng</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Mã Bí Mật Kích Hoạt Quyền Nội Bộ
                  </label>
                  <span className="text-[10px] text-amber-300">Mã mặc định: BE-ADMIN-2026</span>
                </div>
                <input
                  type="text"
                  required
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="BE-ADMIN-2026"
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-amber-300 font-mono font-bold focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mật Khẩu Quản Trị
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Xác Nhận Mật Khẩu
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-start space-x-2 pt-1">
                <input type="checkbox" required defaultChecked className="mt-0.5 rounded text-amber-400" />
                <span>
                  Tôi cam kết tuân thủ quy chế an toàn dữ liệu khách hàng, nhà hàng và tài xế của Be Group theo tiêu chuẩn ISO/IEC 27001.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#FFC700] via-yellow-400 to-amber-300 hover:brightness-105 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
              >
                <BadgeCheck className="w-4 h-4" />
                <span>GỬI HỒ SƠ YÊU CẦU CẤP QUYỀN QUẢN TRỊ</span>
              </button>
            </form>
          )}

          {/* Footer Back Link */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Hệ thống giám sát bảo mật 24/7</span>
            <button
              onClick={() => setIsAdminAuthModalOpen(false)}
              className="text-amber-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <span>← Trở về giao diện Khách hàng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

