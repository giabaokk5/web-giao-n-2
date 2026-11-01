import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Minimize2,
  Trash2,
  Key,
  ShieldCheck,
  RefreshCw,
  PhoneCall,
  Store,
  Bike,
  User,
  LayoutDashboard
} from 'lucide-react';
import { ChatMessage, ChatMessageItem } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { GeminiApiKeyModal } from '../ai/GeminiApiKeyModal';
import { useApp } from '../../context/AppContext';
import { callGeminiWithFallback } from '../../services/geminiService';

interface ChatbotWindowProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: 'Customer' | 'Admin' | 'Merchant' | 'Driver';
}

export const ChatbotWindow: React.FC<ChatbotWindowProps> = ({
  isOpen,
  onClose,
  initialRole = 'Customer',
}) => {
  const { showToast, playNotificationSound } = useApp();
  const [activeRole, setActiveRole] = useState<'Customer' | 'Admin' | 'Merchant' | 'Driver'>(initialRole);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message for selected role
  useEffect(() => {
    const welcomeMessages: Record<string, string> = {
      Customer:
        'Dạ em chào anh/chị! Em là **Trợ lý AI BeFood Đà Nẵng** 🍜✨\n\n' +
        'Em có thể giúp anh/chị:\n' +
        '- Tìm món ăn ngon chuẩn vị Đà Thành (Mì Quảng, Bún chả cá, Bánh tráng thịt heo, Chè Thái Liên...)\n' +
        '- Gợi ý món ngon theo ngân sách (dưới 50k, 100k) & vị trí gần bạn nhất\n' +
        '- Tra cứu trạng thái đơn hàng & mã giảm giá `BEFOOD50` hôm nay\n\n' +
        'Hôm nay anh/chị muốn thưởng thức món gì tại Đà Nẵng ạ?',
      Admin:
        'Xin chào Super Admin! Tôi là **Trợ Lý AI Phân Tích Dữ Liệu BeFood** 📊\n\n' +
        'Tôi sẵn sàng báo cáo:\n' +
        '- Doanh thu hệ thống theo ngày/tháng tại 6 quận Đà Nẵng\n' +
        '- Quét đơn hàng bất thường và cảnh báo rủi ro\n' +
        '- Thống kê món ăn bán chạy & hiệu suất tài xế trực tuyến.',
      Merchant:
        'Chào chủ quán! Tôi là **AI Đồng Hành Quán Ăn BeFood** 🏪\n\n' +
        'Tôi có thể giúp bạn:\n' +
        '- Gợi ý các combo món mới tăng giá trị đơn hàng\n' +
        '- Viết mô tả món ăn hấp dẫn chuẩn ẩm thực miền Trung\n' +
        '- Dự báo lượng nguyên liệu cần nhập theo thời tiết & cuối tuần.',
      Driver:
        'Chào bác tài BeBike Đà Nẵng! 🛵💨\n\n' +
        'Tôi là **AI Hỗ Trợ Tài Xế BeFood**:\n' +
        '- Hướng dẫn lộ trình giao hàng nhanh nhất tránh kẹt xe Cầu Rồng\n' +
        '- Tra cứu thu nhập, tiền tip và tiến độ thưởng cuốc hôm nay\n' +
        '- Tiếp nhận và hỗ trợ báo cáo sự cố giao hàng.',
    };

    setMessages([
      {
        id: `welcome-${activeRole}-${Date.now()}`,
        sender: 'bot',
        content: welcomeMessages[activeRole],
        role: activeRole,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [activeRole]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (userText: string) => {
    const userMsg: ChatMessageItem = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: userText,
      role: activeRole,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    playNotificationSound();

    try {
      // 1. Try calling Backend C# ASP.NET Core API
      const response = await fetch('http://localhost:5000/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId || undefined,
          message: userText,
          role: activeRole,
          userId: 'usr-101',
          userName: 'Trần Minh Quang',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSessionId(data.sessionId);
        setMessages((prev) => [
          ...prev,
          {
            id: data.messageId || `bot-${Date.now()}`,
            sender: 'bot',
            content: data.botReply,
            role: activeRole,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            recommendations: data.recommendations,
          },
        ]);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      console.log('Backend API offline or unreachable, switching to direct Gemini engine');
    }

    // 2. Client-side fallback with Gemini Service
    try {
      const botReply = await callGeminiWithFallback(userText);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          content: botReply,
          role: activeRole,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          recommendations:
            activeRole === 'Customer'
              ? [
                  {
                    id: 'rec-1',
                    name: 'Mì Quảng Gà Ta Thả Vườn',
                    description: 'Đặc sản trứ danh xứ Quảng - Thịt gà dai ngọt, bánh tráng nướng mè Đại Lộc.',
                    price: 45000,
                    originalPrice: 55000,
                    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop&q=80',
                    restaurantId: 'res-bamuamiquang',
                    restaurantName: 'Mì Quảng Bà Mua - Hải Châu',
                    rating: 4.96,
                    matchReason: 'Món ăn đặc sản được yêu thích nhất hôm nay',
                  },
                  {
                    id: 'rec-2',
                    name: 'Bún Chả Cá Thập Cẩm Tô Lớn',
                    description: 'Nước dùng hầm bí đỏ & thơm ngọt thanh, chả cá chiên hấp giòn dai.',
                    price: 38000,
                    originalPrice: 45000,
                    image: 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?w=400&auto=format&fit=crop&q=80',
                    restaurantId: 'res-bunchacahon113',
                    restaurantName: 'Bún Chả Cá Hờn 113A',
                    rating: 4.95,
                    matchReason: 'Gợi ý món nước ấm bụng trưa nay',
                  },
                ]
              : undefined,
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          content: 'Dạ hệ thống AI đang cập nhật, em sẽ phản hồi lại ngay cho anh/chị!',
          role: activeRole,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử trò chuyện này?')) {
      setMessages([]);
      showToast('Đã xóa lịch sử hội thoại AI', 'info');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[440px] md:w-[480px] h-[640px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border-2 border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="bg-[#00204A] text-white p-4 shrink-0 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md ring-2 ring-white/20">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-base text-white">BeFood AI Assistant</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-slate-300">
                Đồng hành ẩm thực & vận hành TP. Đà Nẵng
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="p-2 text-slate-300 hover:text-amber-400 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              title="Cài đặt API Key Gemini"
            >
              <Key className="w-4 h-4" />
            </button>
            <button
              onClick={handleClearHistory}
              className="p-2 text-slate-300 hover:text-rose-400 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              title="Xóa đoạn chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              title="Đóng cửa sổ chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4 Persona Tabs: Customer, Admin, Merchant, Driver */}
        <div className="grid grid-cols-4 gap-1 mt-3 bg-white/10 p-1 rounded-2xl backdrop-blur-xs">
          <button
            onClick={() => setActiveRole('Customer')}
            className={`py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeRole === 'Customer'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-3 h-3" />
            <span className="truncate">Khách hàng</span>
          </button>

          <button
            onClick={() => setActiveRole('Admin')}
            className={`py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeRole === 'Admin'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-3 h-3" />
            <span className="truncate">Admin</span>
          </button>

          <button
            onClick={() => setActiveRole('Merchant')}
            className={`py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeRole === 'Merchant'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Store className="w-3 h-3" />
            <span className="truncate">Quán ăn</span>
          </button>

          <button
            onClick={() => setActiveRole('Driver')}
            className={`py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeRole === 'Driver'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bike className="w-3 h-3" />
            <span className="truncate">Tài xế</span>
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/60">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onFeedback={(id, rating) => {
              showToast(
                rating === 1
                  ? 'Cảm ơn bạn đã thích câu trả lời của AI!'
                  : 'BeFood AI đã ghi nhận góp ý để hoàn thiện hơn.',
                'info'
              );
            }}
          />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs w-fit shadow-xs animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            <span>Trợ lý AI BeFood đang suy nghĩ câu trả lời...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Container */}
      <div className="p-3 bg-white">
        <ChatInput
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          role={activeRole}
        />
      </div>

      {/* Gemini API Key Modal */}
      <GeminiApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
      />
    </div>
  );
};

