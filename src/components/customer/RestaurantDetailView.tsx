import React, { useState } from 'react';
import { Restaurant, FoodItem, Branch } from '../../types';
import { useApp } from '../../context/AppContext';
import { FoodDetailModal } from './FoodDetailModal';
import { ReviewModal } from './ReviewModal';
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  ShieldCheck,
  Zap,
  Plus,
  Heart,
  Share2,
  Info,
  CheckCircle2,
  Search,
  Building2,
  Phone,
  MessageSquare,
  AlertTriangle,
  Flame,
  ThumbsUp,
  Camera,
  Check,
  Sparkles,
  Filter,
} from 'lucide-react';

interface RestaurantDetailViewProps {
  restaurant: Restaurant;
  onBack: () => void;
}

export const RestaurantDetailView: React.FC<RestaurantDetailViewProps> = ({ restaurant, onBack }) => {
  const { favorites, toggleFavorite, showToast, setIsCartOpen, cart, cartRestaurant, reviews, likeReview } = useApp();
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchInMenu, setSearchInMenu] = useState('');
  const [showBranchesModal, setShowBranchesModal] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'ALL' | '5_STAR' | 'WITH_PHOTOS'>('ALL');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(
    restaurant.branches?.[0] || null
  );

  const isFav = favorites.includes(restaurant.id);

  // Group menu categories
  const categories = Array.from(new Set(restaurant.menu.map((m) => m.category)));

  // Filtered menu
  const filteredMenu = restaurant.menu.filter((food) => {
    if (activeCategory !== 'all' && food.category !== activeCategory) return false;
    if (searchInMenu.trim()) {
      const q = searchInMenu.toLowerCase();
      return food.name.toLowerCase().includes(q) || food.description.toLowerCase().includes(q);
    }
    return true;
  });

  const cartItemsCount =
    cartRestaurant?.id === restaurant.id
      ? cart.reduce((acc, it) => acc + it.quantity, 0)
      : 0;

  // Filter reviews for this specific restaurant
  const restaurantReviews = reviews.filter(
    (r) => r.restaurantId === restaurant.id || r.restaurantName === restaurant.name
  );

  const displayedReviews = restaurantReviews.filter((r) => {
    if (reviewFilter === '5_STAR') return r.rating === 5;
    if (reviewFilter === 'WITH_PHOTOS') return r.images && r.images.length > 0;
    return true;
  });

  return (
    <div className="min-h-screen pb-24">
      {/* Back Button & Top Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-[38px] z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách quán Đà Nẵng</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleFavorite(restaurant.id)}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isFav ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-white border-slate-200 text-slate-600'
              }`}
              title="Lưu quán yêu thích"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                showToast('Đã sao chép liên kết quán ăn Đà Nẵng!', 'success');
              }}
              className="p-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer"
              title="Chia sẻ quán"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Restaurant Hero Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="relative h-64 sm:h-80 w-full">
            <img
              src={restaurant.coverImage}
              alt={restaurant.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

            {/* Restaurant Info Floating Box */}
            <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src={restaurant.logo}
                  alt={restaurant.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-xl shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80';
                  }}
                />
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="bg-[#FFC700] text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 uppercase">
                      <ShieldCheck className="w-3 h-3" /> Đặc Sản Đà Nẵng Chuẩn Vị
                    </span>
                    {restaurant.hasFreeShip && (
                      <span className="bg-emerald-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-current" /> Freeship 0Đ
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl sm:text-3xl font-black text-white drop-shadow-sm">
                    {restaurant.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-200 mt-0.5 max-w-xl">
                    {restaurant.tagline}
                  </p>
                </div>
              </div>

              {/* Status metrics pill */}
              <div className="bg-black/60 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center space-x-4 text-xs shrink-0">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-amber-400 font-extrabold text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{restaurant.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-300">
                    {restaurant.totalReviews} đánh giá
                  </span>
                </div>
                <div className="w-px h-7 bg-white/20"></div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-white font-bold text-sm">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>{restaurant.deliveryTimeMin} phút</span>
                  </div>
                  <span className="text-[10px] text-slate-300">
                    Cách {restaurant.distanceKm} km
                  </span>
                </div>
                <div className="w-px h-7 bg-white/20"></div>
                <div className="text-center">
                  <div className="text-emerald-400 font-bold text-xs">
                    {restaurant.isOpen ? 'Đang mở cửa' : 'Tạm đóng cửa'}
                  </div>
                  <span className="text-[10px] text-slate-300">{restaurant.openHours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sub banner with address & Branches */}
          <div className="px-6 py-4 bg-amber-50/50 border-t border-amber-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-slate-700">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{restaurant.address}</span>
            </div>

            {restaurant.branches && restaurant.branches.length > 0 && (
              <button
                onClick={() => setShowBranchesModal(!showBranchesModal)}
                className="flex items-center space-x-1 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-full font-bold text-slate-800 text-xs transition-colors cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Xem {restaurant.branches.length} chi nhánh Đà Nẵng</span>
              </button>
            )}

            {restaurant.featuredPromo && (
              <div className="flex items-center space-x-1.5 bg-rose-100 text-rose-800 font-bold px-3 py-1 rounded-full">
                <span>🔥 Ưu đãi hôm nay:</span>
                <span>{restaurant.featuredPromo}</span>
              </div>
            )}
          </div>

          {/* Branches Modal / Popover */}
          {showBranchesModal && restaurant.branches && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in">
              {restaurant.branches.map((br) => (
                <div
                  key={br.id}
                  onClick={() => {
                    setSelectedBranch(br);
                    showToast(`Đã chọn phục vụ từ chi nhánh: ${br.name}`, 'info');
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    selectedBranch?.id === br.id
                      ? 'bg-amber-50 border-amber-400 text-slate-900 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-extrabold text-xs text-slate-900">{br.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{br.address}</div>
                  <div className="text-[10px] text-amber-700 font-bold mt-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {br.phone}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search within Menu & Category Tabs */}
        <div className="mt-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm món trong thực đơn quán này..."
                value={searchInMenu}
                onChange={(e) => setSearchInMenu(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none"
              />
            </div>

            <span className="text-xs text-slate-500 font-semibold">
              Đang hiển thị <strong>{filteredMenu.length}</strong> món ăn
            </span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#00204A] text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Tất cả thực đơn ({restaurant.menu.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#00204A] text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMenu.map((food) => (
            <div
              key={food.id}
              onClick={() => setSelectedFood(food)}
              className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
                    {food.name}
                  </h3>
                  {food.isBestSeller && (
                    <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5 fill-current" /> Bán chạy
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {food.description}
                </p>

                {/* Allergens warning */}
                {food.allergens && food.allergens.length > 0 && (
                  <div className="flex items-center space-x-1 text-[10px] text-amber-700 mt-1.5 font-medium">
                    <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>Có chứa: {food.allergens.join(', ')}</span>
                  </div>
                )}

                <div className="flex items-center space-x-3 mt-2.5">
                  <span className="text-base font-extrabold text-slate-950">
                    {food.price.toLocaleString('vi-VN')}đ
                  </span>
                  {food.originalPrice && (
                    <span className="text-xs line-through text-slate-400">
                      {food.originalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 font-medium">
                    • Đã bán {food.soldCount}
                  </span>
                </div>
              </div>

              {/* Food Image with Add Button */}
              <div className="relative w-28 h-28 shrink-0 rounded-2xl overflow-hidden shadow-xs">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80';
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFood(food);
                  }}
                  className="absolute bottom-2 right-2 p-2 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Reviews & Comments Section */}
        <div className="mt-10 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-lg text-slate-900">
                  Đánh giá & Bình luận từ thực khách ({restaurantReviews.length || restaurant.totalReviews})
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Nhận xét chân thực từ những khách hàng đã đặt món thành công qua BeFood Đà Nẵng
              </p>
            </div>

            {/* Write Review Button */}
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
            >
              <Star className="w-4 h-4 fill-current" />
              <span>Viết Đánh Giá & Bình Luận</span>
            </button>
          </div>

          {/* Rating Summary Bar */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="text-center shrink-0">
                <div className="text-3xl sm:text-4xl font-black text-slate-900">
                  {restaurant.rating}
                </div>
                <div className="flex items-center justify-center text-amber-400 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 font-bold block mt-1">
                  {restaurant.totalReviews} lượt đánh giá
                </span>
              </div>

              <div className="h-12 w-px bg-slate-200 hidden sm:block"></div>

              {/* Quick tags highlight */}
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-full text-slate-700 font-semibold flex items-center gap-1">
                  👍 98% Thực khách khen ngon
                </span>
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-full text-slate-700 font-semibold flex items-center gap-1">
                  ⚡ Giao nhanh 15-20 phút
                </span>
                <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-full text-slate-700 font-semibold flex items-center gap-1">
                  🔥 Đóng gói nóng hổi
                </span>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shrink-0">
              <button
                onClick={() => setReviewFilter('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  reviewFilter === 'ALL'
                    ? 'bg-[#00204A] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất cả ({restaurantReviews.length})
              </button>
              <button
                onClick={() => setReviewFilter('5_STAR')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  reviewFilter === '5_STAR'
                    ? 'bg-[#00204A] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                5 Sao
              </button>
              <button
                onClick={() => setReviewFilter('WITH_PHOTOS')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  reviewFilter === 'WITH_PHOTOS'
                    ? 'bg-[#00204A] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Có ảnh
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {displayedReviews.length > 0 ? (
              displayedReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 sm:p-5 bg-slate-50/70 rounded-2xl border border-slate-200/80 space-y-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={rev.userAvatar}
                        alt={rev.userName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{rev.userName}</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" /> Đã đặt qua BeFood
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{rev.createdAt}</span>
                          {rev.foodName && (
                            <>
                              <span>•</span>
                              <span className="text-amber-800 font-semibold">
                                Món: {rev.foodName}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* Comment text */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    "{rev.comment}"
                  </p>

                  {/* Attached images */}
                  {rev.images && rev.images.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {rev.images.map((imgUrl, idx) => (
                        <img
                          key={idx}
                          src={imgUrl}
                          alt="Review visual"
                          className="w-20 h-20 rounded-xl object-cover ring-1 ring-slate-200 hover:scale-105 transition-transform cursor-pointer shadow-xs"
                        />
                      ))}
                    </div>
                  )}

                  {/* Tags & Like action */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
                    <div className="flex flex-wrap gap-1.5">
                      {rev.tags?.map((t, idx) => (
                        <span
                          key={idx}
                          className="bg-white text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => likeReview(rev.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        rev.isLiked
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-white hover:bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Hữu ích ({rev.likes})</span>
                    </button>
                  </div>

                  {/* Restaurant / Admin Reply */}
                  {rev.reply && (
                    <div className="mt-3 p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-amber-900 text-[11px]">
                        <span>💬 Phản hồi từ: {rev.reply.author}</span>
                        <span className="text-slate-400 font-normal">{rev.reply.date}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed italic">{rev.reply.content}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <p className="text-xs text-slate-400">
                  Chưa có đánh giá nào phù hợp với bộ lọc này.
                </p>
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="text-xs font-bold text-amber-600 hover:underline cursor-pointer"
                >
                  Hãy là người đầu tiên viết đánh giá cho quán!
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        restaurant={restaurant}
      />

      {/* Food Customize Modal */}
      <FoodDetailModal food={selectedFood} onClose={() => setSelectedFood(null)} />

      {/* Floating Bottom Cart Bar */}
      {cartItemsCount > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-lg w-full px-4 animate-in slide-in-from-bottom-5">
          <div
            onClick={() => setIsCartOpen(true)}
            className="bg-[#00204A] text-white p-3.5 sm:p-4 rounded-3xl shadow-2xl flex items-center justify-between cursor-pointer border border-white/20 hover:bg-[#002c66] transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFC700] text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
                {cartItemsCount}
              </div>
              <div>
                <div className="text-xs text-slate-300 font-medium">Giỏ hàng từ quán này</div>
                <div className="text-sm font-extrabold text-amber-300">
                  {cart.reduce((s, it) => s + it.totalPrice, 0).toLocaleString('vi-VN')}đ
                </div>
              </div>
            </div>

            <button className="bg-[#FFC700] text-slate-950 font-black text-xs px-4 py-2 rounded-2xl shadow-md hover:bg-amber-400 transition-colors cursor-pointer">
              Xem giỏ hàng →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
