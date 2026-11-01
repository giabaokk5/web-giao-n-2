import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MarketingCampaign } from '../../types';
import { MOCK_MARKETING_CAMPAIGNS } from '../../data/mockData';
import { SidebarLayout, SidebarItem } from '../common/SidebarLayout';
import {
  Megaphone,
  Ticket,
  Gift,
  Users,
  Award,
  Calendar,
  Plus,
  Sparkles,
  Percent,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export const MarketingDashboard: React.FC = () => {
  const { showToast, playNotificationSound } = useApp();

  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(MOCK_MARKETING_CAMPAIGNS);
  const [activeTab, setActiveTab] = useState<'CAMPAIGNS' | 'TIERS' | 'BIRTHDAY' | 'REFERRAL'>('CAMPAIGNS');

  const handleSendBirthdayVouchers = () => {
    playNotificationSound();
    showToast('Đã tự động gửi Voucher sinh nhật 100K đến 342 khách hàng có sinh nhật trong tháng 11! 🎂', 'success');
  };

  const sidebarItems: SidebarItem[] = [
    { id: 'CAMPAIGNS', label: 'Chiến dịch khuyến mãi', icon: <Megaphone className="w-4 h-4" />, badge: campaigns.length },
    { id: 'TIERS', label: 'Hạng VIP & Hội viên', icon: <Award className="w-4 h-4" /> },
    { id: 'BIRTHDAY', label: 'Voucher sinh nhật', icon: <Gift className="w-4 h-4 text-amber-500" /> },
    { id: 'REFERRAL', label: 'Giới thiệu bạn bè', icon: <Share2 className="w-4 h-4" /> },
  ];

  return (
    <SidebarLayout
      title="Trung Tâm Tiếp Thị & Chiến Dịch (beMarketing)"
      subtitle="Thiết lập chiến dịch giảm giá, quản lý hạng VIP và voucher cá nhân hóa"
      roleBadge="beMarketing"
      items={sidebarItems}
      activeItemId={activeTab}
      onSelectItem={(id) => setActiveTab(id as typeof activeTab)}
      headerActions={
        <button
          onClick={() => showToast('Mở hộp thoại tạo chiến dịch BOGO / Flash sale mới', 'info')}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo chiến dịch mới</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Metric Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Chiến dịch đang chạy</span>
              <div className="text-2xl font-black text-slate-900">
                {campaigns.filter((c) => c.status === 'ACTIVE').length} chiến dịch
              </div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">Tỷ lệ mở voucher 78%</span>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <Megaphone className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Khách hàng VIP (Gold/Diamond)</span>
              <div className="text-2xl font-black text-blue-600">1.840 thành viên</div>
              <span className="text-[10px] text-blue-600 font-bold mt-1 inline-block">Đóng góp 58% doanh số</span>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Voucher đã phát tháng này</span>
              <div className="text-2xl font-black text-purple-600">8.920 lượt</div>
              <span className="text-[10px] text-slate-400 mt-1 inline-block">ROI marketing đạt 4.8x</span>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab 1: Campaigns */}
        {activeTab === 'CAMPAIGNS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {campaigns.map((cmp) => (
              <div
                key={cmp.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-36 w-full overflow-hidden">
                    <img src={cmp.bannerImage} alt={cmp.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                        cmp.status === 'ACTIVE'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-400 text-slate-950'
                      }`}
                    >
                      {cmp.status}
                    </span>
                    <span className="absolute bottom-3 left-3 bg-[#FFC700] text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-md">
                      {cmp.type}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">{cmp.title}</h4>
                    <p className="text-xs text-rose-600 font-bold">{cmp.discountInfo}</p>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                      <span>Đối tượng: <strong>{cmp.targetGroup}</strong></span>
                      <span>Hạn: {cmp.endDate}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Hiệu quả: +32% đơn</span>
                  <button
                    onClick={() => showToast(`Đã chia sẻ chiến dịch "${cmp.title}" lên banner trang chủ`, 'success')}
                    className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Đẩy lên trang chủ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: VIP Tiers */}
        {activeTab === 'TIERS' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-extrabold text-sm text-slate-900">
              Chính sách 4 Hạng Thành Viên BeLoyalty
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-2">
                <span className="font-black text-amber-800 text-sm block">🥉 Hạng Bronze</span>
                <p className="text-slate-500 text-[11px]">0 - 499 bePoints</p>
                <p className="text-slate-600">• Tích 1% điểm trên mỗi đơn</p>
              </div>

              <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-black text-slate-700 text-sm block">🥈 Hạng Silver</span>
                <p className="text-slate-500 text-[11px]">500 - 1.499 bePoints</p>
                <p className="text-slate-600">• Tích 1.5% điểm • Voucher 20k hàng tháng</p>
              </div>

              <div className="p-4 bg-yellow-100/60 rounded-2xl border border-yellow-300 space-y-2">
                <span className="font-black text-amber-900 text-sm block">🥇 Hạng Gold</span>
                <p className="text-slate-500 text-[11px]">1.500 - 3.999 bePoints</p>
                <p className="text-slate-600">• Freeship 0đ cho đơn từ 50k • Tặng 50k sinh nhật</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl border border-indigo-200 space-y-2">
                <span className="font-black text-indigo-900 text-sm block">💎 Hạng Diamond</span>
                <p className="text-slate-500 text-[11px]">4.000+ bePoints</p>
                <p className="text-slate-700 font-semibold">• Miễn phí ship mọi đơn • Hotline hỗ trợ riêng 24/7</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Birthday Specials */}
        {activeTab === 'BIRTHDAY' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Tự động tặng Voucher mừng sinh nhật khách hàng
                </h3>
                <p className="text-slate-500 mt-0.5">
                  Hệ thống quét ngày sinh nhật trong hồ sơ và tự động gửi mã `SINHNHATBE` giảm 100K.
                </p>
              </div>
              <button
                onClick={handleSendBirthdayVouchers}
                className="px-4 py-2.5 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Gift className="w-4 h-4" />
                <span>Gửi voucher sinh nhật tháng 11</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

