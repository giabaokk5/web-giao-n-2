import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Restaurant, FoodItem } from '../../types';
import {
  Scale,
  Search,
  Star,
  Clock,
  MapPin,
  X,
  ExternalLink,
  Zap,
  TrendingDown,
  Sparkles,
} from 'lucide-react';

interface PriceCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PriceCompareModal: React.FC<PriceCompareModalProps> = ({ isOpen, onClose }) => {
  const { restaurants, setActiveRestaurant } = useApp();

  const [compareKeyword, setCompareKeyword] = useState('Trà sữa');

  if (!isOpen) return null;

  const sampleKeywords = ['Trà sữa', 'Cơm tấm', 'Gà rán', 'Canh chua'];

  // Collect matching dishes from all restaurants
  const matches: { food: FoodItem; restaurant: Restaurant }[] = [];
  restaurants.forEach((r) => {
    r.menu.forEach((f) => {
      if (
        f.name.toLowerCase().includes(compareKeyword.toLowerCase()) ||
        f.category.toLowerCase().includes(compareKeyword.toLowerCase())
      ) {
        matches.push({ food: f, restaurant: r });
      }
    });
  });

  // Sort by price ascending
  matches.sort((a, b) => a.food.price - b.food.price);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="px-6 py-4 bg-[#00204A] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#FFC700] text-slate-950 rounded-2xl shadow-md">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">So Sánh Giá Món Ăn Liên Quán</h3>
              <p className="text-xs text-slate-300">Tìm nơi bán rẻ nhất, gần nhất và đánh giá cao nhất</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Suggestions */}
        <div className="p-5 border-b border-slate-100 space-y-3 bg-slate-50">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Nhập tên món ăn muốn so sánh giá..."
              value={compareKeyword}
              onChange={(e) => setCompareKeyword(e.target.value)}
              className="flex-1 text-xs p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 font-medium"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-400">Gợi ý so sánh:</span>
            {sampleKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => setCompareKeyword(kw)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  compareKeyword === kw
                    ? 'bg-amber-400 text-slate-950 border-amber-500'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Results Comparison List */}
        <div className="p-5 overflow-y-auto space-y-3 text-xs flex-1">
          {matches.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              Không tìm thấy món ăn nào tương tự với từ khóa "{compareKeyword}".
            </div>
          ) : (
            matches.map((item, idx) => {
              const isBestPrice = idx === 0;
              return (
                <div
                  key={`${item.restaurant.id}-${item.food.id}`}
                  className={`p-4 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isBestPrice
                      ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-400/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={item.food.image}
                      alt={item.food.name}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h4 className="font-bold text-slate-900 text-xs">{item.food.name}</h4>
                        {isBestPrice && (
                          <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                            <TrendingDown className="w-3 h-3" /> Giá tốt nhất
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-600 font-semibold mt-0.5">
                        {item.restaurant.name}
                      </div>
                      <div className="flex items-center space-x-3 text-[10px] text-slate-400 mt-1">
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-current mr-0.5" />
                          {item.restaurant.rating}
                        </span>
                        <span>• {item.restaurant.distanceKm} km</span>
                        <span>• Giao {item.restaurant.deliveryTimeMin}p</span>
                        {item.restaurant.hasFreeShip && (
                          <span className="text-emerald-600 font-bold">Freeship 0đ</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <div className="text-right">
                      <span className="text-base font-black text-slate-950">
                        {item.food.price.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setActiveRestaurant(item.restaurant);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <span>Xem quán</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

