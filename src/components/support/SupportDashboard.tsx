import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SupportTicket, SupportTicketMessage } from '../../types';
import { supportService } from '../../services/supportService';
import { SidebarLayout, SidebarItem } from '../common/SidebarLayout';
import { Pagination } from '../common/Pagination';
import { EmptyState } from '../common/EmptyState';
import {
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Send,
  ShieldAlert,
  Phone,
  User,
  ShoppingBag,
  DollarSign,
  Ticket,
} from 'lucide-react';

export const SupportDashboard: React.FC = () => {
  const { showToast, playNotificationSound } = useApp();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    supportService.getTickets().then((data) => {
      setTickets(data);
      if (data.length > 0 && !selectedTicketId) {
        setSelectedTicketId(data[0].id);
      }
    });
  }, []);

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || null;

  // Filter
  const filteredTickets = tickets.filter((t) => {
    if (activeTab === 'in_progress' && t.status !== 'IN_PROGRESS') return false;
    if (activeTab === 'urgent' && t.priority !== 'HIGH' && t.priority !== 'URGENT') return false;
    if (activeTab === 'resolved' && t.status !== 'RESOLVED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.ticketCode.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.customerPhone.includes(q) ||
        t.topic.toLowerCase().includes(q) ||
        (t.orderCode && t.orderCode.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filteredTickets.length / pageSize) || 1;
  const pagedTickets = filteredTickets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    supportService.addMessage(selectedTicket.id, replyText.trim()).then((newMsg) => {
      setTickets((prev) =>
        prev.map((t) => (t.id === selectedTicket.id ? { ...t, messages: [...t.messages, newMsg] } : t))
      );
      setReplyText('');
      playNotificationSound();
      showToast('Đã gửi phản hồi hỗ trợ tới khách hàng', 'success');
    });
  };

  const handleResolveTicket = (ticketId: string) => {
    supportService.updateTicketStatus(ticketId, 'RESOLVED').then(() => {
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: 'RESOLVED' } : t))
      );
      playNotificationSound();
      showToast('Đã giải quyết và đóng yêu cầu khiếu nại thành công! 🎉', 'success');
    });
  };

  const sidebarItems: SidebarItem[] = [
    {
      id: 'all',
      label: 'Tất cả khiếu nại',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: tickets.filter((t) => t.status !== 'RESOLVED').length,
    },
    {
      id: 'urgent',
      label: 'Khiếu nại khẩn cấp',
      icon: <ShieldAlert className="w-4 h-4" />,
      badge: tickets.filter((t) => (t.priority === 'HIGH' || t.priority === 'URGENT') && t.status !== 'RESOLVED').length,
    },
    {
      id: 'in_progress',
      label: 'Đang xử lý',
      icon: <Clock className="w-4 h-4" />,
    },
    {
      id: 'resolved',
      label: 'Đã giải quyết',
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
  ];

  return (
    <SidebarLayout
      title="Trung Tâm Hỗ Trợ & CSKH beFood"
      subtitle="Xử lý khiếu nại, hỗ trợ tài xế và đền bù hoàn tiền nhanh chóng"
      roleBadge="beSupport"
      items={sidebarItems}
      activeItemId={activeTab}
      onSelectItem={(id) => {
        setActiveTab(id);
        setCurrentPage(1);
      }}
    >
      <div className="space-y-6">
        {/* Support Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Khiếu nại tiếp nhận</span>
              <div className="text-2xl font-black text-slate-900">{tickets.length} ca</div>
              <span className="text-[10px] text-amber-600 font-bold mt-1 inline-block">100% được phản hồi</span>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Thời gian phản hồi TB</span>
              <div className="text-2xl font-black text-emerald-600">2.8 phút</div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">Vượt chuẩn SLA 5p</span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Mức độ hài lòng (CSAT)</span>
              <div className="text-2xl font-black text-blue-600">98.5%</div>
              <span className="text-[10px] text-slate-400 mt-1 inline-block">Đánh giá 5 sao</span>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo mã ticket, tên khách, số điện thoại, mã đơn..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
            />
          </div>
        </div>

        {/* Main Grid: Ticket List & Live Chat Window */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Ticket List (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            {filteredTickets.length === 0 ? (
              <EmptyState
                icon={<MessageSquare className="w-8 h-8" />}
                title="Không có yêu cầu hỗ trợ"
                description="Tất cả các ca khiếu nại trong phân loại này đã được giải quyết xong."
              />
            ) : (
              <>
                <div className="space-y-2.5">
                  {pagedTickets.map((t) => {
                    const isSelected = t.id === selectedTicketId;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTicketId(t.id)}
                        className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50/70 border-amber-400 shadow-md ring-2 ring-amber-400/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-black text-xs text-slate-900">{t.ticketCode}</span>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                              t.priority === 'HIGH' || t.priority === 'URGENT'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {t.priority}
                          </span>
                        </div>

                        <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{t.topic}</h4>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                          <span>{t.customerName} ({t.customerPhone})</span>
                          <span className="text-slate-400">{t.createdAt.split(' ')[0]}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={filteredTickets.length}
                  pageSize={pageSize}
                />
              </>
            )}
          </div>

          {/* Chat & Ticket Resolution Pane (Right 7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col h-[580px] overflow-hidden">
            {selectedTicket ? (
              <>
                {/* Ticket Details Bar */}
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-slate-900">{selectedTicket.ticketCode}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-bold text-slate-700">{selectedTicket.topic}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Khách: <strong>{selectedTicket.customerName}</strong> ({selectedTicket.customerPhone})
                      {selectedTicket.orderCode && (
                        <span> • Mã đơn: <strong className="text-amber-600">{selectedTicket.orderCode}</strong></span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {selectedTicket.status !== 'RESOLVED' ? (
                      <button
                        onClick={() => handleResolveTicket(selectedTicket.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Đã giải quyết</span>
                      </button>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-xl text-xs">
                        ✓ Đã đóng ca
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Compensation Actions */}
                <div className="px-4 py-2 bg-amber-50/50 border-b border-amber-100 flex items-center space-x-2 text-[11px]">
                  <span className="font-bold text-amber-900">Xử lý nhanh:</span>
                  <button
                    onClick={() => {
                      showToast(`Đã hoàn trả 50.000đ về ví bePay của khách ${selectedTicket.customerName}`, 'success');
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg font-semibold text-amber-900 cursor-pointer"
                  >
                    💰 Hoàn tiền ví bePay
                  </button>
                  <button
                    onClick={() => {
                      showToast(`Đã gửi voucher đền bù 30k tới SĐT ${selectedTicket.customerPhone}`, 'success');
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg font-semibold text-amber-900 cursor-pointer"
                  >
                    🎁 Tặng voucher 30k
                  </button>
                </div>

                {/* Messages Chat Box */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fafbfc] text-xs">
                  {selectedTicket.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'agent' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                          msg.sender === 'agent'
                            ? 'bg-[#00204A] text-white rounded-br-none shadow-xs'
                            : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-2xs'
                        }`}
                      >
                        <div className="font-bold text-[10px] opacity-75 mb-1">{msg.senderName}</div>
                        <p>{msg.text}</p>
                      </div>
                      <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.timestamp}</span>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <form
                  onSubmit={handleSendReply}
                  className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
                >
                  <input
                    type="text"
                    placeholder="Nhập nội dung phản hồi cho khách hàng..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
                Chọn một khiếu nại để xem chi tiết và phản hồi
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

