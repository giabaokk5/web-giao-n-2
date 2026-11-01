import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ShieldAlert,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  FileText,
  BarChart2,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Key,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChatMessage, ChatMessageItem } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { GeminiApiKeyModal } from '../ai/GeminiApiKeyModal';

export const AdminAIChat: React.FC = () => {
  const { showToast, playNotificationSound } = useApp();
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'admin-ai-welcome',
      sender: 'bot',
      content:
        'Xin chào **Super Admin BeFood**! Tôi là **AI Giám Sát & Phân Tích Kinh Doanh Toàn Hệ Thống** tại TP. Đà Nẵng 📊\n\n' +
        'Tôi liên tục quét dữ liệu thời gian thực từ 6 quận:\n' +
        '- **Doanh thu & Đơn hàng:** Tra cứu theo ngày, tuần, tháng và từng chi nhánh\n' +
        '- **Phát hiện bất thường:** Cảnh báo đơn chậm > 30p, tài khoản đặt ảo, quán làm trễ\n' +
        '- **Xếp hạng & Báo cáo:** Top món bán chạy, nhà hàng 5 sao, tỷ lệ khách quay lại.\n\n' +
        'Bạn cần tôi xuất báo cáo hoặc kiểm tra khu vực nào ngay bây giờ?',
      role: 'Admin',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [selectedAnomaly, setSelectedAnomaly] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulated Anomalies detected by AI (Module 8: human confirmation before sensitive actions)
  const [anomalies, setAnomalies] = useState([
    {
      id: 'ano-1',
      code: 'BE-DN-9941',
      type: 'DELIVERY_DELAY',
      severity: 'HIGH',
      description: 'Thời gian di chuyển của tài xế Nguyễn Văn Be vượt 32 phút (Kẹt xe đường Nguyễn Văn Linh)',
      actionText: 'Điều phối hỗ trợ',
      status: 'PENDING'
    },
    {
      id: 'ano-2',
      code: 'ACC-GUEST-881',
      type: 'SUSPICIOUS_CANCELLATION',
      severity: 'MEDIUM',
      description: 'Khách hàng đặt 3 đơn liên tiếp rồi hủy trong vòng 10 phút tại khu vực Sơn Trà',
      actionText: 'Kiểm duyệt tài khoản',
      status: 'PENDING'
    },
    {
      id: 'ano-3',
      code: 'RES-BUNCHACAHON',
      type: 'KITCHEN_OVERLOAD',
      severity: 'LOW',
      description: 'Bếp quán Bún Chả Cá Hờn 113A đang tồn 14 đơn chưa làm xong, trễ 8 phút',
      actionText: 'Tạm dừng nhận đơn mới',
      status: 'PENDING'
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessageItem = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: text,
      role: 'Admin',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    playNotificationSound();

    try {
      const response = await fetch('http://localhost:5000/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          role: 'Admin',
          userId: 'admin-super',
          userName: 'Super Admin',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            id: data.messageId || `bot-${Date.now()}`,
            sender: 'bot',
            content: data.botReply,
            role: 'Admin',
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setIsTyping(false);
        return;
      }
    } catch (e) {
      console.log('Backend API offline, using fallback');
    }

    // Fallback response generator for Admin
    setTimeout(() => {
      let botText = '';
      const textLower = text.toLowerCase();
      if (textLower.includes('báo cáo') || textLower.includes('doanh thu')) {
        botText =
          '📊 **BÁO CÁO DOANH THU HỆ THỐNG BEFOOD ĐÀ NẴNG HÔM NAY:**\n\n' +
          '- **Tổng doanh thu gộp:** `18.450.000đ` (+18.4% so với hôm qua)\n' +
          '- **Tổng đơn đặt thành công:** `128 đơn` (Tỷ lệ hoàn thành: 93.2%)\n' +
          '- **Doanh thu theo quận:**\n' +
          '  1. Quận Hải Châu: 8.920.000đ (48%)\n' +
          '  2. Quận Sơn Trà: 4.850.000đ (26%)\n' +
          '  3. Quận Thanh Khê: 3.120.000đ (17%)\n' +
          '  4. Các quận khác: 1.560.000đ (9%)\n' +
          '- **Phí hoa hồng sàn beFood thu về:** `3.321.000đ` (trung bình 18%).';
      } else if (textLower.includes('bất thường') || textLower.includes('cảnh báo')) {
        botText =
          '⚠️ **KẾT QUẢ QUÉT 3 VỤ VIỆC BẤT THƯỜNG CẦN XỬ LÝ:**\n\n' +
          '1. **Đơn #BE-DN-9941**: Thời gian giao vượt ngưỡng chuẩn 30 phút do kẹt xe trục Nguyễn Văn Linh.\n' +
          '2. **Tài khoản `guest_881`**: Có dấu hiệu spam hủy cuốc tại quận Sơn Trà.\n' +
          '3. **Quán Bún Chả Cá 113A**: Tồn 14 đơn chưa làm xong.\n\n' +
          '👉 Bạn có thể xem chi tiết và phê duyệt giải pháp ở bảng **[Cảnh Báo AI]** bên phải.';
      } else {
        botText =
          'Tôi đã cập nhật toàn bộ cơ sở dữ liệu hệ thống BeFood Đà Nẵng.\n\n' +
          'Mọi chỉ số về đội xe BeBike, doanh thu nhà hàng và đơn hàng đều đang vận hành trong ngưỡng an toàn!';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          content: botText,
          role: 'Admin',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleResolveAnomaly = (ano: any, action: string) => {
    // Security Module 8: Human confirmation required before sensitive changes
    if (window.confirm(`XÁC NHẬN PHÊ DUYỆT CỦA SUPER ADMIN:\nBạn có chắc chắn muốn thực hiện "${action}" cho mã ${ano.code}?`)) {
      setAnomalies(anomalies.map(a => a.id === ano.id ? { ...a, status: 'RESOLVED' } : a));
      showToast(`Đã thực hiện: ${action} cho ${ano.code}`, 'success');
      playNotificationSound();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Super Admin AI Header */}
      <div className="bg-[#00204A] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg ring-4 ring-amber-400/30">
              <Sparkles className="w-8 h-8 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-2xl text-white">Super Admin AI Intelligence</h2>
                <span className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full">
                  Real-time Đà Nẵng
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Trợ lý trí tuệ nhân tạo phân tích doanh thu, vận hành đội xe và phát hiện bất thường tự động
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-xs font-bold text-white transition-all cursor-pointer backdrop-blur-sm"
            >
              <Key className="w-4 h-4 text-amber-300" />
              <span>Cấu hình Gemini AI</span>
            </button>
            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3 py-2 rounded-2xl text-xs font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bảo mật cấp Super Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">Doanh thu sàn hôm nay</span>
          <div className="text-2xl font-black text-slate-900">18.450.000đ</div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% so với hôm qua
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">Tổng đơn đặt hôm nay</span>
          <div className="text-2xl font-black text-amber-600">128 đơn</div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Hoàn thành: 119 • Đang giao: 6 • Hủy: 3
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">Đội ngũ tài xế trực tuyến</span>
          <div className="text-2xl font-black text-blue-600">24 / 28 tài xế</div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
            Phủ kín 6 quận Đà Nẵng
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">Cảnh báo bất thường AI</span>
          <div className="text-2xl font-black text-rose-600">3 vụ việc</div>
          <span className="text-[11px] text-rose-500 font-bold mt-1 block">
            Cần Super Admin phê duyệt
          </span>
        </div>
      </div>

      {/* Main Grid: AI Chat Pane (7 cols) + AI Anomaly Monitor (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat Pane */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <BarChart2 className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-sm sm:text-base">Hội thoại AI Analytics & Tra cứu dữ liệu</h3>
            </div>
            <span className="text-xs text-slate-400">Model: Gemini 2.0 Flash</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/50">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs w-fit shadow-xs animate-pulse">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span>AI Super Admin đang tổng hợp số liệu từ database...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-slate-100">
            <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} role="Admin" />
          </div>
        </div>

        {/* Right Pane: AI Anomaly Detection & Human Approval (Module 8) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  Cảnh báo rủi ro & Bất thường (AI Audit)
                </h3>
              </div>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                {anomalies.filter(a => a.status === 'PENDING').length} cần xử lý
              </span>
            </div>

            <div className="space-y-3">
              {anomalies.map((ano) => (
                <div
                  key={ano.id}
                  className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                    ano.status === 'RESOLVED'
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : ano.severity === 'HIGH'
                      ? 'bg-rose-50/60 border-rose-200'
                      : 'bg-amber-50/60 border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800">
                        {ano.code}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full text-white ${
                          ano.severity === 'HIGH'
                            ? 'bg-rose-600'
                            : ano.severity === 'MEDIUM'
                            ? 'bg-amber-600'
                            : 'bg-blue-600'
                        }`}
                      >
                        {ano.severity}
                      </span>
                    </div>

                    {ano.status === 'RESOLVED' ? (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Đã xử lý
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-700 animate-pulse">
                        Chờ Admin duyệt
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {ano.description}
                  </p>

                  {ano.status === 'PENDING' && (
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleResolveAnomaly(ano, ano.actionText)}
                        className="py-1.5 px-3 bg-[#00204A] hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Phê duyệt: {ano.actionText}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
              <strong>🔒 Quy tắc bảo mật Super Admin (Module 8):</strong> Chatbot AI chỉ đề xuất và phát hiện. Mọi thao tác tài chính, khóa tài khoản hoặc hủy đơn bắt buộc phải có sự phê duyệt xác nhận trực tiếp của Super Admin.
            </div>
          </div>
        </div>
      </div>

      <GeminiApiKeyModal isOpen={showApiKeyModal} onClose={() => setShowApiKeyModal(false)} />
    </div>
  );
};
