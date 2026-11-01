import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodItem, Restaurant } from '../../types';
import { FullChatPage } from '../chatbot/FullChatPage';
import { GeminiApiKeyModal } from './GeminiApiKeyModal';
import { hasGeminiApiKey, askGeminiAI } from '../../services/geminiService';
import {
  Bot,
  X,
  Send,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Maximize2,
  ThumbsUp,
  ThumbsDown,
  Mic,
  Camera,
  Key,
} from 'lucide-react';

export const BeFoodAIChatbot: React.FC = () => {
  const {
    isChatbotOpen,
    setIsChatbotOpen,
    chatSessions,
    activeSessionId,
    addMessageToSession,
    rateMessage,
    restaurants,
    orders,
    setActiveRestaurant,
    addToCart,
    showToast,
  } = useApp();

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentSession =
    chatSessions.find((s) => s.id === activeSessionId) || chatSessions[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, isTyping]);

  if (!isChatbotOpen) return null;

  const quickPrompts = [
    { label: '🎲 Hôm nay ăn gì?', query: 'Hôm nay ăn gì?' },
    { label: '💰 Món ngon dưới 50k', query: 'Tìm món dưới 50k' },
    { label: '🌱 Món chay thanh đạm', query: 'Gợi ý món chay ngon' },
    { label: '🧋 Trà sữa giải nhiệt', query: 'Gợi ý trà sữa ngon' },
    { label: '🍚 Cơm trưa no bụng', query: 'Gợi ý cơm trưa' },
    { label: '📦 Kiểm tra đơn hàng', query: 'Kiểm tra trạng thái đơn hàng' },
  ];

  const handleSendQuery = (textQuery: string) => {
    const query = textQuery.trim();
    if (!query || !currentSession) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    addMessageToSession(currentSession.id, userMsg);
    setInput('');
    setIsTyping(true);

    const runAIResponse = async () => {
      let botResponse = '';
      let foodCards: FoodItem[] | undefined = undefined;
      let restaurantCards: Restaurant[] | undefined = undefined;

      const lower = query.toLowerCase();

      // Check if user has Gemini API key configured
      if (hasGeminiApiKey()) {
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
          console.warn('Gemini API call fallback to smart local engine:', err);
        }
      }

      // If no key or API call had an issue, use rich local Da Nang smart engine
      if (!botResponse) {
        if (lower.includes('hôm nay ăn gì') || lower.includes('gợi ý')) {
          botResponse =
            'Dựa trên thời điểm hiện tại và các món được yêu thích nhất trên beFood Đà Nẵng, mình đề xuất cho bạn các món "best seller" chuẩn vị này nhé:';
          foodCards = [
            restaurants[0]?.menu[0],
            restaurants[1]?.menu[0],
            restaurants[2]?.menu[0],
          ].filter(Boolean);
        } else if (lower.includes('50k') || lower.includes('ngân sách') || lower.includes('rẻ')) {
          botResponse = 'Đây là những món ngon chuẩn tiêu chí "ngon - bổ - hạt dẻ" dưới 50.000đ tại Đà Nẵng dành cho bạn:';
          const affordable: FoodItem[] = [];
          restaurants.forEach((r) => {
            r.menu.forEach((m) => {
              if (m.price <= 50000) affordable.push(m);
            });
          });
          foodCards = affordable.slice(0, 3);
        } else if (lower.includes('chay') || lower.includes('thanh đạm')) {
          botResponse = 'Thực đơn món chay thanh lành, sạch và giàu dinh dưỡng tại Đà Nẵng:';
          const vegFoods: FoodItem[] = [];
          restaurants.forEach((r) => {
            r.menu.forEach((m) => {
              if (m.isVegetarian || m.name.toLowerCase().includes('chay') || m.name.toLowerCase().includes('nấm')) {
                vegFoods.push(m);
              }
            });
          });
          foodCards = vegFoods.slice(0, 3);
        } else if (lower.includes('trà sữa') || lower.includes('uống') || lower.includes('nước') || lower.includes('cà phê')) {
          botResponse = 'Trà sữa đậm vị thanh mát & Cà phê muối Đà Nẵng từ thương hiệu nổi tiếng:';
          const drinks: FoodItem[] = [];
          restaurants.forEach((r) => {
            r.menu.forEach((m) => {
              if (m.category.toLowerCase().includes('trà') || m.category.toLowerCase().includes('nước') || m.name.toLowerCase().includes('cà phê')) {
                drinks.push(m);
              }
            });
          });
          foodCards = drinks.slice(0, 3);
        } else if (lower.includes('mì quảng') || lower.includes('quảng')) {
          botResponse = 'Mì Quảng Bà Mua - Đặc sản trứ danh xứ Quảng với sợi mì mềm dai, nước nhưn đậm đà truyền thống:';
          const miQuangRes = restaurants.find((r) => r.id === 'res-bamuamiquang') || restaurants[0];
          foodCards = miQuangRes.menu.slice(0, 2);
          restaurantCards = [miQuangRes];
        } else if (lower.includes('bánh tráng') || lower.includes('thịt heo')) {
          botResponse = 'Đặc Sản Trần - Bánh tráng cuốn thịt heo hai đầu da luộc trứ danh Đà Nẵng chấm mắm nêm đậm đà:';
          const tranRes = restaurants.find((r) => r.id === 'res-dacsan-tran') || restaurants[1];
          foodCards = tranRes.menu.slice(0, 2);
          restaurantCards = [tranRes];
        } else if (lower.includes('hải sản') || lower.includes('bé mặn')) {
          botResponse = 'Hải Sản Bé Mặn Võ Nguyên Giáp - Vựa hải sản tươi sống lớn nhất bờ biển Mỹ Khê Đà Nẵng:';
          const beManRes = restaurants.find((r) => r.id === 'res-beman-seafood') || restaurants[2];
          foodCards = beManRes.menu.slice(0, 2);
          restaurantCards = [beManRes];
        } else if (lower.includes('chè') || lower.includes('sầu')) {
          botResponse = 'Chè Sầu Liên Đà Nẵng - Cơm sầu riêng Ri6 tươi béo ngậy nức tiếng gần xa:';
          const cheRes = restaurants.find((r) => r.id === 'res-chesaulien') || restaurants[3];
          foodCards = cheRes.menu.slice(0, 2);
          restaurantCards = [cheRes];
        } else if (lower.includes('cơm') || lower.includes('trưa')) {
          botResponse = 'Cơm tấm nóng hổi sườn nướng mọng nước - no nê năng lượng cho bạn:';
          const riceRest = restaurants.find((r) => r.id === 'res-phucloctho') || restaurants[1];
          if (riceRest) {
            foodCards = riceRest.menu.slice(0, 2);
            restaurantCards = [riceRest];
          }
        } else if (lower.includes('đơn hàng') || lower.includes('kiểm tra')) {
          const activeOrder = orders.find(
            (o) => o.orderStatus !== 'COMPLETED' && o.orderStatus !== 'CANCELLED'
          );
          if (activeOrder) {
            botResponse = `Bạn hiện đang có đơn hàng #${activeOrder.orderCode} từ quán "${activeOrder.restaurantName}". Trạng thái hiện tại: [${activeOrder.orderStatus}]. Tài xế đang trên đường giao!`;
          } else {
            botResponse = 'Hiện tại bạn không có đơn hàng nào đang giao dở. Bạn có muốn chọn món gì cho bữa hôm nay không?';
          }
        } else {
          botResponse = `Mình đã ghi nhận yêu cầu "${query}". Dưới đây là những quán ăn và món ngon nổi bật nhất gần bạn tại Đà Nẵng sẵn sàng giao ngay:`;
          restaurantCards = [restaurants[0], restaurants[1]].filter(Boolean);
        }
      }

      // If Gemini response didn't include food cards, attach relevant cards if query matches
      if (!foodCards || foodCards.length === 0) {
        const matches: FoodItem[] = [];
        restaurants.forEach((r) => {
          r.menu.forEach((m) => {
            if (query.toLowerCase().split(' ').some((word) => word.length > 2 && m.name.toLowerCase().includes(word))) {
              matches.push(m);
            }
          });
        });
        if (matches.length > 0) foodCards = matches.slice(0, 2);
      }

      addMessageToSession(currentSession.id, {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        foodCards,
        restaurantCards,
      });
      setIsTyping(false);
    };

    setTimeout(runAIResponse, 600);
  };

  return (
    <>
      {/* If full screen is active, show the FullChatPage */}
      {isFullscreen ? (
        <FullChatPage
          isOpen={isFullscreen}
          onClose={() => {
            setIsFullscreen(false);
            setIsChatbotOpen(false);
          }}
          onMinimize={() => setIsFullscreen(false)}
        />
      ) : (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-96 sm:w-[420px] max-h-[620px] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00204A] via-[#092B5A] to-[#00204A] text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 rounded-2xl shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-extrabold text-sm text-white">BeFood AI Assistant</h3>
                    <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-md">
                      Gemini
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">Gợi ý thông minh & Tra cứu siêu tốc</p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsKeyModalOpen(true)}
                  className="p-1.5 rounded-full text-amber-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Cài đặt Google Gemini API Key"
                >
                  <Key className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Mở rộng toàn màn hình"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsChatbotOpen(false)}
                  className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Đóng chatbot"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-slate-50/60 max-h-[380px]">
              {currentSession?.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#00204A] text-white rounded-br-none shadow-sm'
                        : 'bg-white text-slate-800 rounded-bl-none border border-slate-200/80 shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>

                    {/* Suggested Food Cards inside Chat */}
                    {m.foodCards && m.foodCards.length > 0 && (
                      <div className="mt-3 space-y-2 pt-2 border-t border-slate-100">
                        {m.foodCards.map((food) => (
                          <div
                            key={food.id}
                            className="bg-slate-50 rounded-xl p-2.5 flex items-center justify-between gap-2.5 border border-slate-200 hover:border-amber-400 transition-colors"
                          >
                            <img
                              src={food.image}
                              alt={food.name}
                              className="w-12 h-12 rounded-lg object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-[11px] text-slate-900 truncate">
                                {food.name}
                              </h5>
                              <span className="font-black text-amber-700 text-xs">
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
                              className="px-2.5 py-1.5 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-bold text-[10px] rounded-lg shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
                            >
                              <ShoppingBag className="w-3 h-3" />
                              <span>Đặt</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Suggested Restaurant Cards inside Chat */}
                    {m.restaurantCards && m.restaurantCards.length > 0 && (
                      <div className="mt-3 space-y-2 pt-2 border-t border-slate-100">
                        {m.restaurantCards.map((res) => (
                          <div
                            key={res.id}
                            onClick={() => {
                              setActiveRestaurant(res);
                              setIsChatbotOpen(false);
                            }}
                            className="bg-slate-50 rounded-xl p-2 flex items-center justify-between gap-2 border border-slate-200 hover:border-amber-400 cursor-pointer transition-colors"
                          >
                            <img
                              src={res.logo}
                              alt={res.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div className="flex-1 truncate">
                              <h5 className="font-bold text-[11px] text-slate-900 truncate">
                                {res.name}
                              </h5>
                              <span className="text-[10px] text-slate-500">
                                ⭐ {res.rating} • {res.distanceKm}km
                              </span>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Feedback Rating */}
                    {m.sender === 'bot' && (
                      <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Đánh giá phản hồi:</span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {
                              rateMessage(currentSession.id, m.id, true);
                              showToast('Cảm ơn đánh giá của bạn!', 'success');
                            }}
                            className={`p-1 rounded cursor-pointer ${
                              m.liked ? 'text-emerald-600 bg-emerald-50' : 'hover:text-slate-600'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              rateMessage(currentSession.id, m.id, false);
                              showToast('Ghi nhận góp ý cải thiện!', 'info');
                            }}
                            className={`p-1 rounded cursor-pointer ${
                              m.disliked ? 'text-rose-600 bg-rose-50' : 'hover:text-slate-600'
                            }`}
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5 px-1">{m.time}</span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center space-x-1.5 p-3 bg-white rounded-2xl rounded-bl-none border border-slate-200 w-24">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSendQuery(p.query)}
                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-[10px] rounded-full whitespace-nowrap border border-amber-200 cursor-pointer transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery(input);
              }}
              className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi món ngon, tư vấn quán..."
                className="flex-1 text-xs p-2.5 bg-slate-100 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="p-2.5 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Gemini Live API Key Settings Modal */}
      <GeminiApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
      />
    </>
  );
};
