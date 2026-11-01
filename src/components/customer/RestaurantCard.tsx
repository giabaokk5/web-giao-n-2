// src/components/customer/RestaurantCard.tsx
import React from 'react';
import { Restaurant, FoodItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { Star, Clock, MapPin, Heart, ShieldCheck, Zap, ChevronRight, Plus } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
  onSelectFood?: (food: FoodItem) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onClick,
  onSelectFood,
}) => {
  const { favorites, toggleFavorite, addToCart } = useApp();
  const isFav = favorites.includes(restaurant.id);

  // Take top 2 dishes from menu
  const featuredDishes = restaurant.menu ? restaurant.menu.slice(0, 2) : [];
  const extraDishesCount = Math.max(0, (restaurant.menu?.length || 0) - 2);

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Cover Image & Badges */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>

          {/* Favorite toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(restaurant.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 cursor-pointer ${
              isFav
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white/80 hover:bg-white text-slate-700'
            }`}
            title={isFav ? 'Bỏ yêu thích' : 'Lưu quán yêu thích'}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
          </button>

          {/* Freeship & Promo Tags */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            {restaurant.hasFreeShip && (
              <span className="bg-[#FFC700] text-[#00204A] font-black text-[10px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Zap className="w-3 h-3 fill-current" />
                FREESHIP 0Đ
              </span>
            )}
            {restaurant.featuredPromo && (
              <span className="bg-rose-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-md line-clamp-1 max-w-[200px]">
                {restaurant.featuredPromo}
              </span>
            )}
          </div>

          {/* ETA & Distance Pill */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
            <div className="flex items-center space-x-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{restaurant.deliveryTimeMin} phút</span>
              <span className="text-white/50">•</span>
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{restaurant.distanceKm} km</span>
            </div>

            <div className="flex items-center space-x-1 bg-[#FFC700] text-slate-950 px-2 py-0.5 rounded-full font-black text-xs shadow-xs">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{restaurant.rating}</span>
              <span className="text-[10px] font-normal text-slate-800">
                ({restaurant.totalReviews})
              </span>
            </div>
          </div>
        </div>

        {/* Body Info */}
        <div className="p-4 space-y-2">
          <div>
            <div className="flex items-center space-x-1.5 mb-1">
              {restaurant.isVerified && (
                <span className="text-amber-500 shrink-0" title="Quán ngon beFood tuyển chọn">
                  <ShieldCheck className="w-4 h-4 fill-amber-100" />
                </span>
              )}
              <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-amber-600 transition-colors">
                {restaurant.name}
              </h3>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">{restaurant.tagline}</p>
          </div>

          {/* Address and Main Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
            <span className="truncate max-w-[190px] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              {restaurant.address}
            </span>
            <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md shrink-0">
              {restaurant.categories[0]}
            </span>
          </div>

          {/* Featured Dishes Mini List - SHOWING REAL FOOD ON THE CARD */}
          {featuredDishes.length > 0 && (
            <div className="pt-2 border-t border-dashed border-slate-200/80 space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Món ngon nổi bật:</span>
                {extraDishesCount > 0 && (
                  <span className="text-amber-600 font-semibold hover:underline">
                    +{extraDishesCount} món khác
                  </span>
                )}
              </div>

              {featuredDishes.map((dish) => (
                <div
                  key={dish.id}
                  onClick={(e) => {
                    if (onSelectFood) {
                      e.stopPropagation();
                      onSelectFood(dish);
                    }
                  }}
                  className="flex items-center justify-between bg-slate-50 hover:bg-amber-50/70 p-1.5 rounded-xl transition-colors group/dish"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-200"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-800 truncate group-hover/dish:text-amber-700">
                        {dish.name}
                      </div>
                      {dish.originalPrice && (
                        <span className="text-[10px] text-slate-400 line-through mr-1">
                          {dish.originalPrice.toLocaleString('vi-VN')}đ
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                    <span className="text-xs font-black text-amber-600">
                      {dish.price.toLocaleString('vi-VN')}đ
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(dish, 1, { toppings: [] });
                      }}
                      className="p-1 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold transition-transform active:scale-90"
                      title="Thêm ngay vào giỏ"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Bar */}
      <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-500">
          Giao từ <span className="font-semibold text-slate-700">{restaurant.minOrderPrice.toLocaleString('vi-VN')}đ</span>
        </span>
        <span className="text-amber-600 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
          Xem menu <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
