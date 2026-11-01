import React, { useState } from 'react';
import {
  Server,
  Database,
  Sliders,
  Activity,
  CheckCircle2,
  AlertCircle,
  Download,
  Upload,
  RefreshCw,
  ShieldCheck,
  Cpu,
  HardDrive
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const SystemInfraCenter: React.FC = () => {
  const { showToast, playNotificationSound } = useApp();
  const [activeTab, setActiveTab] = useState<'SETTINGS' | 'API_MONITOR' | 'BACKUP'>('API_MONITOR');
  const [isBackingUp, setIsBackingUp] = useState(false);

  // System Settings State
  const [baseDeliveryFee, setBaseDeliveryFee] = useState(15000);
  const [commissionRate, setCommissionRate] = useState(18);
  const [maxRadiusKm, setMaxRadiusKm] = useState(12);
  const [orderTimeoutMin, setOrderTimeoutMin] = useState(30);

  // API endpoints monitoring status
  const apiEndpoints = [
    { name: 'GET /api/orders', latency: '42ms', status: 'HEALTHY', uptime: '99.99%', requests: '18.4k' },
    { name: 'POST /api/chatbot/message', latency: '180ms', status: 'HEALTHY', uptime: '99.95%', requests: '4.2k' },
    { name: 'GET /api/restaurants', latency: '35ms', status: 'HEALTHY', uptime: '100%', requests: '42.1k' },
    { name: 'POST /api/reviews', latency: '58ms', status: 'HEALTHY', uptime: '99.98%', requests: '1.2k' },
    { name: 'SignalR /hubs/order', latency: '12ms', status: 'CONNECTED', uptime: '99.99%', requests: '98.5k' },
  ];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    playNotificationSound();
    showToast('Đã lưu cấu hình hệ thống BeFood Đà Nẵng thành công!', 'success');
  };

  const handleCreateBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      playNotificationSound();
      showToast('Đã tạo bản sao lưu BeFood_DB_20261101.bak thành công!', 'success');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Tabs */}
      <div className="flex items-center space-x-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs w-fit">
        <button
          onClick={() => setActiveTab('API_MONITOR')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'API_MONITOR' ? 'bg-[#00204A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          <span>39. API Monitoring & Uptime</span>
        </button>

        <button
          onClick={() => setActiveTab('SETTINGS')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'SETTINGS' ? 'bg-[#00204A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-blue-400" />
          <span>38. Cấu Hình Hệ Thống (Settings)</span>
        </button>

        <button
          onClick={() => setActiveTab('BACKUP')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'BACKUP' ? 'bg-[#00204A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>40. Sao Lưu & Phục Hồi (Backup)</span>
        </button>
      </div>

      {/* Tab 39: API Monitoring */}
      {activeTab === 'API_MONITOR' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 font-bold block mb-1">Thời gian hoạt động (Uptime)</span>
              <div className="text-2xl font-black text-emerald-600">99.98%</div>
              <span className="text-[10px] text-slate-400 mt-1 block">30 ngày qua không downtime</span>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 font-bold block mb-1">Độ trễ trung bình</span>
              <div className="text-2xl font-black text-slate-900">45ms</div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Phản hồi siêu tốc</span>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 font-bold block mb-1">Kết nối SignalR Realtime</span>
              <div className="text-2xl font-black text-blue-600">312 clients</div>
              <span className="text-[10px] text-blue-500 font-bold mt-1 block">Đang stream vị trí GPS</span>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 font-bold block mb-1">Cơ sở dữ liệu SQL Server</span>
              <div className="text-2xl font-black text-slate-900">Normal</div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Connection Pool 8/100</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900">Giám Sát Trạng Thái Các API Endpoints</h3>
              <span className="text-xs text-slate-400">Tự động ping mỗi 10s</span>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase">
                  <tr>
                    <th className="p-4">API Endpoint</th>
                    <th className="p-4">Độ Trễ</th>
                    <th className="p-4">Lượt Gọi Hôm Nay</th>
                    <th className="p-4">Uptime</th>
                    <th className="p-4 text-right">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {apiEndpoints.map((api, i) => (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-900">{api.name}</td>
                      <td className="p-4 font-mono text-emerald-600">{api.latency}</td>
                      <td className="p-4">{api.requests} reqs</td>
                      <td className="p-4">{api.uptime}</td>
                      <td className="p-4 text-right">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full">
                          ● {api.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 38: System Settings */}
      {activeTab === 'SETTINGS' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs max-w-2xl">
          <h3 className="font-extrabold text-base text-slate-900">Cấu Hình Vận Hành Toàn Sàn BeFood Đà Nẵng</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Cước giao hàng cơ bản (3km đầu)</label>
              <input
                type="number"
                value={baseDeliveryFee}
                onChange={(e) => setBaseDeliveryFee(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tỷ lệ hoa hồng sàn (%)</label>
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Bán kính giao hàng tối đa (km)</label>
              <input
                type="number"
                value={maxRadiusKm}
                onChange={(e) => setMaxRadiusKm(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngưỡng cảnh báo trễ đơn (phút)</label>
              <input
                type="number"
                value={orderTimeoutMin}
                onChange={(e) => setOrderTimeoutMin(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-md transition-all cursor-pointer"
            >
              Lưu Cấu Hình Vận Hành
            </button>
          </div>
        </form>
      )}

      {/* Tab 40: Backup & Restore */}
      {activeTab === 'BACKUP' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs max-w-2xl">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Sao Lưu & Phục Hồi Cơ Sở Dữ Liệu SQL Server</h3>
            <p className="text-slate-400 mt-0.5">Tạo bản snapshot dữ liệu toàn bộ đơn hàng, nhà hàng, khách hàng và nhật ký kiểm toán</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Bản sao lưu gần nhất:</span>
              <span className="text-emerald-600 font-bold">01/11/2026 - 04:00 AM (Thành công)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Dung lượng database:</span>
              <span className="text-slate-900 font-bold">148.6 MB (8,420 records)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Vị trí lưu trữ:</span>
              <span className="text-slate-500 font-mono text-[11px]">D:\web đồ ăn\backend\backups\</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCreateBackup}
              disabled={isBackingUp}
              className="px-5 py-2.5 bg-[#00204A] hover:bg-slate-900 text-white font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>{isBackingUp ? 'Đang tạo snapshot backup...' : 'Tạo Bản Sao Lưu Mới (.BAK)'}</span>
            </button>

            <button
              onClick={() => showToast('Vui lòng chọn file .bak hợp lệ để phục hồi', 'info')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Phục Hồi Dữ Liệu (Restore)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

