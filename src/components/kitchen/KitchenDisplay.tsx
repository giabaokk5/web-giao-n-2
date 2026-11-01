import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KitchenTicket } from '../../types';
import { MOCK_KITCHEN_TICKETS } from '../../data/mockData';
import { SidebarLayout, SidebarItem } from '../common/SidebarLayout';
import {
  ChefHat,
  Clock,
  Printer,
  CheckCircle2,
  AlertCircle,
  Flame,
  Volume2,
  ShoppingBag,
  Store,
  RefreshCw,
  Utensils,
} from 'lucide-react';

export const KitchenDisplay: React.FC = () => {
  const { showToast, playNotificationSound } = useApp();

  const [tickets, setTickets] = useState<KitchenTicket[]>(MOCK_KITCHEN_TICKETS);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'COOKING' | 'PENDING' | 'DONE'>('ALL');

  const handleStartCooking = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'COOKING' } : t))
    );
    playNotificationSound();
    showToast('Bếp đã bắt đầu nấu đơn hàng!', 'info');
  };

  const handleFinishCooking = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'DONE' } : t))
    );
    playNotificationSound();
    showToast('Món đã hoàn thành! Hệ thống tự động báo tài xế beFood đến nhận món.', 'success');
  };

  const handlePrintKOT = (orderCode: string) => {
    playNotificationSound();
    showToast(`Đã in phiếu bếp (KOT) cho đơn #${orderCode}`, 'info');
  };

  const filteredTickets = tickets.filter((t) => {
    if (activeFilter === 'COOKING') return t.status === 'COOKING';
    if (activeFilter === 'PENDING') return t.status === 'PENDING';
    if (activeFilter === 'DONE') return t.status === 'DONE';
    return true;
  });

  const sidebarItems: SidebarItem[] = [
    { id: 'ALL', label: 'Tất cả đơn bếp', icon: <ChefHat className="w-4 h-4" />, badge: tickets.filter((t) => t.status !== 'DONE').length },
    { id: 'COOKING', label: 'Đang trên chảo / lò', icon: <Flame className="w-4 h-4 text-amber-400" />, badge: tickets.filter((t) => t.status === 'COOKING').length },
    { id: 'PENDING', label: 'Chờ bắt đầu nấu', icon: <Clock className="w-4 h-4" />, badge: tickets.filter((t) => t.status === 'PENDING').length },
    { id: 'DONE', label: 'Đã hoàn thành', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
  ];

  return (
    <SidebarLayout
      title="Màn Hình Bếp Trực Quan (Kitchen Display System - KDS)"
      subtitle="Điều phối thứ tự chế biến, canh thời gian chờ và in phiếu chế biến"
      roleBadge="beKitchen"
      items={sidebarItems}
      activeItemId={activeFilter}
      onSelectItem={(id) => setActiveFilter(id as typeof activeFilter)}
      headerActions={
        <div className="flex items-center space-x-2 text-xs">
          <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <Volume2 className="w-4 h-4" /> Chuông bếp: BẬT
          </span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Đơn cần nấu ngay</span>
              <div className="text-2xl font-black text-amber-600">
                {tickets.filter((t) => t.status !== 'DONE').length} đơn
              </div>
              <span className="text-[10px] text-amber-700 font-bold mt-1 inline-block">Ưu tiên theo thời gian đặt</span>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <Flame className="w-5 h-5 fill-current" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Thời gian nấu trung bình</span>
              <div className="text-2xl font-black text-emerald-600">8.5 phút / đơn</div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">Đạt chuẩn giao nhanh</span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Đã xuất món hôm nay</span>
              <div className="text-2xl font-black text-blue-600">142 phần</div>
              <span className="text-[10px] text-slate-400 mt-1 inline-block">Bếp Hoa & Đối tác</span>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* KDS Order Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTickets.map((ticket) => {
            const isUrgent = ticket.elapsedMinutes >= 15;
            const isCooking = ticket.status === 'COOKING';
            const isDone = ticket.status === 'DONE';

            return (
              <div
                key={ticket.id}
                className={`bg-white rounded-3xl border-2 transition-all shadow-sm flex flex-col justify-between overflow-hidden ${
                  isDone
                    ? 'border-emerald-300 opacity-80'
                    : isUrgent
                    ? 'border-rose-500 ring-4 ring-rose-400/20'
                    : isCooking
                    ? 'border-amber-400'
                    : 'border-slate-300'
                }`}
              >
                {/* Ticket Top Ribbon */}
                <div
                  className={`p-4 flex items-center justify-between ${
                    isUrgent
                      ? 'bg-rose-500 text-white'
                      : isCooking
                      ? 'bg-[#00204A] text-white'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-sm">{ticket.orderCode}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 uppercase">
                        {ticket.orderType}
                      </span>
                    </div>
                    <span className="text-[11px] opacity-90 block mt-0.5">
                      {ticket.restaurantName}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-1 font-mono font-bold text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ticket.elapsedMinutes} phút</span>
                    </div>
                    <span className="text-[10px] opacity-80">Đặt lúc {ticket.createdAtTime}</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-5 space-y-3 flex-1 text-xs">
                  <div className="divide-y divide-slate-100">
                    {ticket.items.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-start space-x-2.5">
                        <span className="font-black text-sm text-slate-900 bg-amber-100 text-amber-900 w-6 h-6 rounded-lg flex items-center justify-center shrink-0">
                          {item.quantity}
                        </span>
                        <div>
                          <span className="font-bold text-slate-900 text-xs block">
                            {item.name}
                          </span>
                          {item.notes && (
                            <span className="text-rose-600 font-semibold text-[11px] bg-rose-50 px-1.5 py-0.5 rounded-md inline-block mt-1">
                              ⚠️ Ghi chú: {item.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Controls */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => handlePrintKOT(ticket.orderCode)}
                    className="p-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl flex items-center gap-1 shadow-2xs cursor-pointer"
                    title="In phiếu chế biến KOT"
                  >
                    <Printer className="w-4 h-4 text-slate-600" />
                    <span>In KOT</span>
                  </button>

                  <div className="flex space-x-1.5">
                    {ticket.status === 'PENDING' && (
                      <button
                        onClick={() => handleStartCooking(ticket.id)}
                        className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Bắt đầu nấu 🍳
                      </button>
                    )}

                    {ticket.status === 'COOKING' && (
                      <button
                        onClick={() => handleFinishCooking(ticket.id)}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Nấu xong ✓
                      </button>
                    )}

                    {ticket.status === 'DONE' && (
                      <span className="text-emerald-700 font-bold flex items-center gap-1 py-1 px-2">
                        <CheckCircle2 className="w-4 h-4" /> Đã bàn giao tài xế
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SidebarLayout>
  );
};

