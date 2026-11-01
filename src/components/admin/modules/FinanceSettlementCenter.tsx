import React, { useState } from 'react';
import {
  BadgeDollarSign,
  TrendingUp,
  CreditCard,
  RotateCcw,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  DollarSign,
  Building2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const FinanceSettlementCenter: React.FC = () => {
  const { restaurants, showToast, playNotificationSound } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'REVENUE' | 'SETTLEMENTS' | 'REFUNDS'>('SETTLEMENTS');

  // Settlements data for Da Nang restaurants (Đối soát hoa hồng 18%)
  const [settlementList, setSettlementList] = useState(
    restaurants.map((r, i) => {
      const gross = 28500000 + i * 4200000;
      const commission = Math.round(gross * 0.18);
      const netPayout = gross - commission;
      return {
        id: `stl-${r.id}`,
        restaurantId: r.id,
        restaurantName: r.name,
        district: r.district,
        grossRevenue: gross,
        commissionRate: 18,
        commissionAmount: commission,
        netPayout: netPayout,
        status: i % 2 === 0 ? 'PENDING_APPROVAL' : 'PAID',
        period: '24/10/2026 - 31/10/2026',
        bankAccount: 'Vietcombank CN Đà Nẵng - 0041000888999',
      };
    })
  );

  // Refund requests
  const [refundRequests, setRefundRequests] = useState([
    {
      id: 'ref-1',
      orderCode: 'BE-DN-9941',
      customerName: 'Trần Minh Quang',
      amount: 45000,
      reason: 'Quán hết bánh tráng mè nướng kèm món',
      channel: 'Ví bePay',
      status: 'PENDING',
      time: '11:35 01/11/2026',
    },
    {
      id: 'ref-2',
      orderCode: 'BE-DN-8812',
      customerName: 'Lê Hoàng Yến',
      amount: 38000,
      reason: 'Khách đổi địa chỉ ngoài bán kính giao',
      channel: 'VietQR MB Bank',
      status: 'REFUNDED',
      time: '10:15 01/11/2026',
    },
  ]);

  const handleApproveSettlement = (id: string, name: string, netAmount: number) => {
    if (window.confirm(`XÁC NHẬN CHUYỂN TIỀN ĐỐI SOÁT:\nChuyển khoản ${netAmount.toLocaleString('vi-VN')}đ cho quán "${name}"?`)) {
      setSettlementList(settlementList.map((s) => (s.id === id ? { ...s, status: 'PAID' } : s)));
      playNotificationSound();
      showToast(`Đã duyệt đối soát và ủy nhiệm chi cho "${name}" thành công!`, 'success');
    }
  };

  const handleApproveRefund = (refId: string, customer: string, amount: number) => {
    if (window.confirm(`XÁC NHẬN HOÀN TIỀN:\nHoàn ${amount.toLocaleString('vi-VN')}đ vào ví bePay cho khách hàng "${customer}"?`)) {
      setRefundRequests(refundRequests.map((r) => (r.id === refId ? { ...r, status: 'REFUNDED' } : r)));
      playNotificationSound();
      showToast(`Đã hoàn ${amount.toLocaleString('vi-VN')}đ vào ví của ${customer}!`, 'success');
    }
  };

  const totalGross = settlementList.reduce((acc, s) => acc + s.grossRevenue, 0);
  const totalCommission = settlementList.reduce((acc, s) => acc + s.commissionAmount, 0);
  const totalNet = settlementList.reduce((acc, s) => acc + s.netPayout, 0);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* 4 Finance KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-bold block mb-1">Tổng GMV kỳ này</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{totalGross.toLocaleString('vi-VN')}đ</div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">+18.4% so với kỳ trước</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-bold block mb-1">Hoa hồng beFood (18%)</span>
          <div className="text-xl sm:text-2xl font-black text-amber-600">{totalCommission.toLocaleString('vi-VN')}đ</div>
          <span className="text-[10px] text-amber-800 font-bold mt-1 inline-block">Doanh thu sàn thu về</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-bold block mb-1">Tiền trả nhà hàng</span>
          <div className="text-xl sm:text-2xl font-black text-blue-600">{totalNet.toLocaleString('vi-VN')}đ</div>
          <span className="text-[10px] text-slate-400 mt-1 inline-block">Sau khi trừ phí hoa hồng</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 font-bold block mb-1">Chờ duyệt chi trả</span>
          <div className="text-xl sm:text-2xl font-black text-rose-600">
            {settlementList.filter((s) => s.status === 'PENDING_APPROVAL').length} quán
          </div>
          <span className="text-[10px] text-rose-500 font-bold mt-1 inline-block">Hạn chót thứ 6 tuần này</span>
        </div>
      </div>

      {/* Sub Tabs: Settlements, Refunds, Payment Gateways */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveSubTab('SETTLEMENTS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'SETTLEMENTS'
                  ? 'bg-[#00204A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Đối Soát Doanh Thu Quán (18%)
            </button>
            <button
              onClick={() => setActiveSubTab('REFUNDS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'REFUNDS'
                  ? 'bg-[#00204A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Yêu Cầu Hoàn Tiền ({refundRequests.filter((r) => r.status === 'PENDING').length} mới)
            </button>
          </div>

          <button
            onClick={() => {
              showToast('Đang xuất file Excel đối soát ngân hàng Vietcombank...', 'info');
            }}
            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Excel Đối Soát</span>
          </button>
        </div>

        {/* Tab 1: Settlements Table */}
        {activeSubTab === 'SETTLEMENTS' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-4">Nhà Hàng Đối Tác</th>
                  <th className="p-4">Doanh Thu Gộp</th>
                  <th className="p-4">Hoa Hồng (18%)</th>
                  <th className="p-4">Thực Chuyển</th>
                  <th className="p-4">Kỳ Đối Soát</th>
                  <th className="p-4">Trạng Thái</th>
                  <th className="p-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {settlementList.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div className="font-extrabold text-slate-900">{s.restaurantName}</div>
                      <div className="text-[10px] text-slate-400">{s.district} • {s.bankAccount}</div>
                    </td>
                    <td className="p-4 font-black text-slate-900">{s.grossRevenue.toLocaleString('vi-VN')}đ</td>
                    <td className="p-4 font-bold text-amber-600">{s.commissionAmount.toLocaleString('vi-VN')}đ</td>
                    <td className="p-4 font-black text-emerald-600 text-sm">{s.netPayout.toLocaleString('vi-VN')}đ</td>
                    <td className="p-4 text-slate-500">{s.period}</td>
                    <td className="p-4">
                      {s.status === 'PAID' ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full">
                          ĐÃ THANH TOÁN
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-full animate-pulse">
                          CHỜ DUYỆT CHI
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {s.status === 'PENDING_APPROVAL' ? (
                        <button
                          onClick={() => handleApproveSettlement(s.id, s.restaurantName, s.netPayout)}
                          className="px-3 py-1.5 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-xs transition-all cursor-pointer"
                        >
                          Duyệt Chuyển Khoản
                        </button>
                      ) : (
                        <span className="text-slate-400 font-semibold text-[11px]">Đã chuyển</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Refunds Management */}
        {activeSubTab === 'REFUNDS' && (
          <div className="p-5 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">Danh Sách Yêu Cầu Hoàn Tiền Khiếu Nại</h4>
            <div className="space-y-3">
              {refundRequests.map((ref) => (
                <div
                  key={ref.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-900">
                        {ref.orderCode}
                      </span>
                      <strong className="text-slate-900 text-sm">{ref.customerName}</strong>
                      <span className="text-slate-400">• {ref.channel}</span>
                    </div>
                    <p className="text-slate-600">Lý do: <em>"{ref.reason}"</em></p>
                    <span className="text-[10px] text-slate-400">{ref.time}</span>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="font-black text-rose-600 text-base">
                      {ref.amount.toLocaleString('vi-VN')}đ
                    </span>

                    {ref.status === 'PENDING' ? (
                      <button
                        onClick={() => handleApproveRefund(ref.id, ref.customerName, ref.amount)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition-colors cursor-pointer"
                      >
                        Duyệt Hoàn Tiền
                      </button>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 font-black text-[10px] px-2.5 py-1 rounded-full">
                        ĐÃ HOÀN VÍ
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

