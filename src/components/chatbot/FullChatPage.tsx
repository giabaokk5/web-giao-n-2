import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodItem, Restaurant } from '../../types';
import { GeminiApiKeyModal } from '../ai/GeminiApiKeyModal';
import { hasGeminiApiKey, askGeminiAI } from '../../services/geminiService';
import {
  Bot,
  Sparkles,
  Plus,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  ShoppingBag,
  Store,
  X,
  Send,
  Mic,
  Camera,
  ExternalLink,
  Headphones,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Coffee,
  Leaf,
  BarChart3,
  TrendingUp,
  Boxes,
  HelpCircle,
  RotateCcw,
  Key,
} from 'lucide-react';

interface FullChatPageProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
}

export const FullChatPage: React.FC<FullChatPageProps> = ({ isOpen, onClose, onMinimize }) => {
  const {
    chatSessions,
    activeSessionId,
    setActiveSessionId,
    createChatSession,
    deleteChatSession,
    addMessageToSession,
    rateMessage,
    restaurants,
    orders,
    addToCart,
    setActiveRestaurant,
    showToast,
  } = useApp();

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'customer' | 'admin' | 'merchant'>('customer');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active session
  const currentSession =
    chatSessions.find((s) => s.id === activeSessionId) || chatSessions[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, isTyping]);

  if (!isOpen) return null;

  // Quick prompt suggestions by mode
  const promptsByMode = {
    customer: [
      { label: '🎲 Hôm nay ăn gì ngon?', query: 'Hôm nay ăn gì ngon nhất?' },
      { label: '💰 Món ngon dưới 50k', query: 'Tìm món ngon giá dưới 50k' },
      { label: '🌱 Món chay thanh đạm', query: 'Gợi ý món ăn chay' },
      { label: '🧋 Trà sữa giải nhiệt', query: 'Gợi ý trà sữa thanh mát' },
      { label: '📦 Kiểm tra đơn hàng', query: 'Kiểm tra trạng thái đơn hàng của tôi' },
      { label: '🎧 Chuyển gặp nhân viên CSKH', query: 'Tôi muốn gặp nhân viên CSKH trực tuyến' },
    ],
    admin: [
      { label: '📊 Phân tích doanh thu hôm nay', query: 'Phân tích doanh thu và GMV toàn sàn hôm nay' },
      { label: '⚠️ Quét cảnh báo rủi ro đơn', query: 'Kiểm tra đơn hàng có dấu hiệu bất thường hoặc gian lận' },
      { label: '📈 Dự báo khung giờ cao điểm', query: 'Dự báo lượng đơn trong các khung giờ cao điểm tối nay' },
    ],
    merchant: [
      { label: '🔥 Món bán chạy nhất tuần', query: 'Món nào đang có tỷ lệ đặt lại cao nhất tại Bếp Hoa?' },
      { label: '📦 Kiểm tra nguyên liệu sắp hết', query: 'Nguyên liệu nào trong kho đang chạm ngưỡng an toàn?' },
      { label: '💡 Tư vấn Combo tăng doanh số', query: 'Gợi ý tạo combo món ăn kèm đồ uống tối ưu lợi nhuận' },
    ],
  };

  // Handler for user sending a query
  const handleSendMessage = (textQuery: string) => {
    const query = textQuery.trim();
    if (!query || !currentSession) return;

    const userMsgId = `usr-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    addMessageToSession(currentSession.id, userMsg);
    setInput('');
    setIsTyping(true);

    const runAI = async () => {
      const lower = query.toLowerCase();
      let botResponse = '';
      let foodCards: FoodItem[] | undefined = undefined;
      let restaurantCards: Restaurant[] | undefined = undefined;

      if (selectedMode === 'customer' && hasGeminiApiKey()) {
        try {
          const liveText = await askGeminiAI(
            query,
            currentSession.messages.map((m) => ({
              sender: m.sender === 'user' ? 'user' : 'bot',
              text: m.text,
            }))
          );
          botResponse = liveText;
        } catch (err: any) {
          console.warn('Gemini Live API fallback:', err);
        }
      }

      if (!botResponse) {
        if (selectedMode === 'customer') {
          if (lower.includes('hôm nay ăn gì') || lower.includes('gợi ý')) {
            botResponse =
              'Dựa trên thời gian và các món được đánh giá cao nhất hôm nay, BeFood AI xin gợi ý cho bạn thực đơn chuẩn vị thơm ngon này:';
            foodCards = [
              restaurants[0]?.menu[0],
              restaurants[1]?.menu[0],
              restaurants[2]?.menu[0],
            ].filter(Boolean);
          } else if (lower.includes('50k') || lower.includes('rẻ') || lower.includes('ngân sách')) {
            botResponse =
              'Tuyệt vời! Đây là các món ngon chất lượng, đầy đặn năng lượng có giá hạt dẻ dưới 50.000đ dành cho bạn:';
            const cheap: FoodItem[] = [];
            restaurants.forEach((r) => {
              r.menu.forEach((m) => {
                if (m.price <= 50000) cheap.push(m);
              });
            });
            foodCards = cheap.slice(0, 3);
          } else if (lower.includes('chay') || lower.includes('thanh đạm')) {
            botResponse =
              'Món chay thanh tịnh, chế biến sạch từ nấm đông cô, đậu hũ non và rau củ hữu cơ tươi ngon hôm nay:';
            const vegFoods: FoodItem[] = [];
            restaurants.forEach((r) => {
              r.menu.forEach((m) => {
                if (m.isVegetarian || m.name.toLowerCase().includes('nấm') || m.name.toLowerCase().includes('chay')) {
                  vegFoods.push(m);
                }
              });
            });
            foodCards = vegFoods.slice(0, 3);
          } else if (lower.includes('trà sữa') || lower.includes('uống') || lower.includes('nước')) {
            botResponse =
              'Trà sữa đậm vị Ô Long và Lài thơm ngát từ Phúc Long - giải nhiệt sảng khoái tức thì:';
            const drinks: FoodItem[] = [];
            restaurants.forEach((r) => {
              r.menu.forEach((m) => {
                if (m.category.toLowerCase().includes('trà') || m.category.toLowerCase().includes('nước')) {
                  drinks.push(m);
                }
              });
            });
            foodCards = drinks.slice(0, 3);
          } else if (lower.includes('đơn hàng') || lower.includes('kiểm tra')) {
            const activeOrder = orders.find(
              (o) => o.orderStatus !== 'COMPLETED' && o.orderStatus !== 'CANCELLED'
            );
            if (activeOrder) {
              botResponse = `📍 Đơn hàng #${activeOrder.orderCode} của bạn tại "${activeOrder.restaurantName}" đang ở trạng thái [${activeOrder.orderStatus}]. Tài xế Nguyễn Văn Be đang mang món tới bạn!`;
            } else {
              botResponse =
                'Bạn hiện không có đơn hàng nào đang giao dở. Bạn có muốn chọn món gì cho bữa ăn hôm nay không?';
            }
          } else if (lower.includes('cskh') || lower.includes('gặp nhân viên') || lower.includes('hỗ trợ')) {
            botResponse =
              'Đang kết nối bạn tới Chuyên viên CSKH trực tuyến của Be Group... Thời gian phản hồi dự kiến: dưới 30 giây. Bạn có thể gửi ảnh đính kèm nếu cần hỗ trợ khiếu nại!';
          } else {
            botResponse = `Mình đã hiểu yêu cầu "${query}". Dưới đây là những nhà hàng uy tín hàng đầu có món tương ứng giao siêu tốc trong 20 phút:`;
            restaurantCards = [restaurants[0], restaurants[1]].filter(Boolean);
          }
        } else if (selectedMode === 'admin') {
        if (lower.includes('doanh thu') || lower.includes('gmv')) {
          botResponse =
            '📊 [Báo cáo Gemini AI cho Quản trị viên]: Tổng GMV hôm nay ước tính đạt 48.0 Triệu VNĐ (+18.5% so với cùng kỳ tuần trước). Doanh thu hoa hồng sàn (18%) đạt xấp xỉ 8.64 Triệu VNĐ. Dòng tiền ví bePay ổn định.';
        } else if (lower.includes('gian lận') || lower.includes('bất thường')) {
          botResponse =
            '🛡️ [Hệ thống Gemini Fraud Scanner]: Không phát hiện dấu hiệu gian lận voucher diện rộng. Có 2 đơn hàng lặp lại địa chỉ IP tại Quận 3 đã được gắn cờ xác minh tự động.';
        } else {
          botResponse = `[Admin AI Center]: Đã phân tích truy vấn "${query}". Mạng lưới giao vận của BeBike đang duy trì tỷ lệ hoàn thành 98.6%, tốc độ giao đơn bình quân 24.2 phút.`;
        }
      } else {
        // Merchant mode
        if (lower.includes('bán chạy') || lower.includes('món')) {
          botResponse =
            '🍲 [Báo cáo Gemini AI cho Nhà Hàng]: Món "Cơm Sườn Bì Chả Đặc Biệt" và "Trà Sữa Ô Long" tiếp tục đứng đầu doanh số với tỷ lệ khách đặt lại đạt 64%. Đề xuất duy trì nguồn nguyên liệu ổn định.';
        } else if (lower.includes('nguyên liệu') || lower.includes('kho')) {
          botResponse =
            '⚠️ [Cảnh báo Định lượng & Tồn kho]: Gạo ST25 Ông Cua tại kho chỉ còn 120kg (ngưỡng an toàn là 100kg). Dự kiến sẽ hết trong vòng 48h tới nếu tốc độ bán giữ nguyên. Đề xuất tạo phiếu nhập kho ngay!';
        } else {
          botResponse = `💡 [Trợ lý Tối ưu F&B]: Đã xử lý yêu cầu "${query}". Bạn có thể kích hoạt tính năng Mua 1 Tặng 1 (BOGO) vào khung giờ 14h-17h để kéo thêm 35% lượng khách đồ uống buổi chiều.`;
        }
      }
    }

      const botMsgId = `bot-${Date.now()}`;
      addMessageToSession(currentSession.id, {
        id: botMsgId,
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        foodCards,
        restaurantCards,
      });

      setIsTyping(false);
    };

    setTimeout(runAI, 600);
  };

  // Voice simulation
  const handleVoiceInput = () => {
    setIsRecording(true);
    showToast('Đang lắng nghe giọng nói của bạn... 🎙️', 'info');
    setTimeout(() => {
      setIsRecording(false);
      const voiceSample = 'Tìm cho tôi món cơm tấm sườn nướng kèm canh khổ qua dưới 60k';
      setInput(voiceSample);
      showToast(`Đã nhận diện: "${voiceSample}"`, 'success');
    }, 2000);
  };

  // Camera Vision simulation
  const handleImageInput = () => {
    showToast('Gemini Vision đang quét nhận diện món ăn từ hình ảnh...', 'info');
    setTimeout(() => {
      const detected = 'Hình ảnh nhận diện: Phở bò tái lăn Hà Nội (~580 kcal)';
      handleSendMessage(`Tìm quán bán ${detected}`);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full h-full bg-white flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT SIDEBAR: Chat History & Mode Switcher */}
        <div className="w-full md:w-80 bg-slate-900 text-white flex flex-col border-r border-slate-800 shrink-0">
          {/* Brand & New Chat */}
          <div className="p-4 border-b border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-[#FFC700] text-[#00204A] font-black rounded-xl">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">BeFood AI Studio</h3>
                  <span className="text-[10px] text-amber-400 font-semibold">Gemini 1.5 Multi-Agent</span>
                </div>
              </div>
              {onMinimize && (
                <button
                  onClick={onMinimize}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                  title="Thu nhỏ về góc màn hình"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => {
                const newId = createChatSession(`Hội thoại mới #${chatSessions.length + 1}`, selectedMode);
                showToast('Đã bắt đầu phiên trò chuyện mới!', 'info');
              }}
              className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-105 text-slate-950 font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Đoạn Chat AI Mới</span>
            </button>
          </div>

          {/* Mode Selector */}
          <div className="p-3 border-b border-slate-800">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2 block">
              Chế độ Trợ lý AI
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl">
              <button
                onClick={() => setSelectedMode('customer')}
                className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  selectedMode === 'customer'
                    ? 'bg-[#FFC700] text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Khách
              </button>
              <button
                onClick={() => setSelectedMode('merchant')}
                className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  selectedMode === 'merchant'
                    ? 'bg-[#FFC700] text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Nhà hàng
              </button>
              <button
                onClick={() => setSelectedMode('admin')}
                className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  selectedMode === 'admin'
                    ? 'bg-[#FFC700] text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5 px-1 block">
              Lịch sử hội thoại ({chatSessions.length})
            </label>
            {chatSessions.map((session) => {
              const isActive = session.id === currentSession?.id;
              return (
                <div
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`group p-2.5 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-all ${
                    isActive
                      ? 'bg-slate-800 text-amber-300 font-bold border border-amber-400/30'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="truncate flex-1 min-w-0 pr-2">
                    <div className="truncate">{session.title}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{session.createdAt}</div>
                  </div>
                  {chatSessions.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChatSession(session.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 rounded-md cursor-pointer transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>beFood AI v2.5</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sẵn sàng 24/7
            </span>
          </div>
        </div>

        {/* RIGHT MAIN CHAT AREA */}
        <div className="flex-1 flex flex-col h-full bg-[#f8fafc]">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-2xs">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 rounded-2xl shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-extrabold text-sm text-slate-900">
                    {currentSession?.title || 'Trò chuyện cùng beFood AI'}
                  </h2>
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                    Chế độ: {selectedMode}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tích hợp Gemini 1.5, tra cứu thực đơn Bếp Hoa, Phúc Long & đối soát đơn hàng tức thì
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsKeyModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                title="Cài đặt Google Gemini API Key"
              >
                <Key className="w-3.5 h-3.5 text-amber-600" />
                <span>Gemini Live Key</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Đóng trang AI"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {currentSession?.messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-4 rounded-3xl max-w-2xl leading-relaxed text-xs shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-[#00204A] text-white rounded-br-none'
                      : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'
                  }`}
                >
                  <p className="text-xs sm:text-sm whitespace-pre-wrap">{m.text}</p>

                  {/* Food Cards inside Chat */}
                  {m.foodCards && m.foodCards.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Món ngon đề xuất đặt ngay:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {m.foodCards.map((food) => (
                          <div
                            key={food.id}
                            className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 hover:border-amber-400 flex items-center justify-between gap-3 transition-colors"
                          >
                            <img
                              src={food.image}
                              alt={food.name}
                              className="w-12 h-12 rounded-xl object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-xs text-slate-900 truncate">{food.name}</h5>
                              <span className="font-extrabold text-amber-700 text-xs">
                                {food.price.toLocaleString('vi-VN')}đ
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                addToCart(food, 1, {
                                  size: food.sizes?.[0],
                                  toppings: [],
                                });
                                showToast(`Đã thêm ${food.name} vào giỏ hàng!`, 'success');
                              }}
                              className="px-2.5 py-1.5 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-bold text-[11px] rounded-xl shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Thêm</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Restaurant Cards inside Chat */}
                  {m.restaurantCards && m.restaurantCards.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Nhà hàng nổi bật:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {m.restaurantCards.map((res) => (
                          <div
                            key={res.id}
                            onClick={() => {
                              setActiveRestaurant(res);
                              onClose();
                            }}
                            className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 hover:border-amber-400 flex items-center justify-between gap-2.5 cursor-pointer transition-colors"
                          >
                            <img
                              src={res.logo}
                              alt={res.name}
                              className="w-10 h-10 rounded-xl object-cover shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <h5 className="font-bold text-xs text-slate-900 truncate">{res.name}</h5>
                              <div className="text-[10px] text-slate-500">
                                ⭐ {res.rating} • Cách {res.distanceKm}km
                              </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Feedback rating: Thumbs up / down for bot response */}
                  {m.sender === 'bot' && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Bạn có hài lòng với câu trả lời này?</span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => {
                            rateMessage(currentSession.id, m.id, true);
                            showToast('Cảm ơn bạn đã đánh giá hữu ích!', 'success');
                          }}
                          className={`p-1 rounded-lg transition-colors cursor-pointer ${
                            m.liked ? 'text-emerald-600 bg-emerald-50' : 'hover:text-slate-600'
                          }`}
                          title="Hữu ích"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            rateMessage(currentSession.id, m.id, false);
                            showToast('Cảm ơn góp ý, chúng tôi sẽ cải thiện!', 'info');
                          }}
                          className={`p-1 rounded-lg transition-colors cursor-pointer ${
                            m.disliked ? 'text-rose-600 bg-rose-50' : 'hover:text-slate-600'
                          }`}
                          title="Chưa đúng ý"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-2">{m.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 p-3.5 bg-white rounded-3xl rounded-bl-none border border-slate-200 w-28 shadow-2xs">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-6 py-2.5 bg-white border-t border-slate-100 flex items-center space-x-2 overflow-x-auto scrollbar-none">
            {promptsByMode[selectedMode].map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(p.query)}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs rounded-full whitespace-nowrap border border-amber-200 cursor-pointer transition-colors shadow-2xs"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="p-4 bg-white border-t border-slate-200 flex items-center space-x-2.5"
          >
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2.5 rounded-2xl border transition-colors cursor-pointer ${
                isRecording
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
              }`}
              title="Tìm kiếm bằng giọng nói"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleImageInput}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 rounded-2xl transition-colors cursor-pointer"
              title="Tìm món bằng hình ảnh qua Gemini Vision"
            >
              <Camera className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                selectedMode === 'customer'
                  ? 'Hỏi món ngon, combo tiết kiệm, tìm món chay dưới 50k...'
                  : selectedMode === 'admin'
                  ? 'Phân tích doanh thu, rà soát tỷ lệ hoàn tất đơn...'
                  : 'Tối ưu thực đơn, phân tích món bán chạy, cảnh báo tồn kho...'
              }
              className="flex-1 text-xs sm:text-sm p-3 bg-slate-100 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-400"
            />

            <button
              type="submit"
              className="p-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-105 text-slate-950 font-black rounded-2xl shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Gemini Live API Key Settings Modal */}
      <GeminiApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
      />
    </div>
  );
};

