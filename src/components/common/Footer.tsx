import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#00204A] text-white pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-700/80 text-xs">
          {/* Col 1: Gia Bảo Food Brand */}
          <div className="space-y-3">
            <div className="bg-[#FFC700] text-[#00204A] font-black text-2xl tracking-tighter px-3.5 py-1.5 rounded-2xl shadow-md inline-flex items-center gap-1.5 border border-amber-300">
              <span className="bg-[#00204A] text-[#FFC700] text-[10px] font-black px-1.5 py-0.5 rounded-lg">GB</span>
              <span>Gia Bảo</span>
              <span className="text-[#00204A] font-extrabold ml-0.5">Food</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Vạn món ngon Đà Nẵng, Gia Bảo Food đây, đặt món ngay! Đặt đồ ăn online từ hàng trăm quán đặc sản Sông Hàn, giao tận nơi nóng hổi trong 20 phút.
            </p>
            <div className="pt-2 text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                Tầng 16, Tòa nhà Sai Gon Tower, 29 Lê Duẩn, Quận 1, TP.HCM
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                Hotline hỗ trợ: 1900 232345
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                Email: hotro@be.com.vn
              </p>
            </div>
          </div>

          {/* Col 2: Về beFood */}
          <div>
            <h4 className="font-bold text-amber-400 text-sm mb-3">Về beFood</h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Giới thiệu về beFood</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Quy chế hoạt động sàn TMĐT</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Điều khoản & Điều kiện sử dụng</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Chính sách bảo mật thông tin</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Giải quyết khiếu nại & bồi thường</a></li>
            </ul>
          </div>

          {/* Col 3: Hợp tác cùng Be */}
          <div>
            <h4 className="font-bold text-amber-400 text-sm mb-3">Hợp tác cùng Be</h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Đăng ký đối tác nhà hàng beMerchant</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Đăng ký đối tác tài xế beDriver</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Cộng đồng beFood Việt Nam</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">be Corporate - Dành cho doanh nghiệp</a></li>
            </ul>
          </div>

          {/* Col 4: Tải ứng dụng be */}
          <div>
            <h4 className="font-bold text-amber-400 text-sm mb-3">Tải ứng dụng be</h4>
            <p className="text-slate-300 mb-3">
              Trải nghiệm đặt món và giao đồ ăn mượt mà hơn trên ứng dụng Be:
            </p>
            <div className="flex flex-col space-y-2">
              <div className="bg-slate-800/80 border border-slate-600 rounded-xl p-2.5 flex items-center space-x-3">
                <span className="text-xl">🍏</span>
                <div>
                  <div className="text-[10px] text-slate-400">Tải về trên</div>
                  <div className="font-bold text-xs text-white">Apple App Store</div>
                </div>
              </div>
              <div className="bg-slate-800/80 border border-slate-600 rounded-xl p-2.5 flex items-center space-x-3">
                <span className="text-xl">🤖</span>
                <div>
                  <div className="text-[10px] text-slate-400">Tải về trên</div>
                  <div className="font-bold text-xs text-white">Google Play Store</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[11px] gap-2">
          <p>© 2026 Công ty Cổ phần Be Group. Bảo lưu mọi quyền.</p>
          <p className="flex items-center gap-1">
            Đồ án Full-stack Food Delivery Platform phát triển với <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> theo chuẩn BeFood
          </p>
        </div>
      </div>
    </footer>
  );
};

