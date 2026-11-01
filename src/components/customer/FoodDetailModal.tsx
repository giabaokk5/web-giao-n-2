import React, { useState } from 'react';
import { FoodItem, FoodSize, FoodTopping } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Plus, Minus, Check, Heart, Sparkles } from 'lucide-react';

interface FoodDetailModalProps {
  food: FoodItem | null;
  onClose: () => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({ food, onClose }) => {
  const { addToCart } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<FoodSize | undefined>(
    food?.sizes && food.sizes.length > 0 ? food.sizes[0] : undefined
  );
  const [selectedToppings, setSelectedToppings] = useState<FoodTopping[]>([]);
  const [selectedSugar, setSelectedSugar] = useState<string>(
    food?.sugarLevels && food.sugarLevels.length > 0 ? food.sugarLevels[0] : ''
  );
  const [selectedIce, setSelectedIce] = useState<string>(
    food?.iceLevels && food.iceLevels.length > 0 ? food.iceLevels[0] : ''
  );
  const [note, setNote] = useState('');

  if (!food) return null;

  const toggleTopping = (topping: FoodTopping) => {
    if (selectedToppings.some((t) => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter((t) => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const sizeDiff = selectedSize ? selectedSize.priceDiff : 0;
  const toppingsTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const unitPrice = food.price + sizeDiff + toppingsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(food, quantity, {
      size: selectedSize,
      toppings: selectedToppings,
      sugarLevel: selectedSugar || undefined,
      iceLevel: selectedIce || undefined,
      note: note.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
        {/* Top Image & Close Button */}
        <div className="relative h-60 w-full shrink-0">
          <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md backdrop-blur-xs transition-transform hover:scale-110 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            {food.isBestSeller && (
              <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" /> Món Bán Chạy Nhất
              </span>
            )}
            <h2 className="text-xl font-bold leading-tight drop-shadow-sm">{food.name}</h2>
            <div className="flex items-center space-x-3 mt-1 text-xs text-white/90">
              <span className="text-amber-300 font-extrabold text-lg">
                {food.price.toLocaleString('vi-VN')}đ
              </span>
              {food.originalPrice && (
                <span className="line-through text-slate-300 text-sm">
                  {food.originalPrice.toLocaleString('vi-VN')}đ
                </span>
              )}
              <span>• Đã bán {food.soldCount.toLocaleString('vi-VN')}</span>
            </div>
          </div>
        </div>

        {/* Scrollable Customization Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Description */}
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
            {food.description}
          </p>

          {/* Size Options */}
          {food.sizes && food.sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Chọn kích cỡ <span className="text-rose-500">*</span>
                </h4>
                <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-medium">
                  Chọn 1
                </span>
              </div>
              <div className="space-y-2">
                {food.sizes.map((sz) => {
                  const isChecked = selectedSize?.id === sz.id;
                  return (
                    <label
                      key={sz.id}
                      onClick={() => setSelectedSize(sz)}
                      className={`flex items-center justify-between p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                        isChecked
                          ? 'border-amber-400 bg-amber-50/60 font-bold text-slate-900 ring-2 ring-amber-400/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isChecked ? 'border-amber-500 bg-amber-500 text-white' : 'border-slate-300'
                          }`}
                        >
                          {isChecked && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                        </div>
                        <span>{sz.name}</span>
                      </div>
                      <span className="font-semibold text-amber-700">
                        {sz.priceDiff > 0 ? `+${sz.priceDiff.toLocaleString('vi-VN')}đ` : 'Tiêu chuẩn'}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Toppings Multi-select */}
          {food.toppings && food.toppings.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Topping thêm hảo hạng
                </h4>
                <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-medium">
                  Tùy chọn
                </span>
              </div>
              <div className="space-y-2">
                {food.toppings.map((tp) => {
                  const isChecked = selectedToppings.some((t) => t.id === tp.id);
                  return (
                    <label
                      key={tp.id}
                      onClick={() => toggleTopping(tp)}
                      className={`flex items-center justify-between p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                        isChecked
                          ? 'border-amber-400 bg-amber-50/60 font-bold text-slate-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isChecked ? 'border-amber-500 bg-amber-500 text-white' : 'border-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span>{tp.name}</span>
                      </div>
                      <span className="font-semibold text-amber-700">
                        +{tp.price.toLocaleString('vi-VN')}đ
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sugar Level */}
          {food.sugarLevels && food.sugarLevels.length > 0 && (
            <div>
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2">
                Mức đường ngọt
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {food.sugarLevels.map((lvl) => {
                  const isChecked = selectedSugar === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedSugar(lvl)}
                      className={`py-2 px-2 rounded-xl text-center text-xs font-semibold border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ice Level */}
          {food.iceLevels && food.iceLevels.length > 0 && (
            <div>
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2">
                Lượng đá
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {food.iceLevels.map((ice) => {
                  const isChecked = selectedIce === ice;
                  return (
                    <button
                      key={ice}
                      type="button"
                      onClick={() => setSelectedIce(ice)}
                      className={`py-2 px-2 rounded-xl text-center text-xs font-semibold border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {ice}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Notes for restaurant */}
          <div>
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2">
              Ghi chú cho quán
            </h4>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: Ít cay, không hành, lấy thêm chén nước mắm ngọt..."
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-amber-400 outline-none resize-none h-20"
            />
          </div>
        </div>

        {/* Bottom Bar: Stepper & Add to Cart button */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-100 flex items-center justify-between gap-4">
          {/* Stepper */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-700 hover:bg-slate-200 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-extrabold text-slate-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-xl bg-[#FFC700] flex items-center justify-center text-slate-900 font-bold hover:bg-amber-400 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 px-5 bg-[#00204A] hover:bg-[#002e6b] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-blue-900/20 flex items-center justify-between transition-all cursor-pointer"
          >
            <span>Thêm vào giỏ hàng</span>
            <span className="text-amber-300 font-black">
              {totalPrice.toLocaleString('vi-VN')}đ
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

