import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodItem, Restaurant } from '../../types';
import {
  Mic,
  Camera,
  X,
  Sparkles,
  Bot,
  Search,
  Check,
  ShoppingBag,
  ExternalLink,
  Flame,
} from 'lucide-react';

interface VoiceImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'voice' | 'image';
}

export const VoiceImageSearchModal: React.FC<VoiceImageSearchModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'voice',
}) => {
  const { restaurants, setSearchQuery, setActiveRestaurant, addToCart, showToast } = useApp();

  const [mode, setMode] = useState<'voice' | 'image'>(initialMode);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [imageResult, setImageResult] = useState<{
    dishName: string;
    calories: number;
    description: string;
    matchedFood?: FoodItem;
    matchedRestaurant?: Restaurant;
  } | null>(null);

  if (!isOpen) return null;

  // Voice Search simulation
  const handleStartListening = () => {
    setIsListening(true);
    setTranscript('Đang lắng nghe giọng nói của bạn...');

    setTimeout(() => {
      const sampleQueries = [
        'Tìm Mì Quảng ếch Bà Mua',
        'Tìm bánh tráng cuốn thịt heo 2 đầu da',
        'Tìm bún chả cá Hờn 113A',
        'Tìm chè sầu riêng Liên Đà Nẵng',
        'Tìm hải sản Bé Mặn Mỹ Khê',
      ];
      const picked = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
      setTranscript(picked);
      setIsListening(false);

      setTimeout(() => {
        setSearchQuery(picked.replace('Tìm ', ''));
        showToast(`Đã tìm kiếm: "${picked}"`, 'success');
        onClose();
        setTimeout(() => {
          const el = document.getElementById('restaurant-listing');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }, 900);
    }, 1800);
  };

  // Gemini Image recognition simulation with authentic Da Nang specialty dishes
  const handleAnalyzePreset = (preset: 'banh_trang' | 'mi_quang' | 'che_sau') => {
    setIsAnalyzingImage(true);
    setImageResult(null);

    setTimeout(() => {
      setIsAnalyzingImage(false);
      if (preset === 'banh_trang') {
        const matchedRes = restaurants.find((r) => r.id === 'res-dacsan-tran') || restaurants[1];
        const matchedFood = matchedRes?.menu?.[0] || restaurants[0].menu[0];
        setImageResult({
          dishName: 'Bánh Tráng Cuốn Thịt Heo 2 Đầu Da Luộc',
          calories: 520,
          description: 'Món đặc sản Đà Nẵng trứ danh - Thịt heo hai đầu da luộc chuẩn tỉ lệ mỡ nạc, cuốn kèm rau rừng và chấm mắm nêm đậm vị.',
          matchedFood,
          matchedRestaurant: matchedRes,
        });
      } else if (preset === 'mi_quang') {
        const matchedRes = restaurants.find((r) => r.id === 'res-bamuamiquang') || restaurants[0];
        const matchedFood = matchedRes?.menu?.[0] || restaurants[0].menu[0];
        setImageResult({
          dishName: 'Mì Quảng Gà Ta Rút Xương & Trứng Cút',
          calories: 480,
          description: 'Sợi mì gạo mềm dai trứ danh xứ Quảng, nước nhưn gà ta rim nghệ vàng ươm đậm đà, ăn kèm bánh tráng mè nướng giòn rụm.',
          matchedFood,
          matchedRestaurant: matchedRes,
        });
      } else {
        const matchedRes = restaurants.find((r) => r.id === 'res-chesaulien') || restaurants[3];
        const matchedFood = matchedRes?.menu?.[0] || restaurants[0].menu[0];
        setImageResult({
          dishName: 'Chè Thái Sầu Riêng Cô Liên Bestseller',
          calories: 360,
          description: 'Cơm sầu riêng Ri6 tươi dầm sữa béo thơm nức mũi, hạt lựu, mít ngọt, thạch trân châu lá dứa thơm ngon nức tiếng.',
          matchedFood,
          matchedRestaurant: matchedRes,
        });
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
        {/* Header Tabs */}
        <div className="bg-[#00204A] text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMode('voice')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'voice' ? 'bg-[#FFC700] text-slate-950 font-black' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Tìm bằng giọng nói</span>
            </button>
            <button
              onClick={() => setMode('image')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'image' ? 'bg-[#FFC700] text-slate-950 font-black' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Gemini AI Vision</span>
            </button>
          </div>

          <button onClick={onClose} className="p-1 rounded-full text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-xs overflow-y-auto space-y-5">
          {mode === 'voice' ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div
                onClick={handleStartListening}
                className={`w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white ring-8 ring-rose-400/30 scale-110 animate-pulse'
                    : 'bg-amber-400 text-slate-950 hover:bg-amber-500 shadow-xl shadow-amber-400/30'
                }`}
              >
                <Mic className="w-10 h-10" />
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {isListening ? 'Đang lắng nghe...' : 'Nhấn vào micro để nói'}
                </h4>
                <p className="text-slate-400 text-xs mt-1 max-w-xs">
                  Ví dụ: "Tìm cơm tấm sườn nướng", "Tìm trà sữa phúc long"...
                </p>
              </div>

              {transcript && (
                <div className="p-3 bg-amber-50 text-amber-950 font-bold rounded-2xl border border-amber-200 text-xs animate-in fade-in">
                  "{transcript}"
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
                <span className="font-bold text-slate-800 block">
                  Gemini Vision AI - Nhận diện món ăn qua hình ảnh
                </span>
                <p className="text-slate-500 text-[11px]">
                  Tải lên ảnh hoặc chọn mẫu thử để AI phân tích tên món, calo và tìm quán đang bán:
                </p>

                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={() => handleAnalyzePreset('banh_trang')}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:border-amber-400 rounded-xl font-bold text-slate-700 cursor-pointer text-xs flex items-center gap-1 shadow-2xs hover:bg-amber-50"
                  >
                    🥓 Bánh tráng cuốn
                  </button>
                  <button
                    onClick={() => handleAnalyzePreset('mi_quang')}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:border-amber-400 rounded-xl font-bold text-slate-700 cursor-pointer text-xs flex items-center gap-1 shadow-2xs hover:bg-amber-50"
                  >
                    🍜 Mì Quảng
                  </button>
                  <button
                    onClick={() => handleAnalyzePreset('che_sau')}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:border-amber-400 rounded-xl font-bold text-slate-700 cursor-pointer text-xs flex items-center gap-1 shadow-2xs hover:bg-amber-50"
                  >
                    🍨 Chè Sầu Liên
                  </button>
                </div>
              </div>

              {isAnalyzingImage && (
                <div className="p-8 text-center space-y-2">
                  <Bot className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
                  <div className="font-bold text-slate-800">Gemini AI đang phân tích hình ảnh...</div>
                  <span className="text-[11px] text-slate-400">Đang tra cứu cơ sở dữ liệu ẩm thực</span>
                </div>
              )}

              {imageResult && (
                <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 space-y-3 animate-in fade-in">
                  <div className="flex items-center space-x-1.5 text-amber-800 font-extrabold text-[11px]">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>KẾT QUẢ PHÂN TÍCH GEMINI AI</span>
                  </div>

                  <div>
                    <h3 className="font-black text-sm text-slate-900">{imageResult.dishName}</h3>
                    <p className="text-slate-600 text-xs mt-0.5">{imageResult.description}</p>
                    <div className="flex items-center space-x-3 mt-1.5 text-[11px] text-slate-500">
                      <span className="font-bold text-rose-600">🔥 ~{imageResult.calories} Kcal</span>
                      {imageResult.matchedRestaurant && (
                        <span>• Có tại: <strong className="text-slate-900">{imageResult.matchedRestaurant.name}</strong></span>
                      )}
                    </div>
                  </div>

                  {imageResult.matchedFood && imageResult.matchedRestaurant && (
                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => {
                          addToCart(imageResult.matchedFood!, 1, {
                            size: imageResult.matchedFood?.sizes?.[0],
                            toppings: [],
                          });
                          onClose();
                        }}
                        className="flex-1 py-2 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Thêm vào giỏ ({imageResult.matchedFood.price.toLocaleString('vi-VN')}đ)</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

