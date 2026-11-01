import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RestaurantSettlement } from '../../types';
import { MOCK_SETTLEMENTS } from '../../data/mockData';
import { SidebarLayout, SidebarItem } from '../common/SidebarLayout';
import {
  DollarSign,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Download,
  Building,
  CreditCard,
  Check,
} from 'lucide-react';

export const AccountingDashboard: React.FC = () => {
  const { showToast, playNotificationSound } = useApp();

  const [settlements, setSettlements] = useState<RestaurantSettlement[]>(MOCK_SETTLEMENTS);
  const [activeTab, setActiveTab] = useState<'SETTLEMENTS' | 'CASHOUT' | 'INVOICES'>('SETTLEMENTS');

  // Simulated driver cashout requests
  const [cashoutRequests, setCashoutRequests] = useState([
    { id: 'req-1', driverName: 'Nguyễn Văn Be', bank: 'Vietcombank', accountNumber: '0071001234567', amount: 500000, status: 'PENDING', requestedAt: '09:15 01/11' },
    { id: 'req-2', driverName: 'Trần Văn Tài', bank: 'MB Bank', accountNumber: '9988776655', amount: 350000, status: 'APPROVED', requestedAt: '08:30 01/11' },
  ]);

  const handleApproveSettlement = (id: string) => {
    setSettlements((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'PAID' } : s))
    );
    playNotificationSound();
    showToast('Đã kết toán chuyển khoản thành công cho nhà hàng!', 'success');
  };

  const handleApproveCashout = (id: string) => {
    setCashoutRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'APPROVED' } : r))
    );
    playNotificationSound();
    showToast('Đã giải ngân tiền về tài khoản ngân hàng của tài xế!', 'success');
  };

  const handleExportReport = () => {
    playNotificationSound();
    showToast('Đã xuất báo cáo đối soát tài chính định dạng Excel (.xlsx)', 'info');
  };

  const totalGross = settlements.reduce((sum, s) => sum + s.grossAmount, 0);
  const totalCommission = settlements.reduce((sum, s) => sum + s.commissionAmount, 0);
  const totalPayout = settlements.reduce((sum, s) => sum + s.payoutAmount, 0);

  const sidebarItems: SidebarItem[] = [
    { id: 'SETTLEMENTS', label: 'Đối soát nhà hàng', icon: <Building className="w-4 h-4" />, badge: settlements.filter((s) => s.status === 'PENDING').length },
    { id: 'CASHOUT', label: 'Rút tiền tài xế', icon: <CreditCard className="w-4 h-4 text-amber-500" />, badge: cashoutRequests.filter((r) => r.status === 'PENDING').length },
    { id: 'INVOICES', label: 'Hóa đơn điện tử VAT', icon: <FileSpreadsheet className="w-4 h-4" /> },
  ];

  return (
    <SidebarLayout
      title="Trung Tâm Kế Toán & Đối Soát (beAccounting)"
      subtitle="Quản lý dòng tiền thanh toán, thu hoa hồng sàn và giải ngân tài xế"
      roleBadge="beAccounting"
      items={sidebarItems}
      activeItemId={activeTab}
      onSelectItem={(id) => setActiveTab(id as typeof activeTab)}
      headerActions={
        <button
          onClick={handleExportReport}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Xuất Báo Cáo Excel</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* KPI Financial Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Tổng doanh số GMV đối soát</span>
              <div className="text-2xl font-black text-slate-900">
                {(totalGross / 1000000).toFixed(1)}M VNĐ
              </div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">1.620 đơn hoàn thành</span>
            </div>
            <div className="p-3 bg-slate-100 text-slate-800 rounded-2xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Hoa hồng beFood giữ lại (18%)</span>
              <div className="text-2xl font-black text-amber-600">
                {(totalCommission / 1000000).toFixed(1)}M VNĐ
              </div>
              <span className="text-[10px] text-slate-400 mt-1 inline-block">Net Revenue ghi nhận</span>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Thực chi cho nhà hàng</span>
              <div className="text-2xl font-black text-blue-600">
                {(totalPayout / 1000000).toFixed(1)}M VNĐ
              </div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">Chuyển khoản 24h</span>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab 1: Settlements Table */}
        {activeTab === 'SETTLEMENTS' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Nhà hàng đối tác</th>
                    <th className="p-4">Kỳ đối soát</th>
                    <th className="p-4">Số đơn</th>
                    <th className="p-4">Tổng doanh số</th>
                    <th className="p-4">Hoa hồng sàn (18%)</th>
                    <th className="p-4">Thực chuyển quán</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {settlements.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-black text-slate-900">{s.restaurantName}</td>
                      <td className="p-4 text-slate-600">{s.period}</td>
                      <td className="p-4 font-bold">{s.totalOrders}</td>
                      <td className="p-4 text-slate-900">{s.grossAmount.toLocaleString('vi-VN')}đ</td>
                      <td className="p-4 text-amber-700 font-semibold">
                        -{s.commissionAmount.toLocaleString('vi-VN')}đ
                      </td>
                      <td className="p-4 font-black text-emerald-600 text-sm">
                        {s.payoutAmount.toLocaleString('vi-VN')}đ
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            s.status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {s.status === 'PAID' ? 'Đã kết toán' : 'Chờ duyệt'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {s.status === 'PENDING' ? (
                          <button
                            onClick={() => handleApproveSettlement(s.id)}
                            className="px-3 py-1.5 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-xs"
                          >
                            Duyệt chi
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px] font-medium">Hoàn tất</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Driver Cashout Requests */}
        {activeTab === 'CASHOUT' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Tài xế yêu cầu</th>
                    <th className="p-4">Ngân hàng thụ hưởng</th>
                    <th className="p-4">Số tài khoản</th>
                    <th className="p-4">Số tiền rút</th>
                    <th className="p-4">Thời gian</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cashoutRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{req.driverName}</td>
                      <td className="p-4 font-semibold text-slate-700">{req.bank}</td>
                      <td className="p-4 font-mono text-slate-800">{req.accountNumber}</td>
                      <td className="p-4 font-black text-rose-600 text-sm">
                        {req.amount.toLocaleString('vi-VN')}đ
                      </td>
                      <td className="p-4 text-slate-400">{req.requestedAt}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            req.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {req.status === 'APPROVED' ? 'Đã giải ngân' : 'Chờ chuyển khoản'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {req.status === 'PENDING' ? (
                          <button
                            onClick={() => handleApproveCashout(req.id)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
                          >
                            Xác nhận chuyển
                          </button>
                        ) : (
                          <span className="text-emerald-600 font-bold text-xs flex items-center justify-end gap-1">
                            <Check className="w-4 h-4" /> Thành công
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

