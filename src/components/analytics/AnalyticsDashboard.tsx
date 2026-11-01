import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SidebarLayout, SidebarItem } from '../common/SidebarLayout';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  MapPin,
  Flame,
  BrainCircuit,
  BarChart2,
  Calendar,
  Sparkles,
  PieChart as PieIcon,
  Download,
  Filter,
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'districts' | 'forecast' | 'sentiment' | 'heatmap'>('districts');

  // Revenue & Order Data by Da Nang Districts
  const districtData = [
    { district: 'Hải Châu', gmv: 48.5, donHang: 1420, fill: '#FFC700' },
    { district: 'Sơn Trà', gmv: 39.2, donHang: 1150, fill: '#00204A' },
    { district: 'Thanh Khê', gmv: 28.0, donHang: 890, fill: '#10B981' },
    { district: 'Ngũ Hành Sơn', gmv: 22.4, donHang: 670, fill: '#F59E0B' },
    { district: 'Liên Chiểu', gmv: 18.6, donHang: 780, fill: '#8B5CF6' },
    { district: 'Cẩm Lệ', gmv: 12.3, donHang: 410, fill: '#EC4899' },
  ];

  // AI Demand Forecast Data
  const forecastData = [
    { time: '10:00', thucTe: 45, duBao: 48 },
    { time: '11:00', thucTe: 120, duBao: 115 },
    { time: '11:30', thucTe: 240, duBao: 235 },
    { time: '12:00', thucTe: 310, duBao: 295 },
    { time: '12:30', thucTe: 215, duBao: 220 },
    { time: '13:00', thucTe: 90, duBao: 95 },
    { time: '17:30', thucTe: 110, duBao: 115 },
    { time: '18:30', thucTe: 280, duBao: 290 },
    { time: '19:30', thucTe: 330, duBao: 320 },
    { time: '20:30', thucTe: 180, duBao: 175 },
    { time: '21:30', thucTe: 95, duBao: 90 },
  ];

  // Customer Sentiment Breakdown
  const sentimentData = [
    { name: 'Khen ngợi chuẩn vị Đà Nẵng (5 sao)', value: 72, color: '#10B981' },
    { name: 'Hài lòng về tốc độ giao BeBike (4 sao)', value: 20, color: '#3B82F6' },
    { name: 'Góp ý nêm nếm gia vị (3 sao)', value: 6, color: '#F59E0B' },
    { name: 'Không hài lòng đóng gói (1-2 sao)', value: 2, color: '#EF4444' },
  ];

  const sidebarItems: SidebarItem[] = [
    { id: 'districts', label: 'Doanh số theo Quận Đà Nẵng', icon: <MapPin className="w-4 h-4" /> },
    { id: 'forecast', label: 'AI Dự báo nhu cầu đơn', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'sentiment', label: 'Phân tích cảm xúc thực khách', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'heatmap', label: 'Bản đồ nhiệt mật độ ẩm thực', icon: <Flame className="w-4 h-4" /> },
  ];

  return (
    <SidebarLayout
      title="Trung Tâm Phân Tích Dữ Liệu & Dự Báo beFood Đà Nẵng"
      subtitle="Ứng dụng Machine Learning dự báo nhu cầu đặt món và phân tích thị trường ẩm thực miền Trung"
      roleBadge="beAnalytics Pro"
      items={sidebarItems}
      activeItemId={activeTab}
      onSelectItem={(id) => setActiveTab(id as typeof activeTab)}
    >
      <div className="space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">Thị phần dẫn đầu</span>
            <div className="text-xl font-black text-slate-900">Quận Hải Châu (32%)</div>
            <span className="text-[10px] text-emerald-600 font-bold">Khu vực Cầu Rồng & Sông Hàn</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">Độ chuẩn xác AI Dự báo</span>
            <div className="text-xl font-black text-amber-600">96.4% sai số &lt; 5%</div>
            <span className="text-[10px] text-slate-400">Model Gemini Time-Series</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">Chỉ số hài lòng thực khách</span>
            <div className="text-xl font-black text-emerald-600">4.92 / 5.0 ⭐</div>
            <span className="text-[10px] text-emerald-600 font-bold">92% đánh giá tích cực</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">Khách du lịch đặt món</span>
            <div className="text-xl font-black text-blue-600">38.5% tổng đơn</div>
            <span className="text-[10px] text-blue-600 font-bold">Tập trung Mỹ Khê & Sơn Trà</span>
          </div>
        </div>

        {/* Tab 1: District Revenue */}
        {activeTab === 'districts' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Phân Bổ Doanh Số & Lượng Đơn Theo Các Quận Đà Nẵng (Triệu VNĐ)
                </h3>
                <p className="text-xs text-slate-400">
                  Dữ liệu thời gian thực tổng hợp từ các chi nhánh nhà hàng tại TP. Đà Nẵng
                </p>
              </div>
              <button
                onClick={() => showToast('Đang tải dữ liệu phân tích quận huyện (.csv)', 'info')}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Xuất CSV</span>
              </button>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="district" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="M" />
                  <Tooltip
                    formatter={(val: any) => [`${val} Triệu VNĐ`, 'Doanh số GMV']}
                    contentStyle={{ borderRadius: '1rem', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="gmv" fill="#FFC700" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 2: Forecast */}
        {activeTab === 'forecast' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <span>AI Demand Forecasting - Dự Báo Nhu Cầu Đơn Hôm Nay</span>
                  <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    Gemini AI Model
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Đường màu vàng: Thực tế • Đường đứt nét xanh: Dự báo AI
                </p>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit=" đơn" />
                  <Tooltip
                    contentStyle={{ borderRadius: '1rem', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line
                    type="monotone"
                    dataKey="thucTe"
                    name="Số đơn thực tế"
                    stroke="#FFC700"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="duBao"
                    name="AI Dự báo nhu cầu"
                    stroke="#00204A"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 3: Sentiment */}
        {activeTab === 'sentiment' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900">
              Phân Tích Cảm Xúc & Phản Hồi Từ Khách Hàng (Sentiment NLP)
            </h3>
            <p className="text-xs text-slate-400">
              Mô hình xử lý ngôn ngữ tự nhiên quét hơn 15.000 lượt đánh giá món ăn tại Đà Nẵng
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`${val}% phản hồi`]}
                      contentStyle={{ borderRadius: '1rem', border: '1px solid #e2e8f0', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900">
                  <div className="font-extrabold">👍 Điểm khen ngợi nhiều nhất:</div>
                  <div className="text-[11px] mt-1 text-emerald-800">
                    "Mì Quảng Bà Mua sợi dai ngon, nước nhưn đậm đà đúng chất Quảng. Chè Liên sầu riêng béo ngậy đóng túi đá giữ nhiệt rất tốt!"
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900">
                  <div className="font-extrabold">💡 Điểm cần lưu ý cải thiện:</div>
                  <div className="text-[11px] mt-1 text-amber-800">
                    "Giờ cao điểm cuối tuần quanh đường Bạch Đằng và Cầu Rồng kẹt xe nhẹ, nên tăng cường tài xế BeBike túc trực sẵn."
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Heatmap Simulation */}
        {activeTab === 'heatmap' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900">
              Bản Đồ Nhiệt Mật Độ Đơn Hàng Đà Nẵng (Live Food Heatmap)
            </h3>
            <p className="text-xs text-slate-400">
              Mật độ đơn hàng tập trung cao điểm tại Quận Hải Châu, Sơn Trà và khu vực bãi biển Mỹ Khê
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950">
                <div className="font-extrabold text-xs">🔥 Vùng Đỏ (Rất đông):</div>
                <div className="text-sm font-black mt-1">Cầu Rồng & Bạch Đằng (Hải Châu)</div>
                <div className="text-[11px] text-rose-700 mt-1">Mật độ: 38 đơn/phút</div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
                <div className="font-extrabold text-xs">⚡ Vùng Vàng (Đông đảo):</div>
                <div className="text-sm font-black mt-1">Võ Nguyên Giáp & Mỹ Khê (Sơn Trà)</div>
                <div className="text-[11px] text-amber-800 mt-1">Mật độ: 25 đơn/phút</div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950">
                <div className="font-extrabold text-xs">🌊 Vùng Xanh (Ổn định):</div>
                <div className="text-sm font-black mt-1">ĐH Bách Khoa (Liên Chiểu)</div>
                <div className="text-[11px] text-blue-800 mt-1">Mật độ: 14 đơn/phút</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

