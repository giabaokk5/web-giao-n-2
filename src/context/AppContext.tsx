// src\context\AppContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Role,
  Restaurant,
  FoodItem,
  CartItem,
  CartItemOption,
  Order,
  OrderStatus,
  Voucher,
  Address,
  Review,
} from '../types';
import {
  INITIAL_USER,
  MOCK_RESTAURANTS,
  MOCK_VOUCHERS,
  INITIAL_ORDERS,
  MOCK_ACTIVE_DRIVER,
  MOCK_REVIEWS,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  mode: 'customer' | 'admin' | 'merchant';
  messages: {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    time: string;
    foodCards?: FoodItem[];
    restaurantCards?: Restaurant[];
    liked?: boolean;
    disliked?: boolean;
  }[];
}

interface AppContextType {
  // Auth state
  currentUser: User;
  isAuthenticated: boolean;
  login: (email: string, pass: string, role?: Role) => boolean;
  register: (name: string, email: string, phone: string, pass: string, role: Role) => boolean;
  logout: () => void;
  loginWithGoogle: () => void;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;

  // Restaurant & Menu
  restaurants: Restaurant[];
  activeRestaurant: Restaurant | null;
  setActiveRestaurant: (restaurant: Restaurant | null) => void;
  addRestaurant: (res: Restaurant) => void;
  updateRestaurant: (res: Restaurant) => void;
  deleteRestaurant: (resId: string) => void;

  // Cart
  cart: CartItem[];
  cartRestaurant: Restaurant | null;
  addToCart: (food: FoodItem, quantity: number, options: CartItemOption) => void;
  updateCartItemQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  deliveryFee: number;
  discountAmount: number;
  cartTotal: number;
  appliedVoucher: Voucher | null;
  applyVoucher: (voucher: Voucher | null) => void;
  availableVouchers: Voucher[];
  addVoucher: (v: Voucher) => void;
  deleteVoucher: (id: string) => void;

  // Orders
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  createOrder: (paymentMethod: Order['paymentMethod'], driverTip: number, customerNote?: string) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  reorderOldOrder: (order: Order) => void;

  // Favorites & Address
  favorites: string[];
  toggleFavorite: (restaurantId: string) => void;
  currentAddress: Address;
  setCurrentAddress: (address: Address) => void;

