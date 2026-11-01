// src/components/customer/CustomerHome.tsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MOCK_CATEGORIES,
  MOCK_FLASH_DEALS,
  MOCK_BEST_SELLERS,
  MOCK_CLAIMABLE_VOUCHERS,
  CATEGORY_KEYWORDS,
  matchRestaurantCategory,
  getMatchingDishesForCategory,
} from '../../data/mockData';
import { RestaurantCard } from './RestaurantCard';
import { FoodDetailModal } from './FoodDetailModal';
import { Pagination } from '../common/Pagination';
import { EmptyState } from '../common/EmptyState';
import { DaNangLandmark, FoodItem } from '../../types';
import {
  Zap,
  Flame,
  Clock,
  Filter,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  ShieldCheck,
  Percent,
  MapPin,
  Compass,
  Star,
  Plus,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Ticket,
  Utensils,
  Award,
  Search,
} from 'lucide-react';

export const CustomerHome: React.FC = () => {
  const {
    restaurants,
    setActiveRestaurant,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    setSearchQuery,
    currentAddress,
    setIsAddressModalOpen,
    addToCart,
    showToast,
  } = useApp();

  // Filters & State
  const [filterType, setFilterType] = useState<'all' | 'nearby' | 'high_rating' | 'freeship'>('all');
  const [selectedLandmark, setSelectedLandmark] = useState<DaNangLandmark>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [isTouristMode, setIsTouristMode] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'distance' | 'rating'>('recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Counts for quick filters & districts
  const countNearby = restaurants.filter((r) => r.distanceKm <= 3.5).length;
  const countHighRating = restaurants.filter((r) => r.rating >= 4.8).length;
  const countFreeship = restaurants.filter((r) => r.hasFreeShip).length;

  const countByDistrict = (dName: string) => {
    if (dName === 'ALL') return restaurants.length;
    return restaurants.filter((r) => r.district === dName).length;
  };

  const topBrands = restaurants.filter((r) =>
    [
      'res-bamuamiquang',
      'res-dacsan-tran',
      'res-bunchacahon',
      'res-chesaulien',
      'res-beman-seafood',
      'res-pizza4ps-danang',
      'res-phuclong-danang',
      'res-kfc-danang',
      'res-banhxeobaduong',
      'res-banhmi-balan',
      'res-bunmam-dicuc',
      'res-tocotoco-danang',
    ].includes(r.id)
  );

  // Meal time tab for "Hôm Nay Ăn Gì?"
  const [mealTab, setMealTab] = useState<'BREAKFAST' | 'LUNCH' | 'SNACK' | 'DINNER'>('LUNCH');

  // Claimed vouchers set
  const [claimedVouchers, setClaimedVouchers] = useState<string[]>(['FREESHIP0D']);

  // Selected food for customization modal
  const [selectedFoodForModal, setSelectedFoodForModal] = useState<FoodItem | null>(null);

  // Flash sale countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 3, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Claim voucher handler
  const handleClaimVoucher = (code: string) => {
    if (claimedVouchers.includes(code)) {
      showToast(`Mã ${code} đã có trong ví ưu đãi của bạn!`, 'info');
      return;
    }
    setClaimedVouchers([...claimedVouchers, code]);
    showToast(`Đã lưu mã ${code} vào ví thành công!`, 'success');
  };

  // Find food item object from ID to open modal or add to cart
  const handleSelectFoodById = (restaurantId: string, foodId: string) => {
    const res = restaurants.find((r) => r.id === restaurantId);
    if (res) {
      const food = res.menu.find((f) => f.id === foodId);
      if (food) {
        setSelectedFoodForModal(food);
        return;
      }
    }
    // Fallback: search across all restaurants
    for (const r of restaurants) {
      const found = r.menu.find((f) => f.id === foodId);
      if (found) {
        setSelectedFoodForModal(found);
        return;
      }
    }
  };

  // Direct add to cart for simple 1-click buttons
  const handleDirectAddToCart = (restaurantId: string, foodId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const res = restaurants.find((r) => r.id === restaurantId);
    if (res) {
      const food = res.menu.find((f) => f.id === foodId);
      if (food) {
        addToCart(food, 1, { toppings: [] });
        return;
      }
    }
    for (const r of restaurants) {
      const found = r.menu.find((f) => f.id === foodId);
      if (found) {
        addToCart(found, 1, { toppings: [] });
        return;
      }
    }
  };

  // Top Featured Signature Dishes for Gia Bảo Food Hero Showcase
  const HERO_DISHES = [
    {
      id: 'hero-1',
      name: 'Mì Quảng Tôm Thịt & Trứng Cút',
      restaurantName: 'Mì Quảng Bà Mua - Đặc Sản Đà Nẵng',
      price: 35000,
      originalPrice: 55000,
      discount: '-36%',
      rating: 4.96,
      reviews: '2.4k',
      deliveryTime: '18 phút',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&auto=format&fit=crop&q=80',
      tag: '🔥 MÓN NỔI BẬT XỨ QUẢNG',
      restaurantId: 'res-bamuamiquang',
      badgeColor: 'bg-amber-400 text-slate-950',
    },
    {
      id: 'hero-2',
      name: 'Bánh Tráng Cuốn Thịt Heo 2 Đầu Da Luộc',
      restaurantName: 'Đặc Sản Trần - Lê Duẩn',
      price: 69000,
      originalPrice: 99000,
      discount: '-30%',
      rating: 4.97,
      reviews: '1.9k',
      deliveryTime: '22 phút',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&auto=format&fit=crop&q=80',
      tag: '⭐ ĐẶC SẢN NỨC TIẾNG',
      restaurantId: 'res-dacsan-tran',
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'hero-3',
      name: 'Mâm Hải Sản Biển Tươi Sống Hấp Sả Ớt',
      restaurantName: 'Hải Sản Bé Mặn - Biển Mỹ Khê',
      price: 185000,
      originalPrice: 250000,
      discount: '-26%',
      rating: 4.95,
      reviews: '3.1k',
      deliveryTime: '25 phút',
      image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=900&auto=format&fit=crop&q=80',
      tag: '🦞 TƯƠI SỐNG MỖI NGÀY',
      restaurantId: 'res-beman-seafood',
      badgeColor: 'bg-blue-500 text-white',
    },
    {
      id: 'hero-4',
      name: 'Chè Thái Sầu Riêng Đặc Biệt Cô Liên',
      restaurantName: 'Chè Sầu Liên - Hoàng Diệu',
      price: 28000,
      originalPrice: 42000,
      discount: '-33%',
      rating: 4.98,
      reviews: '4.5k',
      deliveryTime: '15 phút',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=900&auto=format&fit=crop&q=80',
      tag: '🍨 MÓN TRÁNG MIỆNG QUỐC DÂN',
      restaurantId: 'res-chesaulien',
      badgeColor: 'bg-purple-500 text-white',
    },
  ];

  const [activeHeroDish, setActiveHeroDish] = useState(HERO_DISHES[0]);

  // Category switch handler with automatic smooth scroll and filter reset
  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
    // Reset district and quick filter if category is selected so user always sees full results
    if (selectedDistrict !== 'ALL') setSelectedDistrict('ALL');
    if (filterType !== 'all') setFilterType('all');
    if (isTouristMode) setIsTouristMode(false);

    // Smooth scroll down to listing
    setTimeout(() => {
      const el = document.getElementById('restaurant-listing');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const currentCategoryObj = MOCK_CATEGORIES.find((c) => c.id === selectedCategory);
  const matchedCategoryDishes = getMatchingDishesForCategory(restaurants, selectedCategory);

  // Filter restaurants
  let filtered = restaurants.filter((res) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = res.name.toLowerCase().includes(q);
      const matchAddress = res.address.toLowerCase().includes(q);
      const matchTagline = res.tagline.toLowerCase().includes(q);
      const matchCategory = res.categories.some((c) => c.toLowerCase().includes(q));
      const matchFood = res.menu.some(
        (f) => f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)
      );
      if (!matchName && !matchAddress && !matchTagline && !matchCategory && !matchFood) {
        return false;
      }
    }

    // Category match with intelligent semantic keywords
    if (selectedCategory !== 'cat-all') {
      if (!matchRestaurantCategory(res, selectedCategory)) {
        return false;
      }
    }

    // Landmark filter in Da Nang
    if (selectedLandmark !== 'ALL' && res.landmark !== selectedLandmark) {
      return false;
    }

    // District filter
    if (selectedDistrict !== 'ALL' && res.district !== selectedDistrict) {
      return false;
    }

    // Tourist mode (Prioritize top specialty restaurants)
    if (
      isTouristMode &&
      !res.categories.includes('Đặc Sản Đà Nẵng') &&
      !res.categories.includes('Hải Sản Biển Mỹ Khê') &&
      !res.categories.includes('Chè Sầu Liên & Tráng Miệng')
    ) {
      return false;
    }

    // Quick filters - Note: High rating threshold is set to 4.7+ so all top restaurants are visible!
    if (filterType === 'nearby' && res.distanceKm > 3.5) return false;
    if (filterType === 'high_rating' && res.rating < 4.7) return false;
    if (filterType === 'freeship' && !res.hasFreeShip) return false;

    return true;
  });

  // Sort
  if (sortBy === 'distance') {
    filtered = [...filtered].sort((a, b) => a.distanceKm - b.distanceKm);
  } else if (sortBy === 'rating') {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  }

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const pagedRestaurants = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Total dishes count across all restaurants
  const totalFoodCount = restaurants.reduce((sum, r) => sum + (r.menu?.length || 0), 0);

  // Filter dishes matching search query if active
  const searchDishes = searchQuery.trim()
    ? restaurants.flatMap((r) =>
        r.menu
          .filter(
            (f) =>
              f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              f.category.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((f) => ({ ...f, restaurantName: r.name, restaurantDistance: r.distanceKm }))
      )
    : [];

  // Filter dishes for "Hôm Nay Ăn Gì?"
  const allDishes = restaurants.flatMap((r) =>
    r.menu.map((food) => ({ ...food, restaurantName: r.name, restaurantDistance: r.distanceKm }))
  );

  const mealTabDishes = allDishes
    .filter((f) => {
      if (mealTab === 'BREAKFAST') {
        return (
          f.mealTime?.includes('BREAKFAST') ||
          f.category.includes('Bún') ||
          f.category.includes('Mì Quảng') ||
          f.category.includes('Bánh Mì')
        );
      }
      if (mealTab === 'LUNCH') {
        return (
          f.mealTime?.includes('LUNCH') ||
          f.category.includes('Cơm') ||
          f.category.includes('Bánh Tráng') ||
          f.category.includes('Mì')
        );
      }
      if (mealTab === 'SNACK') {
        return (
          f.mealTime?.includes('ALL_DAY') ||
          f.category.includes('Trà Sữa') ||
          f.category.includes('Chè') ||
          f.category.includes('Ăn Vặt') ||
          f.category.includes('Tráng Miệng')
        );
      }
      if (mealTab === 'DINNER') {
        return (
          f.mealTime?.includes('DINNER') ||
          f.category.includes('Hải Sản') ||
          f.category.includes('Mực') ||
          f.category.includes('Lẩu') ||
          f.category.includes('Bánh Xèo') ||
          f.category.includes('Pizza')
        );
      }
      return true;
    })
    .slice(0, 4);

  return (
    <div className="space-y-10 pb-24">
      {/* 1. Hero Promotional Banner Carousel */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#00204A] via-[#082855] to-[#001736] text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/10 mx-4 sm:mx-6 lg:mx-8 mt-4">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-yellow-400/15 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Branding, Title, Voucher & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-gradient-to-r from-[#FFC700] via-amber-400 to-[#FFB700] text-slate-950 font-black text-xs px-3.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-amber-300">
                <Sparkles className="w-3.5 h-3.5 fill-current text-slate-950" />
                Gia Bảo Food Đà Nẵng 2026
              </span>
              <span className="bg-amber-400/15 border border-amber-400/30 text-amber-300 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Sàn Ẩm Thực Đà Nẵng Uy Tín
              </span>
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="inline-flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 text-xs font-semibold text-amber-300 transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="max-w-[180px] truncate">
                  Giao đến: {currentAddress.detail}, {currentAddress.district}
                </span>
                <span className="underline ml-1 text-white font-bold">Đổi</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Vạn món ngon Đà Nẵng, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC700] via-yellow-300 to-amber-200">
                Gia Bảo Food khao tiệc giảm đến 50%!
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
              Thưởng thức hơn 95+ món ăn đặc sản Sông Hàn chuẩn vị cùng <strong className="text-amber-300 font-extrabold">Gia Bảo Food</strong>: Mì Quảng Bà Mua, Bánh tráng cuốn thịt heo 2 đầu da, Hải sản tươi sống Bé Mặn Mỹ Khê, Bún chả cá Hờn, Chè sầu Liên... Đội ngũ Shipper BeBike giao nóng giòn tận cửa trong 20 phút.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1 text-xs font-semibold">
              <div className="flex items-center space-x-1.5 bg-black/40 px-3.5 py-2 rounded-xl border border-white/10 shadow-xs">
                <Zap className="w-4 h-4 text-amber-400 fill-current" />
                <span>Giao trực tiếp 1 đơn 1 xế Be</span>
              </div>
              <button
                onClick={() => handleClaimVoucher('GIABAO50')}
                className="flex items-center space-x-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 px-3.5 py-2 rounded-xl border border-amber-400/40 transition-colors cursor-pointer"
                title="Bấm để lưu mã giảm giá 50%"
              >
                <Percent className="w-4 h-4 text-emerald-400" />
                <span>Mã <strong className="text-white underline">GIABAO50</strong> giảm 50%</span>
              </button>
              <button
                onClick={() => setIsTouristMode(!isTouristMode)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                  isTouristMode
                    ? 'bg-[#FFC700] text-slate-950 font-black border-amber-300 shadow-lg scale-105'
                    : 'bg-white/10 text-amber-300 border-white/20 hover:bg-white/20'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>{isTouristMode ? 'Đang bật Chế độ Du Khách 🌟' : 'Bật Chế độ Du Khách 🏖️'}</span>
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('restaurant-listing');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="px-5 py-2.5 bg-[#FFC700] hover:bg-amber-400 text-[#00204A] font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-amber-400/20 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
              >
                <Utensils className="w-4 h-4 text-[#00204A]" />
                <span>Khám phá 95+ Quán Ngon Đà Nẵng</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const targetRes = restaurants.find((r) => r.id === activeHeroDish.restaurantId);
                  if (targetRes) setActiveRestaurant(targetRes);
                }}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl border border-white/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <span className="truncate max-w-[180px]">Quán: {activeHeroDish.restaurantName}</span>
                <ChevronRight className="w-4 h-4 text-amber-400 shrink-0" />
              </button>
            </div>
          </div>

          {/* Right Column: Hero Food Visual Showcase (5 cols) */}
          <div className="lg:col-span-5 relative">
            {/* Ambient Dish Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-400/20 rounded-3xl blur-2xl transform scale-95"></div>

            {/* Main Showcase Dish Card */}
            <div className="relative group bg-slate-900/80 backdrop-blur-md rounded-3xl border-2 border-white/20 overflow-hidden shadow-2xl transition-all duration-300 hover:border-amber-400/60">
              {/* Dish Photo */}
              <div className="relative h-60 sm:h-64 w-full overflow-hidden bg-slate-800">
                <img
                  src={activeHeroDish.image}
                  alt={activeHeroDish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                {/* Top Badge: Food Tag */}
                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 ${activeHeroDish.badgeColor}`}>
                    {activeHeroDish.tag}
                  </span>
                </div>

                {/* Top Right: Discount Pill */}
                <div className="absolute top-3 right-3">
                  <span className="bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md animate-pulse">
                    GIẢM {activeHeroDish.discount}
                  </span>
                </div>

                {/* Delivery Time Pill */}
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-amber-300 border border-white/20 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{activeHeroDish.deliveryTime}</span>
                </div>
              </div>

              {/* Dish Details Card Content */}
              <div className="p-4 sm:p-5 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-amber-400 font-bold truncate max-w-[200px]">
                      {activeHeroDish.restaurantName}
                    </span>
                    <span className="text-amber-300 font-bold flex items-center gap-1 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                      {activeHeroDish.rating} ({activeHeroDish.reviews})
                    </span>
                  </div>
                  <h3 className="font-black text-white text-base sm:text-lg line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {activeHeroDish.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[#FFC700] font-black text-xl">
                      {activeHeroDish.price.toLocaleString('vi-VN')}₫
                    </span>
                    <span className="text-slate-400 text-xs line-through">
                      {activeHeroDish.originalPrice.toLocaleString('vi-VN')}₫
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const targetRes = restaurants.find((r) => r.id === activeHeroDish.restaurantId);
                      if (targetRes) {
                        setActiveRestaurant(targetRes);
                        showToast(`Đang mở thực đơn ${activeHeroDish.restaurantName}`, 'info');
                      }
                    }}
                    className="px-3.5 py-1.5 bg-[#FFC700] hover:bg-amber-400 text-[#00204A] font-black text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Đặt Món Ngay</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Thumbnail Selector (4 Dishes) */}
            <div className="mt-3 bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-white/10 flex items-center justify-between gap-1.5">
              <span className="text-[10px] font-bold text-amber-300/80 px-2 uppercase tracking-wider hidden sm:inline">
                Món hot:
              </span>
              <div className="flex items-center gap-1.5 flex-1 justify-around">
                {HERO_DISHES.map((dish) => {
                  const isActive = activeHeroDish.id === dish.id;
                  return (
                    <button
                      key={dish.id}
                      onClick={() => setActiveHeroDish(dish)}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#FFC700] text-slate-950 shadow-md ring-2 ring-white/60 scale-105'
                          : 'bg-white/10 hover:bg-white/20 text-slate-300'
                      }`}
                      title={dish.name}
                    >
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-5 h-5 rounded-lg object-cover"
                      />
                      <span className="max-w-[70px] truncate text-[11px]">
                        {dish.name.split(' ')[0]} {dish.name.split(' ')[1]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Claimable Vouchers Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Ticket className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Kho Mã Giảm Giá Gia Bảo Food Đà Nẵng
            </h3>
          </div>
          <span className="text-xs text-slate-400">Nhấn để lưu mã vào ví</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {MOCK_CLAIMABLE_VOUCHERS.map((v) => {
            const isClaimed = claimedVouchers.includes(v.code);
            return (
              <div
                key={v.id}
                onClick={() => handleClaimVoucher(v.code)}
                className="group relative bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-3.5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                <div
                  className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-r ${v.color}`}
                ></div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      {v.tag}
                    </span>
                    <span className="font-mono text-xs font-black text-slate-800">
                      {v.code}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                    {v.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{v.desc}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-dashed border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-medium">Đơn toàn TP</span>
                  <span
                    className={`font-bold flex items-center gap-1 ${
                      isClaimed ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {isClaimed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-100" /> Đã lưu
                      </>
                    ) : (
                      <>Lưu mã</>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Categories Horizontal Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-500" />
            <span>Danh mục món ăn Đà Nẵng</span>
          </h2>
          {selectedCategory !== 'cat-all' && (
            <button
              onClick={() => handleSelectCategory('cat-all')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xem tất cả danh mục</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2.5 sm:gap-3">
          {MOCK_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-[#00204A] text-white border-[#00204A] shadow-md scale-105 ring-2 ring-amber-400'
                    : 'bg-white hover:bg-amber-50/70 border-slate-200 text-slate-700 hover:scale-[1.02]'
                }`}
                title={`Tìm món: ${cat.name}`}
              >
                <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <span className="text-[11px] font-bold text-center line-clamp-1">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Immediate Category Feedback Pill when selected */}
        {selectedCategory !== 'cat-all' && currentCategoryObj && (
          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2.5 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border border-amber-300 p-3 sm:p-3.5 rounded-2xl shadow-xs animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center space-x-2.5">
              <span className="text-2xl p-1 bg-white rounded-xl shadow-xs">{currentCategoryObj.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Đang tìm món:</span>
                  <span className="text-sm font-black text-[#00204A]">{currentCategoryObj.name}</span>
                </div>
                <p className="text-xs text-amber-900 font-bold mt-0.5">
                  Đã tìm thấy <span className="text-rose-600 font-extrabold">{filtered.length} quán ăn</span> &amp; <span className="text-rose-600 font-extrabold">{matchedCategoryDishes.length} món ngon</span> đặc sản tại Đà Nẵng
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const el = document.getElementById('restaurant-listing');
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="text-xs font-black text-slate-950 bg-[#FFC700] hover:bg-amber-400 px-3.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <span>Xem kết quả ngay</span>
                <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
              </button>
              <button
                onClick={() => handleSelectCategory('cat-all')}
                className="text-xs text-slate-600 hover:text-slate-900 font-bold px-3 py-1.5 rounded-xl hover:bg-white border border-slate-200/80 transition-all cursor-pointer"
              >
                Đặt lại
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 3.5. 👑 THƯƠNG HIỆU NỔI BẬT BEFOOD ĐÀ NẴNG (OFFICIAL TOP BRANDS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 rounded-xl shadow-xs">
              <ShieldCheck className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Thương Hiệu Nổi Bật beFood
                </h2>
                <span className="bg-[#00204A] text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Quán chuẩn beFood
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Những thương hiệu ẩm thực trứ danh được bảo chứng chất lượng và giao BeBike siêu tốc
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">100% đối tác chính thức</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {topBrands.slice(0, 6).map((brand) => (
            <div
              key={brand.id}
              onClick={() => setActiveRestaurant(brand)}
              className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-28 w-full overflow-hidden bg-slate-100">
                <img
                  src={brand.coverImage}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                {brand.hasFreeShip && (
                  <span className="absolute top-2 left-2 bg-[#FFC700] text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded shadow">
                    FREESHIP
                  </span>
                )}
                <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-white text-[11px] font-bold">
                  <span className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-amber-400 fill-current" />
                    {brand.rating}
                  </span>
                  <span>{brand.deliveryTimeMin}p • {brand.distanceKm}km</span>
                </div>
              </div>

              <div className="p-2.5 space-y-1">
                <h3 className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-amber-600 transition-colors">
                  {brand.name}
                </h3>
                <p className="text-[10px] text-slate-400 line-clamp-1">{brand.categories[0]}</p>
                {brand.featuredPromo && (
                  <div className="text-[10px] text-rose-600 font-bold truncate bg-rose-50 px-1 py-0.5 rounded">
                    {brand.featuredPromo}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. 🔥 DEAL CHỚP NHOÁNG / FLASH SALE HÔM NAY (MÓN ĂN GIẢM TỚI 50%) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-600/10 via-amber-500/10 to-orange-500/10 p-4 sm:p-6 rounded-3xl border border-rose-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-rose-600 text-white rounded-2xl shadow-md animate-pulse">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
                    Deal Chớp Nhoáng Hôm Nay
                  </h2>
                  <span className="bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full">
                    GIẢM TỚI 40%
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Số lượng có hạn, ưu đãi độc quyền khi đặt qua beFood Đà Nẵng
                </p>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center space-x-1.5 self-start sm:self-auto bg-white px-3 py-1.5 rounded-xl border border-rose-200 shadow-xs text-xs font-bold text-slate-800">
              <Clock className="w-4 h-4 text-rose-600" />
              <span>Kết thúc trong:</span>
              <span className="bg-slate-900 text-white font-mono px-1.5 py-0.5 rounded-md text-xs">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-slate-900 text-white font-mono px-1.5 py-0.5 rounded-md text-xs">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-rose-600 text-white font-mono px-1.5 py-0.5 rounded-md text-xs">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Flash Deals Food Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {MOCK_FLASH_DEALS.map((deal) => (
              <div
                key={deal.id}
                onClick={() => handleSelectFoodById(deal.restaurantId, deal.foodId)}
                className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                    <img
                      src={deal.image}
                      alt={deal.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80';
                      }}
                    />
                    <span className="absolute top-2 left-2 bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow-md">
                      {deal.badge}
                    </span>
                  </div>

                  <div className="p-3 space-y-1.5">
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      {deal.restaurantName}
                    </span>
                    <h3 className="font-bold text-slate-900 text-xs line-clamp-2 leading-tight group-hover:text-amber-600 transition-colors">
                      {deal.name}
                    </h3>

                    <div className="pt-1">
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-sm font-black text-rose-600">
                          {deal.salePrice.toLocaleString('vi-VN')}đ
                        </span>
                        <span className="text-[11px] text-slate-400 line-through">
                          {deal.originalPrice.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-rose-600 rounded-full"
                          style={{ width: `${deal.soldPercent}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Đã bán {deal.soldPercent}%</span>
                        <span className="text-rose-600 font-bold">Còn {deal.remainingStock}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 pt-0">
                  <button
                    onClick={(e) => handleDirectAddToCart(deal.restaurantId, deal.foodId, e)}
                    className="w-full py-1.5 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm vào giỏ</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ⭐ MÓN NGON BÁN CHẠY NHẤT ĐÀ NẴNG (TOP BESTSELLERS DISHES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#FFC700] text-slate-950 rounded-xl shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Món Ngon Bán Chạy Nhất Đà Nẵng
              </h2>
              <p className="text-xs text-slate-500">
                Những món ăn trứ danh được thực khách địa phương và du khách gọi nhiều nhất
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Hơn 50,000 lượt đặt tuần qua
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {MOCK_BEST_SELLERS.map((dish) => (
            <div
              key={dish.id}
              onClick={() => handleSelectFoodById(dish.restaurantId, dish.id)}
              className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  <span className="absolute top-3 left-3 bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-md">
                    {dish.tag}
                  </span>

                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold">{dish.restaurantName}</span>
                    <span className="flex items-center gap-1 font-bold bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-xs">
                      <Star className="w-3 h-3 text-amber-400 fill-current" />
                      {dish.rating}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-amber-600 transition-colors">
                    {dish.name}
                  </h3>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-base font-black text-amber-600">
                        {dish.price.toLocaleString('vi-VN')}đ
                      </span>
                      {dish.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {dish.originalPrice.toLocaleString('vi-VN')}đ
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Đã bán {dish.soldCount.toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={(e) => handleDirectAddToCart(dish.restaurantId, dish.id, e)}
                  className="w-full py-2 bg-slate-100 hover:bg-[#FFC700] hover:text-slate-950 text-slate-800 font-bold text-xs rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Đặt món ngay</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. 🍱 BỘ SƯU TẬP THEO BỮA ĂN (HÔM NAY ĂN GÌ?) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Hôm Nay Ăn Gì? Gợi Ý Theo Bữa Ăn
            </h2>
            <p className="text-xs text-slate-500">
              Thực đơn tuyển chọn đúng điệu Đà Nẵng theo từng khung giờ trong ngày
            </p>
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
            {[
              { id: 'BREAKFAST' as const, label: '🌅 Bữa sáng chuẩn vị' },
              { id: 'LUNCH' as const, label: '☀️ Trưa văn phòng' },
              { id: 'SNACK' as const, label: '🧋 Xế chiều ăn vặt' },
              { id: 'DINNER' as const, label: '🌙 Tối nhậu hải sản' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMealTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  mealTab === tab.id
                    ? 'bg-[#00204A] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Selected Dishes for this Meal Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mealTabDishes.map((dish) => (
            <div
              key={dish.id}
              onClick={() => setSelectedFoodForModal(dish)}
              className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80';
                    }}
                  />
                  <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                    {dish.restaurantName}
                  </span>
                </div>

                <div className="p-4 space-y-1">
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 group-hover:text-amber-600 transition-colors">
                    {dish.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{dish.description}</p>
                  <div className="pt-1.5 flex items-center justify-between">
                    <span className="text-sm font-black text-amber-600">
                      {dish.price.toLocaleString('vi-VN')}đ
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {dish.calories ? `${dish.calories} kcal` : 'Nóng sốt'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(dish, 1, { toppings: [] });
                  }}
                  className="w-full py-1.5 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Chọn món</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Landmark Filter Bar in Da Nang */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center space-x-2 overflow-x-auto scrollbar-none">
          <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1 mr-2">
            <MapPin className="w-3.5 h-3.5 text-amber-500" /> Điểm đến nổi bật:
          </span>

          {[
            { id: 'ALL' as DaNangLandmark, label: 'Toàn Đà Nẵng', icon: '🏙️' },
            { id: 'CAU_RONG' as DaNangLandmark, label: 'Cầu Rồng & Sông Hàn', icon: '🐉' },
            { id: 'MY_KHE' as DaNangLandmark, label: 'Biển Mỹ Khê & Sơn Trà', icon: '🏖️' },
            { id: 'AIRPORT' as DaNangLandmark, label: 'Gần Sân Bay Quốc Tế', icon: '✈️' },
            { id: 'UNIVERSITIES' as DaNangLandmark, label: 'Làng ĐH Bách Khoa', icon: '🎓' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedLandmark(item.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                selectedLandmark === item.id
                  ? 'bg-[#00204A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 8. Filter, District & Sort Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          {/* Row 1: Quick Filter Chips */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1 shrink-0">
                <Filter className="w-3.5 h-3.5" /> Lọc nhanh:
              </span>
              <button
                onClick={() => {
                  setFilterType('all');
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-[#FFC700] text-slate-950 font-black shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tất cả ({restaurants.length})
              </button>
              <button
                onClick={() => {
                  setFilterType('nearby');
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filterType === 'nearby'
                    ? 'bg-[#FFC700] text-slate-950 font-black shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Gần tôi (&lt; 3.5km) ({countNearby})
              </button>
              <button
                onClick={() => {
                  setFilterType('high_rating');
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filterType === 'high_rating'
                    ? 'bg-[#FFC700] text-slate-950 font-black shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Đánh giá cao (⭐ 4.8+) ({countHighRating})
              </button>
              <button
                onClick={() => {
                  setFilterType('freeship');
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filterType === 'freeship'
                    ? 'bg-[#FFC700] text-slate-950 font-black shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Freeship 0Đ ({countFreeship})
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 text-xs shrink-0 self-end sm:self-auto">
              <span className="text-slate-400 font-medium">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as typeof sortBy);
                  setCurrentPage(1);
                }}
                className="bg-slate-100 border border-slate-200 text-slate-800 font-bold rounded-xl px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
              >
                <option value="recommended">Gợi ý beFood Đà Nẵng</option>
                <option value="distance">Khoảng cách gần nhất</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
            </div>
          </div>

          {/* Row 2: District Pills */}
          <div className="pt-2 border-t border-slate-100 flex items-center space-x-1.5 overflow-x-auto scrollbar-none text-xs">
            <span className="text-slate-400 font-medium shrink-0 mr-1">Quận tại Đà Nẵng:</span>
            {[
              { id: 'ALL', name: 'Toàn Đà Nẵng' },
              { id: 'Hải Châu', name: 'Hải Châu' },
              { id: 'Sơn Trà', name: 'Sơn Trà' },
              { id: 'Ngũ Hành Sơn', name: 'Ngũ Hành Sơn' },
              { id: 'Thanh Khê', name: 'Thanh Khê' },
              { id: 'Liên Chiểu', name: 'Liên Chiểu' },
              { id: 'Cẩm Lệ', name: 'Cẩm Lệ' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDistrict(d.id);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDistrict === d.id
                    ? 'bg-amber-100 text-amber-900 font-black border border-amber-300'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {d.name} ({countByDistrict(d.id)})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Main Restaurant Listing Grid with Pagination */}
      <section id="restaurant-listing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-2 scroll-mt-24">
        {/* Category / Search Results Header Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                {selectedCategory !== 'cat-all' && currentCategoryObj && (
                  <span className="text-2xl p-2 bg-amber-100 rounded-2xl shadow-2xs">
                    {currentCategoryObj.icon}
                  </span>
                )}
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {selectedCategory !== 'cat-all' && currentCategoryObj
                    ? `Danh mục: ${currentCategoryObj.name} (${filtered.length} quán • ${matchedCategoryDishes.length} món ngon)`
                    : searchQuery
                    ? `Kết quả tìm kiếm cho "${searchQuery}" (${filtered.length} quán • ${searchDishes.length} món tại Đà Nẵng)`
                    : isTouristMode
                    ? `Đặc sản Đà Nẵng dành cho du khách (${filtered.length} quán)`
                    : selectedDistrict !== 'ALL'
                    ? `Quán ăn ngon tại quận ${selectedDistrict}, Đà Nẵng (${filtered.length} quán)`
                    : `Khám phá các quán ăn ngon giao nhanh tại Đà Nẵng (${filtered.length} quán • ${totalFoodCount} món ăn)`}
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Tất cả các quán đều giao hàng nhanh bằng xe máy BeBike, bảo quản trong thùng giữ nhiệt chuyên dụng
              </p>
            </div>

            {/* Clear button if active */}
            {(selectedCategory !== 'cat-all' || searchQuery) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  handleSelectCategory('cat-all');
                }}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xem tất cả quán ăn Đà Nẵng</span>
              </button>
            )}
          </div>

          {/* Quick Category Switch Chips right in the results view */}
          <div className="pt-3 border-t border-slate-100 flex items-center space-x-2 overflow-x-auto scrollbar-none text-xs">
            <span className="text-slate-400 font-semibold shrink-0">Chọn danh mục:</span>
            {MOCK_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#00204A] text-white shadow-xs scale-105'
                      : 'bg-slate-100 hover:bg-amber-100/70 text-slate-700 border border-transparent'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 9.1. SHOW MATCHING DISHES (THỰC ĐƠN MÓN ĂN THEO DANH MỤC / TÌM KIẾM) */}
        {((selectedCategory !== 'cat-all' && matchedCategoryDishes.length > 0) ||
          (searchQuery.trim() && searchDishes.length > 0)) && (
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 p-4 sm:p-5 rounded-3xl border border-amber-200 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 bg-amber-500 text-slate-950 rounded-xl shadow-xs">
                  <Utensils className="w-4 h-4" />
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {selectedCategory !== 'cat-all'
                    ? `Thực đơn món ngon: ${currentCategoryObj?.name} (${matchedCategoryDishes.length} món)`
                    : `Món ăn gợi ý theo từ khóa "${searchQuery}" (${searchDishes.length} món)`}
                </h3>
              </div>
              <span className="text-xs text-amber-800 font-bold bg-amber-200/70 px-2.5 py-0.5 rounded-full">
                Bấm "Thêm" để chọn nhanh
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {(selectedCategory !== 'cat-all' ? matchedCategoryDishes : searchDishes)
                .slice(0, 8)
                .map((food) => {
                  const parentRestaurant = restaurants.find((r) => r.id === food.restaurantId);
                  return (
                    <div
                      key={food.id}
                      onClick={() => setSelectedFoodForModal(food)}
                      className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div className="flex space-x-3">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-20 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                            {food.name}
                          </h4>
                          {parentRestaurant && (
                            <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-medium">
                              {parentRestaurant.name}
                            </p>
                          )}
                          <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold">
                            <span className="text-amber-600">
                              {food.price.toLocaleString('vi-VN')}đ
                            </span>
                            {food.originalPrice && food.originalPrice > food.price && (
                              <span className="text-[10px] text-slate-400 line-through">
                                {food.originalPrice.toLocaleString('vi-VN')}đ
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                          {food.category}
                        </span>
                        <button
                          onClick={(e) => handleDirectAddToCart(food.restaurantId, food.id, e)}
                          className="px-2.5 py-1 rounded-lg bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Thêm</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* 9.2. SHOW RESTAURANTS */}
        {filtered.length === 0 ? (
          <EmptyState
            title="Không tìm thấy quán ăn phù hợp với bộ lọc này"
            description="Thử chọn 'Tất cả Đà Nẵng' hoặc xóa bộ lọc để khám phá toàn bộ ẩm thực Đà Nẵng."
            actionText="Đặt lại bộ lọc"
            onAction={() => {
              setSearchQuery('');
              handleSelectCategory('cat-all');
              setSelectedLandmark('ALL');
              setSelectedDistrict('ALL');
              setFilterType('all');
              setIsTouristMode(false);
              setCurrentPage(1);
            }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pagedRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onClick={() => setActiveRestaurant(restaurant)}
                  onSelectFood={(food) => setSelectedFoodForModal(food)}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filtered.length}
              pageSize={pageSize}
            />
          </>
        )}
      </section>

      {/* 10. Food Customization Detail Modal */}
      {selectedFoodForModal && (
        <FoodDetailModal
          food={selectedFoodForModal}
          onClose={() => setSelectedFoodForModal(null)}
        />
      )}
    </div>
  );
};
