import React from 'react';
import { Plus, Star, Store, Sparkles, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface FoodRecommendationItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  restaurantId: string;
  restaurantName: string;
  rating?: number;
  matchReason?: string;
}

interface FoodRecommendationCardProps {
  item: FoodRecommendationItem;
  onAddToCart?: (item: FoodRecommendationItem) => void;
}

export const FoodRecommendationCard: React.FC<FoodRecommendationCardProps> = ({
  item,
  onAddToCart,
}) => {
  const { addToCart, showToast, playNotificationSound } = useApp();
  const [added, setAdded] = React.useState(false);

  const handleAdd = () => {
    // Construct cart item compatible with AppContext
    addToCart(
      {
        id: item.id,
        restaurantId: item.restaurantId,
        name: item.name,
        description: item.description,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
        category: 'Gợi ý AI',
        isBestSeller: true,
        isAvailable: true,
        soldCount: 100,
        likesCount: 50,
      },
      1,
      { toppings: [] }
    );

    setAdded(true);
    playNotificationSound();
    showToast(`Đã thêm "${item.name}" vào giỏ hàng BeFood!`, 'success');
    if (onAddToCart) onAddToCart(item);

    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group">
      {/* Food Image with Badges */}
      <div className="relative h-28 w-full overflow-hidden bg-slate-100">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {item.originalPrice && item.originalPrice > item.price && (
          <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
            -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
          </span>
        )}
        <span className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400 fill-current" /> {item.rating || 4.9}
        </span>
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold truncate">
            <Store className="w-3 h-3 text-amber-500 shrink-0" />
            <span className="truncate">{item.restaurantName}</span>
          </div>

          <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1 mt-0.5" title={item.name}>
            {item.name}
          </h4>

          {item.matchReason && (
            <div className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md mt-1 font-medium flex items-center gap-1 line-clamp-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-500 shrink-0" />
              <span>{item.matchReason}</span>
            </div>
          )}
        </div>

        {/* Price & Add to Cart button */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <div>
            <span className="font-black text-xs text-slate-950">
              {item.price.toLocaleString('vi-VN')}đ
            </span>
            {item.originalPrice && (
              <span className="text-[10px] text-slate-400 line-through ml-1">
                {item.originalPrice.toLocaleString('vi-VN')}đ
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-xs'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3 h-3" /> Đã thêm
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" /> Thêm món
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
