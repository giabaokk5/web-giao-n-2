// Comprehensive TypeScript interfaces for BeFood Full-stack Platform (12 Modules)

export type Role =
  | 'customer'
  | 'merchant'
  | 'kitchen'
  | 'warehouse'
  | 'driver'
  | 'support'
  | 'marketing'
  | 'accounting'
  | 'admin'
  | 'ai_center'
  | 'analytics'
  | 'hr';

export type LoyaltyTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND';

export type DaNangDistrict =
  | 'Hải Châu'
  | 'Sơn Trà'
  | 'Ngũ Hành Sơn'
  | 'Thanh Khê'
  | 'Liên Chiểu'
  | 'Cẩm Lệ'
  | 'Hòa Vang';

export type DaNangLandmark =
  | 'ALL'
  | 'CAU_RONG' // Gần Cầu Rồng & Sông Hàn
  | 'MY_KHE' // Gần Biển Mỹ Khê & Bán đảo Sơn Trà
  | 'AIRPORT' // Gần Sân bay Quốc tế Đà Nẵng
  | 'UNIVERSITIES' // Cụm ĐH Bách Khoa, Sư Phạm, Kinh Tế
  | 'NIGHT_MARKET'; // Chợ đêm Sơn Trà & Chợ đêm Helio

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: Role;
  addresses: Address[];
  selectedAddressId?: string;
  walletBalance: number;
  loyaltyPoints: number;
  loyaltyTier: LoyaltyTier;
  allergies: string[]; // e.g. ['Đậu phộng', 'Hải sản', 'Trứng', 'Sữa']
  dietaryPreference?: 'ALL' | 'VEGETARIAN' | 'HEALTHY' | 'GLUTEN_FREE';
}

export interface Address {
  id: string;
  title: string;
  detail: string;
  ward: string;
  district: string;
  city: string;
  lat: number;
  lng: number;
  isDefault?: boolean;
  recipientName?: string;
  recipientPhone?: string;
  isGiftOrder?: boolean;
}

export interface FoodOptionItem {
  id: string;
  name: string;
  price: number;
}

export interface FoodSize {
  id: string;
  name: string;
  priceDiff: number;
}

export interface FoodTopping {
  id: string;
  name: string;
  price: number;
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isBestSeller?: boolean;
  isAvailable: boolean;
  soldCount: number;
  likesCount: number;
  sizes?: FoodSize[];
  toppings?: FoodTopping[];
  sugarLevels?: string[];
  iceLevels?: string[];
  allergens?: string[]; // ['Hải sản', 'Đậu phộng', 'Mè', 'Bột mì']
  calories?: number;
  isVegetarian?: boolean;
  mealTime?: ('BREAKFAST' | 'LUNCH' | 'DINNER' | 'ALL_DAY' | 'SNACK')[];
}

export interface Branch {
  id: string;
  restaurantId: string;
  name: string;
  address: string;
  district: string;
  phone: string;
  isOpen: boolean;
  todayRevenue: number;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  coverImage: string;
  categories: string[];
  rating: number;
  totalReviews: number;
  distanceKm: number;
  deliveryTimeMin: number;
  minOrderPrice: number;
  address: string;
  district: string;
  city: string;
  lat: number;
  lng: number;
  isOpen: boolean;
  openHours: string;
  isVerified: boolean;
  featuredPromo?: string;
  hasFreeShip?: boolean;
  landmark?: DaNangLandmark;
  branches?: Branch[];
  menu: FoodItem[];
}

export interface CartItemOption {
  size?: FoodSize;
  toppings: FoodTopping[];
  sugarLevel?: string;
  iceLevel?: string;
  note?: string;
}

export interface CartItem {
  cartItemId: string;
  food: FoodItem;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  options: CartItemOption;
  addedByMember?: string; // Group order member name
}

export interface GroupOrderMember {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  itemsTotal: number;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'DRIVER_ASSIGNED'
  | 'DRIVER_PICKED_UP'
  | 'DELIVERING'
  | 'COMPLETED'
  | 'CANCELLED';

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  vehicleType: string;
  licensePlate: string;
  rating: number;
  completedTrips: number;
  currentLat: number;
  currentLng: number;
  walletBalance?: number;
  todayEarnings?: number;
}

export interface Order {
  id: string;
  orderCode: string;
  userId: string;
  userName: string;
  userPhone: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantLogo: string;
  deliveryAddress: Address;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  voucherCode?: string;
  driverTip: number;
  totalAmount: number;
  paymentMethod: 'COD' | 'BEPAY' | 'MOMO' | 'VNPAY' | 'BANK_CARD' | 'VIETQR';
  paymentStatus: 'PAID' | 'UNPAID';
  orderStatus: OrderStatus;
  statusHistory: { status: OrderStatus; timestamp: string; note: string }[];
  driver?: DriverInfo;
  createdAt: string;
  estimatedDeliveryTime: string;
  customerNote?: string;
  isReviewed?: boolean;
  orderType?: 'DELIVERY' | 'TAKEAWAY' | 'DINE_IN';
  scheduledTime?: string; // e.g. '12:00 Hôm nay'
  isRecurring?: boolean; // Subscription
  recurringDays?: string; // 'T2, T4, T6'
  deliveryOtp?: string; // OTP for driver confirmation
  refundStatus?: 'NONE' | 'REQUESTED' | 'REFUNDED';
  refundAmount?: number;
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'PERCENT' | 'FIXED' | 'FREESHIP';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expireDate: string;
  badge: string;
  isBirthdaySpecial?: boolean;
}

export interface Review {
  id: string;
  restaurantId: string;
  restaurantName?: string;
  foodId?: string;
  foodName?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number; // 1 to 5
  comment: string;
  tags?: string[];
  images?: string[];
  orderCode?: string;
  likes: number;
  isLiked?: boolean;
  createdAt: string;
  reply?: {
    author: string;
    content: string;
    date: string;
  };
}

// Kitchen KDS Ticket
export interface KitchenTicket {
  id: string;
  orderCode: string;
  restaurantName: string;
  orderType: 'DELIVERY' | 'TAKEAWAY' | 'DINE_IN';
  status: 'PENDING' | 'COOKING' | 'DONE';
  createdAtTime: string;
  elapsedMinutes: number;
  items: { name: string; quantity: number; notes?: string }[];
}

// Warehouse Inventory Item
export interface InventoryItem {
  id: string;
  ingredientName: string;
  category: string;
  currentStock: number;
  unit: string;
  minThreshold: number;
  supplier: string;
  expiryDate: string;
  isExpiringSoon: boolean;
  costPerUnit: number;
}

// Support Ticket
export interface SupportTicketMessage {
  id: string;
  sender: 'customer' | 'agent' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  ticketCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  orderCode?: string;
  restaurantName?: string;
  topic: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  messages: SupportTicketMessage[];
}

// Accounting Settlement
export interface RestaurantSettlement {
  id: string;
  restaurantId: string;
  restaurantName: string;
  period: string;
  totalOrders: number;
  grossAmount: number;
  commissionAmount: number; // 18%
  payoutAmount: number;
  status: 'PENDING' | 'PAID';
}

// Marketing Campaign
export interface MarketingCampaign {
  id: string;
  title: string;
  targetGroup: 'ALL' | 'NEW_USERS' | 'VIP' | 'CHURN_RISK';
  type: 'VOUCHER' | 'BOGO' | 'FLASH_SALE';
  bannerImage: string;
  discountInfo: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'SCHEDULED' | 'ENDED';
}