  // Reviews & Comments
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'likes'>) => void;
  likeReview: (reviewId: string) => void;
  deleteReview: (reviewId: string) => void;
  replyReview: (reviewId: string, replyContent: string) => void;

  // UI state & Modals
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAddressModalOpen: boolean;
  setIsAddressModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalView: 'signin' | 'signup' | 'profile';
  setAuthModalView: (view: 'signin' | 'signup' | 'profile') => void;
  openAuthModal: (view?: 'signin' | 'signup' | 'profile') => void;

  // Dedicated Admin Authentication
  isAdminAuthModalOpen: boolean;
  setIsAdminAuthModalOpen: (open: boolean) => void;
  adminAuthModalView: 'signin' | 'signup';
  setAdminAuthModalView: (view: 'signin' | 'signup') => void;
  openAdminAuthModal: (view?: 'signin' | 'signup') => void;
  loginAdmin: (email: string, pass: string, department?: string) => boolean;
  registerAdmin: (employeeId: string, name: string, email: string, phone: string, pass: string, department: string) => boolean;
  isChatbotOpen: boolean;
  setIsChatbotOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  // Merchant actions
  addFoodToMenu: (restaurantId: string, food: FoodItem) => void;
  updateFoodInMenu: (restaurantId: string, food: FoodItem) => void;
  deleteFoodFromMenu: (restaurantId: string, foodId: string) => void;
  toggleFoodAvailability: (restaurantId: string, foodId: string) => void;
  toggleRestaurantOpen: (restaurantId: string) => void;

  // AI Chat Sessions
  chatSessions: ChatSession[];
  activeSessionId: string;
  setActiveSessionId: (id: string) => void;
  createChatSession: (title: string, mode?: ChatSession['mode']) => string;
  deleteChatSession: (id: string) => void;
  addMessageToSession: (sessionId: string, msg: ChatSession['messages'][0]) => void;
  rateMessage: (sessionId: string, messageId: string, isLike: boolean) => void;

  // Sound
  playNotificationSound: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function playChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.debug('Audio error: ', e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Restore logged in user & authentication state from localStorage (never auto-logout on enter)
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('befood_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('befood_is_authenticated');
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return true; // Luôn giữ trạng thái đăng nhập khi vô web
  });

  // Save auth state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('befood_current_user', JSON.stringify(currentUser));
      localStorage.setItem('befood_is_authenticated', JSON.stringify(isAuthenticated));
    } catch (e) {}
  }, [currentUser, isAuthenticated]);

  // Customer Reviews & Comments state with persistence
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('befood_reviews');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return MOCK_REVIEWS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('befood_reviews', JSON.stringify(reviews));
    } catch (e) {}
  }, [reviews]);

  const [currentRole, setCurrentRole] = useState<Role>('customer');
  const [restaurants, setRestaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS);
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartRestaurant, setCartRestaurant] = useState<Restaurant | null>(null);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>(MOCK_VOUCHERS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [favorites, setFavorites] = useState<string[]>(['res-bephoa', 'res-phuclong']);
  const [currentAddress, setCurrentAddress] = useState<Address>(INITIAL_USER.addresses[0]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'signin' | 'signup' | 'profile'>('signin');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Dedicated Admin Auth State
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [adminAuthModalView, setAdminAuthModalView] = useState<'signin' | 'signup'>('signin');

  const openAdminAuthModal = (view: 'signin' | 'signup' = 'signin') => {
    setAdminAuthModalView(view);
    setIsAdminAuthModalOpen(true);
    setIsAuthModalOpen(false);
  };

  const openAuthModal = (view?: 'signin' | 'signup' | 'profile') => {
    if (view) {
      setAuthModalView(view);
    } else {
      setAuthModalView(isAuthenticated ? 'profile' : 'signin');
    }
    setIsAuthModalOpen(true);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('cat-all');

  // Chat sessions history
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: 'session-default',
      title: 'Tư vấn món ngon hôm nay',
      createdAt: '10:45 01/11/2026',
      mode: 'customer',
      messages: [
        {
          id: 'msg-w',
          sender: 'bot',
          text: 'Chào bạn! Mình là Trợ lý AI BeFood 🤖✨ Hôm nay bạn muốn tìm món gì ngon, đồ uống mát lạnh hay cần gợi ý theo ngân sách?',
          time: '10:45',
        },
      ],
    },
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string>('session-default');

  const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const playNotificationSound = () => {
    playChime();
  };

  // Authentication logic
  const login = (email: string, pass: string, role?: Role): boolean => {
    const determinedRole = role || (email.includes('admin') ? 'admin' : email.includes('merchant') ? 'merchant' : email.includes('driver') ? 'driver' : 'customer');
    const updatedUser: User = {
      ...currentUser,
      email,
      role: determinedRole,
      name: determinedRole === 'admin' ? 'Quản Trị Viên Be' : determinedRole === 'merchant' ? 'Chủ Quán Bếp Hoa' : determinedRole === 'driver' ? 'Tài Xế Nguyễn Văn Be' : 'Trần Minh Quang',
      avatar: determinedRole === 'admin'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : determinedRole === 'driver'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };

    setCurrentUser(updatedUser);
    setIsAuthenticated(true);
    setCurrentRole(determinedRole);
    playNotificationSound();
    showToast(`Đăng nhập thành công với vai trò: ${determinedRole.toUpperCase()}!`, 'success');
    return true;
  };

  const register = (name: string, email: string, phone: string, pass: string, role: Role): boolean => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim() || 'Người dùng mới',
      email: email.trim(),
      phone: phone.trim() || '0908 999 888',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role,
      addresses: currentUser.addresses,
      walletBalance: 200000,
      loyaltyPoints: 100,
      loyaltyTier: 'BRONZE',
      allergies: [],
    };

    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setCurrentRole(role);
    playNotificationSound();
    showToast(`Chào mừng ${newUser.name}! Đăng ký tài khoản thành công.`, 'success');
    return true;
  };

  const loginAdmin = (email: string, pass: string, department?: string): boolean => {
    const adminUser: User = {
      ...currentUser,
      id: 'admin-super-01',
      email: email.trim() || 'admin@befood.vn',
      name: department ? `Admin ${department}` : 'Nguyễn Hoàng Lâm (Super Admin)',
      phone: '0905 999 888',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      walletBalance: 10000000,
      loyaltyPoints: 99999,
      loyaltyTier: 'DIAMOND',
    };
    setCurrentUser(adminUser);
    setIsAuthenticated(true);
    setCurrentRole('admin');
    setIsAdminAuthModalOpen(false);
    playNotificationSound();
    showToast(`Xác thực đặc quyền thành công! Chào mừng Quản trị viên ${adminUser.name}.`, 'success');
    return true;
  };

  const registerAdmin = (employeeId: string, name: string, email: string, phone: string, pass: string, department: string): boolean => {
    const newAdmin: User = {
      id: `admin-${employeeId || Date.now()}`,
      name: `${name.trim()} (${department})`,
      email: email.trim() || 'admin@befood.vn',
      phone: phone.trim() || '0905 111 222',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      addresses: currentUser.addresses,
      walletBalance: 10000000,
      loyaltyPoints: 50000,
      loyaltyTier: 'DIAMOND',
      allergies: [],
    };
    setCurrentUser(newAdmin);
    setIsAuthenticated(true);
    setCurrentRole('admin');
    setIsAdminAuthModalOpen(false);
    playNotificationSound();
    showToast(`Chào mừng Quản trị viên ${newAdmin.name}! Hồ sơ đã được duyệt kích hoạt.`, 'success');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser({
      ...currentUser,
      name: 'Khách vãng lai',
      email: 'guest@befood.vn',
      role: 'customer',
      walletBalance: 0,
      loyaltyPoints: 0,
      loyaltyTier: 'BRONZE',
    });
    setCurrentRole('customer');
    setAuthModalView('signin');
    setIsAuthModalOpen(false);
    playNotificationSound();
    showToast('Đã đăng xuất tài khoản thành công.', 'info');
  };

  const loginWithGoogle = () => {
    const googleUser: User = {
      id: 'usr-google-99',
      name: 'Minh Quang Google',
      email: 'minhquang.tran@gmail.com',
      phone: '0908 123 456',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'customer',
      addresses: currentUser.addresses,
      walletBalance: 350000,
      loyaltyPoints: 2100,
      loyaltyTier: 'GOLD',
      allergies: ['Đậu phộng'],
    };

    setCurrentUser(googleUser);
    setIsAuthenticated(true);
    setCurrentRole('customer');
    playNotificationSound();
    showToast('Đã đăng nhập thành công qua Google Account!', 'success');
  };

  // Cart operations
  const addToCart = (food: FoodItem, quantity: number, options: CartItemOption) => {
    const targetRestaurant = restaurants.find((r) => r.id === food.restaurantId) || null;

    if (cartRestaurant && cartRestaurant.id !== food.restaurantId && cart.length > 0) {
      if (
        window.confirm(
          `Bạn đang có món của quán "${cartRestaurant.name}" trong giỏ. Bạn có muốn đổi sang "${targetRestaurant?.name || 'quán mới'}" không?`
        )
      ) {
        setCart([]);
      } else {
        return;
      }
    }

    setCartRestaurant(targetRestaurant);

    const sizeDiff = options.size ? options.size.priceDiff : 0;
    const toppingsTotal = options.toppings.reduce((acc, t) => acc + t.price, 0);
    const unitPrice = food.price + sizeDiff + toppingsTotal;
    const totalPrice = unitPrice * quantity;

    const cartItemId = `${food.id}-${options.size?.id || 'none'}-${options.toppings
      .map((t) => t.id)
      .sort()
      .join('_')}-${options.sugarLevel || ''}-${options.iceLevel || ''}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = next[existingIndex].quantity + quantity;
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: newQty,
          totalPrice: newQty * next[existingIndex].unitPrice,
        };
        return next;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            food,
            quantity,
            unitPrice,
            totalPrice,
            options,
          },
        ];
      }
    });

    playNotificationSound();
    showToast(`Đã thêm "${food.name}" vào giỏ hàng`, 'success');
  };

  const updateCartItemQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...item,
              quantity: nextQty,
              totalPrice: nextQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => {
      const next = prev.filter((item) => item.cartItemId !== cartItemId);
      if (next.length === 0) {
        setCartRestaurant(null);
        setAppliedVoucher(null);
      }
      return next;
    });
    showToast('Đã xóa món khỏi giỏ hàng', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setCartRestaurant(null);
    setAppliedVoucher(null);
  };

  const toggleFavorite = (restaurantId: string) => {
    setFavorites((prev) => {
      if (prev.includes(restaurantId)) {
        showToast('Đã bỏ yêu thích quán', 'info');
        return prev.filter((id) => id !== restaurantId);
      } else {
        showToast('Đã lưu quán vào danh sách yêu thích ❤️', 'success');
        return [...prev, restaurantId];
      }
    });
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const baseDeliveryFee = cartRestaurant ? Math.max(16000, Math.round(cartRestaurant.distanceKm * 6000)) : 16000;
  const deliveryFee = cartRestaurant?.hasFreeShip && cartSubtotal >= 50000 ? 0 : baseDeliveryFee;

  let discountAmount = 0;
  if (appliedVoucher && cartSubtotal >= appliedVoucher.minOrderValue) {
    if (appliedVoucher.discountType === 'FIXED') {
      discountAmount = appliedVoucher.discountValue;
    } else if (appliedVoucher.discountType === 'FREESHIP') {
      discountAmount = Math.min(deliveryFee, appliedVoucher.discountValue);
    } else if (appliedVoucher.discountType === 'PERCENT') {
      const pctDiscount = Math.round((cartSubtotal * appliedVoucher.discountValue) / 100);
      discountAmount = appliedVoucher.maxDiscount ? Math.min(pctDiscount, appliedVoucher.maxDiscount) : pctDiscount;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal + deliveryFee - discountAmount);

  const applyVoucher = (voucher: Voucher | null) => {
    if (!voucher) {
      setAppliedVoucher(null);
      return;
    }
    if (cartSubtotal < voucher.minOrderValue) {
      showToast(`Đơn cần tối thiểu ${voucher.minOrderValue.toLocaleString('vi-VN')}đ để áp dụng`, 'warning');
      return;
    }
    setAppliedVoucher(voucher);
    playNotificationSound();
    showToast(`Đã áp dụng mã "${voucher.code}" thành công!`, 'success');
  };

  const addVoucher = (v: Voucher) => {
    setAvailableVouchers((prev) => [v, ...prev]);
    showToast(`Đã tạo mã giảm giá "${v.code}"!`, 'success');
  };

  const deleteVoucher = (id: string) => {
    setAvailableVouchers((prev) => prev.filter((v) => v.id !== id));
    showToast('Đã xóa mã voucher', 'info');
  };

  // Orders
  const createOrder = (paymentMethod: Order['paymentMethod'], driverTip: number, customerNote?: string): Order => {
    if (!cartRestaurant) throw new Error('Không có nhà hàng');

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderCode = `BE-${randomSuffix}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderCode,
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      restaurantId: cartRestaurant.id,
      restaurantName: cartRestaurant.name,
      restaurantAddress: cartRestaurant.address,
      restaurantLogo: cartRestaurant.logo,
      deliveryAddress: currentAddress,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee,
      discountAmount,
      voucherCode: appliedVoucher?.code,
      driverTip,
      totalAmount: cartTotal + driverTip,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'UNPAID' : 'PAID',
      orderStatus: 'PENDING',
      statusHistory: [
        {
          status: 'PENDING',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          note: 'Đơn hàng mới đã được gửi tới hệ thống',
        },
      ],
      driver: MOCK_ACTIVE_DRIVER,
      createdAt: new Date().toLocaleString('vi-VN'),
      estimatedDeliveryTime: new Date(Date.now() + 25 * 60000).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      customerNote,
      deliveryOtp: `${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setActiveOrder(newOrder);
    playNotificationSound();
    showToast(`Đặt món thành công! Mã đơn: ${orderCode}`, 'success');

    setTimeout(() => {
      updateOrderStatus(newOrder.id, 'CONFIRMED', 'Nhà hàng đã xác nhận đơn');
    }, 4000);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    const timestamp = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updated = {
            ...order,
            orderStatus: status,
            statusHistory: [
              ...order.statusHistory,
              { status, timestamp, note: note || `Cập nhật trạng thái sang ${status}` },
            ],
          };
          if (activeOrder && activeOrder.id === orderId) {
            setActiveOrder(updated);
          }
          return updated;
        }
        return order;
      })
    );

    playNotificationSound();
    showToast(`Trạng thái đơn: ${note || status}`, 'info');
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    updateOrderStatus(orderId, 'CANCELLED', reason || 'Khách hàng yêu cầu hủy đơn');
    showToast('Đã hủy đơn hàng thành công và yêu cầu hoàn tiền', 'info');
  };

  const reorderOldOrder = (order: Order) => {
    const targetRestaurant = restaurants.find((r) => r.id === order.restaurantId);
    if (!targetRestaurant) return;

    setCart(order.items);
    setCartRestaurant(targetRestaurant);
    setIsCartOpen(true);
    playNotificationSound();
    showToast(`Đã thêm lại ${order.items.length} món từ đơn cũ #${order.orderCode} vào giỏ!`, 'success');
  };

  // Restaurant CRUD
  const addRestaurant = (res: Restaurant) => {
    setRestaurants((prev) => [res, ...prev]);
    showToast(`Đã thêm nhà hàng đối tác "${res.name}"`, 'success');
  };

  const updateRestaurant = (res: Restaurant) => {
    setRestaurants((prev) => prev.map((r) => (r.id === res.id ? res : r)));
    showToast(`Đã cập nhật nhà hàng "${res.name}"`, 'success');
  };

  const deleteRestaurant = (resId: string) => {
    setRestaurants((prev) => prev.filter((r) => r.id !== resId));
    showToast('Đã xóa nhà hàng khỏi hệ thống', 'info');
  };

  // Merchant actions
  const addFoodToMenu = (restaurantId: string, food: FoodItem) => {
    setRestaurants((prev) =>
      prev.map((res) => {
        if (res.id === restaurantId) {
          return { ...res, menu: [food, ...res.menu] };
        }
        return res;
      })
    );
    showToast(`Đã thêm món "${food.name}"`, 'success');
  };

  const updateFoodInMenu = (restaurantId: string, food: FoodItem) => {
    setRestaurants((prev) =>
      prev.map((res) => {
        if (res.id === restaurantId) {
          return { ...res, menu: res.menu.map((m) => (m.id === food.id ? food : m)) };
        }
        return res;
      })
    );
    showToast(`Đã cập nhật món "${food.name}"`, 'success');
  };

  const deleteFoodFromMenu = (restaurantId: string, foodId: string) => {
    setRestaurants((prev) =>
      prev.map((res) => {
        if (res.id === restaurantId) {
          return { ...res, menu: res.menu.filter((m) => m.id !== foodId) };
        }
        return res;
      })
    );
    showToast('Đã xóa món khỏi thực đơn', 'info');
  };

  const toggleFoodAvailability = (restaurantId: string, foodId: string) => {
    setRestaurants((prev) =>
      prev.map((res) => {
        if (res.id === restaurantId) {
          return {
            ...res,
            menu: res.menu.map((m) => {
              if (m.id === foodId) {
                const nextState = !m.isAvailable;
                showToast(`Đã chuyển món "${m.name}" sang ${nextState ? 'Còn hàng' : 'Hết món'}`, 'info');
                return { ...m, isAvailable: nextState };
              }
              return m;
            }),
          };
        }
        return res;
      })
    );
  };

  const toggleRestaurantOpen = (restaurantId: string) => {
    setRestaurants((prev) =>
      prev.map((res) => {
        if (res.id === restaurantId) {
          const nextState = !res.isOpen;
          showToast(`Nhà hàng "${res.name}" đã ${nextState ? 'Mở cửa nhận đơn' : 'Tạm đóng cửa'}`, 'info');
          return { ...res, isOpen: nextState };
        }
        return res;
      })
    );
  };

  // Review & Comments Management
  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt' | 'likes'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: 'Vừa xong',
      likes: 0,
      isLiked: false,
    };
    setReviews((prev) => [newRev, ...prev]);
    playNotificationSound();
    showToast('Cảm ơn bạn đã gửi đánh giá & bình luận món ăn!', 'success');
  };

  const likeReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const isLiked = !r.isLiked;
          return {
            ...r,
            isLiked,
            likes: isLiked ? r.likes + 1 : Math.max(0, r.likes - 1),
          };
        }
        return r;
      })
    );
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    showToast('Đã xóa đánh giá thành công', 'info');
  };

  const replyReview = (reviewId: string, replyContent: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          return {
            ...r,
            reply: {
              author: 'Ban Quản Trị BeFood / Chủ Quán',
              content: replyContent,
              date: 'Vừa xong',
            },
          };
        }
        return r;
      })
    );
    showToast('Đã phản hồi bình luận của khách hàng!', 'success');
  };

  // AI Chat Sessions
  const createChatSession = (title: string, mode: ChatSession['mode'] = 'customer'): string => {
    const id = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id,
      title: title || 'Cuộc trò chuyện mới',
      createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      mode,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'bot',
          text: mode === 'admin'
            ? 'Chào Quản Trị Viên! Tôi là Gemini Business Intelligence. Tôi có thể hỗ trợ phân tích GMV, biến động đơn hàng và phát hiện dấu hiệu bất thường.'
            : mode === 'merchant'
            ? 'Chào Quán Ăn! Tôi là Trợ Lý Tối Ưu Bán Hàng. Bạn muốn phân tích món bán chạy, dự báo nhập kho hay gợi ý combo?'
            : 'Chào bạn! Mình là Trợ lý AI BeFood 🤖✨ Hôm nay bạn muốn tìm món gì ngon?',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };
    setChatSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(id);
    return id;
  };

  const deleteChatSession = (id: string) => {
    setChatSessions((prev) => prev.filter((s) => s.id !== id));
    showToast('Đã xóa cuộc trò chuyện khỏi lịch sử', 'info');
  };

  const addMessageToSession = (sessionId: string, msg: ChatSession['messages'][0]) => {
    setChatSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, messages: [...s.messages, msg] } : s))
    );
  };

  const rateMessage = (sessionId: string, messageId: string, isLike: boolean) => {
    setChatSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          return {
            ...s,
            messages: s.messages.map((m) =>
              m.id === messageId ? { ...m, liked: isLike, disliked: !isLike } : m
            ),
          };
        }
        return s;
      })
    );
    showToast(isLike ? 'Cảm ơn bạn đã thích câu trả lời của AI! 👍' : 'Đã ghi nhận phản hồi để cải thiện AI.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        register,
        logout,
        loginWithGoogle,
        currentRole,
        setCurrentRole,
        restaurants,
        activeRestaurant,
        setActiveRestaurant,
        addRestaurant,
        updateRestaurant,
        deleteRestaurant,
        cart,
        cartRestaurant,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        deliveryFee,
        discountAmount,
        cartTotal,
        appliedVoucher,
        applyVoucher,
        availableVouchers,
        addVoucher,
        deleteVoucher,
        orders,
        activeOrder,
        setActiveOrder,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        reorderOldOrder,
        favorites,
        toggleFavorite,
        currentAddress,
        setCurrentAddress,
        reviews,
        addReview,
        likeReview,
        deleteReview,
        replyReview,
        toasts,
        showToast,
        removeToast,
        isCartOpen,
        setIsCartOpen,
        isAddressModalOpen,
        setIsAddressModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalView,
        setAuthModalView,
        openAuthModal,
        isAdminAuthModalOpen,
        setIsAdminAuthModalOpen,
        adminAuthModalView,
        setAdminAuthModalView,
        openAdminAuthModal,
        loginAdmin,
        registerAdmin,
        isChatbotOpen,
        setIsChatbotOpen,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        addFoodToMenu,
        updateFoodInMenu,
        deleteFoodFromMenu,
        toggleFoodAvailability,
        toggleRestaurantOpen,
        chatSessions,
        activeSessionId,
        setActiveSessionId,
        createChatSession,
        deleteChatSession,
        addMessageToSession,
        rateMessage,
        playNotificationSound,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
