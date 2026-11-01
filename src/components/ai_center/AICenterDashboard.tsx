import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SidebarLayout, SidebarItem } from '../common/SidebarLayout';
import {
  Bot,
  Sparkles,
  Wand2,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  ShieldAlert,
  FileText,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';

export const AICenterDashboard: React.FC = () => {
  const { showToast, playNotificationSound } = useApp();

  const [activeTab, setActiveTab] = useState<'WRITER' | 'SENTIMENT' | 'FRAUD' | 'FORECAST'>('WRITER');

  // AI Description Generator state
  const [dishTitle, setDishTitle] = useState('Chả ốc bươu nướng lá lốt');
  const [tone, setTone] = useState<'traditional' | 'luxury' | 'casual'>('traditional');
  const [generatedDesc, setGeneratedDesc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateDescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishTitle.trim()) return;

    setIsGenerating(true);
    setGeneratedDesc('');

    setTimeout(() => {
      setIsGenerating(false);
      let output = '';
      if (tone === 'traditional') {
        output = `Từng miếng chả ốc bươu giòn sần sật quết nhuyễn cùng giò sống ngọt thơm và tiêu xanh Phú Quốc, được gói ghém cẩn thận trong lớp lá lốt xanh mướt. Khi nướng xèo xèo trên than hoa hồng đượm, hương thơm thảo mộc lan tỏa nức mũi, chấm cùng nước mắm gừng ớt chua ngọt chuẩn cơm mẹ nấu Bếp Hoa.`;
      } else if (tone === 'luxury') {
        output = `Tuyệt phẩm ẩm thực dân dã được nâng tầm nghệ thuật: Sự kết hợp hoàn mỹ giữa ốc bươu tươi sống giòn ngọt và giò sống thượng hạng, quyện trong hương thơm thảo dược quý phái của lá lốt nướng củi than hoa. Món ăn mang đến trải nghiệm vị giác đa tầng đầy mê hoặc.`;
      } else {
        output = `Món ngon ăn vặt hay đưa cơm đều đỉnh chóp! Ốc bươu giòn dai béo ngậy, bọc lá lốt nướng thơm lừng chấm mắm gừng cay the the nhâm nhi cùng bạn bè thì hết ý.`;
      }
      setGeneratedDesc(output);
      playNotificationSound();
      showToast('Gemini AI đã hoàn thành tạo mô tả món ăn!', 'success');
    }, 1200);
  };

  const sidebarItems: SidebarItem[] = [
    { id: 'WRITER', label: 'Tự sinh mô tả món AI', icon: <Wand2 className="w-4 h-4 text-amber-400" /> },
    { id: 'SENTIMENT', label: 'Phân tích đánh giá (CSAT)', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'FRAUD', label: 'Phát hiện đơn bất thường', icon: <ShieldAlert className="w-4 h-4 text-rose-500" />, badge: 2 },
    { id: 'FORECAST', label: 'Dự báo nhu cầu nguyên liệu', icon: <TrendingUp className="w-4 h-4 text-emerald-400" /> },
  ];

  return (
    <SidebarLayout
      title="Trung Tâm Trí Tuệ Nhân Tạo (Gemini AI Studio)"
      subtitle="Ứng dụng mô hình AI Gemini vào vận hành ẩm thực, viết mô tả và cảnh báo rủi ro"
      roleBadge="beAI"
      items={sidebarItems}
      activeItemId={activeTab}
      onSelectItem={(id) => setActiveTab(id as typeof activeTab)}
    >
      <div className="space-y-6">
        {/* Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Mô hình AI vận hành</span>
              <div className="text-xl font-black text-slate-900">Google Gemini 2.5 Pro</div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">Độ chính xác 98.4%</span>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <Bot className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Cảm xúc tích cực (Sentiment)</span>
              <div className="text-2xl font-black text-emerald-600">94.2%</div>
              <span className="text-[10px] text-slate-400 mt-1 inline-block">Phân tích từ 5.400 đánh giá</span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Cảnh báo rủi ro đơn ảo</span>
              <div className="text-2xl font-black text-rose-600">2 ca cần duyệt</div>
              <span className="text-[10px] text-rose-600 font-bold mt-1 inline-block">Đã chặn spam tự động</span>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab 1: AI Menu Description Writer */}
        {activeTab === 'WRITER' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5 text-xs">
            <div>
              <div className="flex items-center space-x-2">
                <Wand2 className="w-4 h-4 text-amber-500" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  Tự động sinh mô tả món ăn thơm ngon bằng Gemini AI
                </h3>
              </div>
              <p className="text-slate-400 mt-0.5">
                Nhập tên món ăn, chọn phong cách hành văn để AI sáng tạo câu chữ hấp dẫn kích thích vị giác khách hàng.
              </p>
            </div>

            <form onSubmit={handleGenerateDescription} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Tên món ăn cần viết bài *</label>
                  <input
                    type="text"
                    value={dishTitle}
                    onChange={(e) => setDishTitle(e.target.value)}
                    placeholder="Ví dụ: Chim câu quay nước dừa béo giòn..."
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Giọng văn (Tone of Voice)</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as typeof tone)}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="traditional">Cơm nhà truyền thống (Ấm cúng)</option>
                    <option value="luxury">Cao cấp & Tinh tế (Gourmet)</option>
                    <option value="casual">Trẻ trung & Ăn vặt đường phố</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="px-5 py-3 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini đang sáng tạo văn bản...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>TẠO MÔ TẢ MÓN NGAY</span>
                  </>
                )}
              </button>
            </form>

            {generatedDesc && (
              <div className="p-5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Kết quả từ Gemini AI:
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(generatedDesc);
                      setCopied(true);
                      showToast('Đã sao chép mô tả món ăn!', 'success');
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-3 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg text-slate-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Đã chép' : 'Sao chép văn bản'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-800 leading-relaxed font-medium bg-white/80 p-4 rounded-xl border border-amber-100">
                  {generatedDesc}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Sentiment Analysis */}
        {activeTab === 'SENTIMENT' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-extrabold text-sm text-slate-900">
              Phân tích cảm xúc & Đánh giá khách hàng tự động
            </h3>
            <p className="text-slate-500">
              AI liên tục tổng hợp ý kiến đóng góp từ 5.400 phản hồi thực đơn để đề xuất cải tiến hương vị.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5">
                <span className="font-bold text-emerald-900 block text-xs">
                  👍 Khen ngợi nhiều nhất (94.2%):
                </span>
                <p className="text-emerald-800 text-[11px]">
                  • Món chim câu quay da giòn rụm không ngấy.<br />
                  • Canh chua cá lăng nêm nếm vừa vặn thanh mát.<br />
                  • Giao hàng đúng 20 phút không ghép đơn.
                </p>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1.5">
                <span className="font-bold text-amber-900 block text-xs">
                  💡 Gợi ý cải thiện (5.8%):
                </span>
                <p className="text-amber-800 text-[11px]">
                  • Khách mong muốn thêm tùy chọn ớt cay riêng cho nước chấm.<br />
                  • Đề xuất thêm xôi nếp cẩm bên cạnh xôi nếp nương.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Fraud Detection */}
        {activeTab === 'FRAUD' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-extrabold text-sm text-slate-900">
              Phát hiện đơn hàng bất thường & Ngăn ngừa gian lận
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-rose-900 text-xs">
                    Cảnh báo đơn trùng IP liên tiếp (#BE-994102)
                  </span>
                  <p className="text-rose-700 text-[11px] mt-0.5">
                    Tài khoản mới tạo đặt 8 đơn COD liên tục tới cùng một địa chỉ ảo trong 5 phút.
                  </p>
                </div>
                <button
                  onClick={() => showToast('Đã tạm giữ và gọi xác minh số điện thoại người nhận', 'info')}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  Xác minh SĐT
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Forecast */}
        {activeTab === 'FORECAST' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-extrabold text-sm text-slate-900">
              Dự báo nhu cầu nguyên liệu cuối tuần (Gemini Predictive Analytics)
            </h3>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-blue-900 space-y-2">
              <span className="font-bold block">Dự báo Thứ 7 & Chủ Nhật (Tuần 44):</span>
              <p className="text-[11px] leading-relaxed">
                • Nhu cầu đặt món gia đình tại <strong>Bếp Hoa</strong> dự kiến tăng <strong>+42%</strong>.<br />
                • Cần chuẩn bị thêm: <strong>50 con chim câu</strong>, <strong>25kg cá lăng sông</strong> và <strong>400 hộp giấy sinh thái</strong> trước chiều Thứ 6.
              </p>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

