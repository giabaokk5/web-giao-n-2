import {
  Restaurant,
  FoodItem,
  Voucher,
  Address,
  DriverInfo,
  Order,
  User,
  SupportTicket,
  KitchenTicket,
  InventoryItem,
  RestaurantSettlement,
  MarketingCampaign,
  Review,
} from '../types';

export const INITIAL_USER: User = {
  id: 'usr-101',
  name: 'Trần Minh Quang',
  email: 'minhquang.tran@gmail.com',
  phone: '0908 123 456',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  role: 'customer',
  walletBalance: 350000,
  loyaltyPoints: 1850,
  loyaltyTier: 'GOLD',
  allergies: ['Đậu phộng'],
  dietaryPreference: 'ALL',
  addresses: [
    {
      id: 'addr-dn-1',
      title: 'Văn phòng làm việc (Trung tâm)',
      detail: 'Tầng 8, Tòa nhà Software Park, 155 Nguyễn Văn Linh',
      ward: 'Vĩnh Trung',
      district: 'Hải Châu',
      city: 'TP. Đà Nẵng',
      lat: 16.0601,
      lng: 108.2120,
      isDefault: true,
    },
    {
      id: 'addr-dn-2',
      title: 'Căn hộ gần biển Mỹ Khê',
      detail: 'Số 12 An Thượng 26, Khu phố Tây An Thượng',
      ward: 'Mỹ An',
      district: 'Ngũ Hành Sơn',
      city: 'TP. Đà Nẵng',
      lat: 16.0495,
      lng: 108.2435,
      isDefault: false,
    },
    {
      id: 'addr-dn-3',
      title: 'Nhà bố mẹ (Thanh Khê)',
      detail: 'Số 88 Điện Biên Phủ',
      ward: 'Chính Gián',
      district: 'Thanh Khê',
      city: 'TP. Đà Nẵng',
      lat: 16.0682,
      lng: 108.1965,
      isDefault: false,
      recipientName: 'Bác Trần Văn An',
      recipientPhone: '0913 999 888',
      isGiftOrder: true,
    },
    {
      id: 'addr-dn-4',
      title: 'Ký túc xá ĐH Bách Khoa',
      detail: '54 Nguyễn Lương Bằng',
      ward: 'Hòa Khánh Bắc',
      district: 'Liên Chiểu',
      city: 'TP. Đà Nẵng',
      lat: 16.0748,
      lng: 108.1512,
      isDefault: false,
    },
  ],
  selectedAddressId: 'addr-dn-1',
};

export const MOCK_CATEGORIES = [
  { id: 'cat-all', name: 'Tất cả Đà Nẵng', icon: '🍽️', color: 'bg-amber-100 text-amber-900' },
  { id: 'cat-miquang', name: 'Mì Quảng Xứ Quảng', icon: '🍜', color: 'bg-orange-100 text-orange-900' },
  { id: 'cat-banhtrang', name: 'Bánh Tráng Thịt Heo', icon: '🥓', color: 'bg-red-100 text-red-900' },
  { id: 'cat-haisan', name: 'Hải Sản Biển Mỹ Khê', icon: '🦞', color: 'bg-blue-100 text-blue-900' },
  { id: 'cat-bunchaca', name: 'Bún Chả Cá & Bún Bò', icon: '🍲', color: 'bg-yellow-100 text-yellow-900' },
  { id: 'cat-banhxeo', name: 'Bánh Xèo & Nem Lụi', icon: '🥟', color: 'bg-amber-100 text-amber-900' },
  { id: 'cat-com', name: 'Cơm Gà & Cơm Niêu', icon: '🍚', color: 'bg-emerald-100 text-emerald-900' },
  { id: 'cat-trasua', name: 'Trà Sữa & Cà Phê Muối', icon: '🧋', color: 'bg-pink-100 text-pink-900' },
  { id: 'cat-garan', name: 'Gà Rán, Burger & Pizza', icon: '🍗', color: 'bg-rose-100 text-rose-900' },
  { id: 'cat-trangmieng', name: 'Chè Sầu Liên & Tráng Miệng', icon: '🍨', color: 'bg-purple-100 text-purple-900' },
];

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'cat-miquang': ['mì quảng', 'mi quang', 'cao lầu', 'mì gà', 'mì ếch', 'mì tôm', 'quảng'],
  'cat-banhtrang': ['bánh tráng', 'banh trang', 'thịt heo', 'cuốn', 'đại lộc', 'trần', 'hai đầu da', 'thịt quay', 'bánh tráng mè'],
  'cat-haisan': ['hải sản', 'hai san', 'tôm', 'mực', 'cá', 'nghêu', 'cua', 'ốc', 'sò', 'chíp chíp', 'bé mặn', 'mỹ khê'],
  'cat-bunchaca': ['bún chả cá', 'bun cha ca', 'bún bò', 'bún cá', 'bún riêu', 'bún mắm', 'chả cá', 'hờn', 'bún'],
  'cat-banhxeo': ['bánh xèo', 'banh xeo', 'nem lụi', 'nem lui', 'ram bắp', 'bà dưỡng', 'bánh khoái'],
  'cat-com': ['cơm gà', 'com ga', 'cơm niêu', 'cơm tấm', 'cơm sườn', 'cơm', 'cơm thố', 'cơm chiên'],
  'cat-trasua': ['trà sữa', 'tra sua', 'cà phê', 'ca phe', 'cà phê muối', 'trà', 'ô long', 'phúc long', 'tocotoco', 'nước ép'],
  'cat-garan': ['gà rán', 'ga ran', 'burger', 'pizza', 'khoai tây', 'kfc', '4p', 'gà sốt', 'mì ý'],
  'cat-trangmieng': ['chè', 'che', 'sầu riêng', 'sầu liên', 'tráng miệng', 'ăn vặt', 'bánh tráng trộn', 'kem', 'bánh flan', 'sữa chua'],
};

export const matchRestaurantCategory = (res: Restaurant, categoryId: string): boolean => {
  if (!categoryId || categoryId === 'cat-all') return true;

  const keywords = CATEGORY_KEYWORDS[categoryId];
  const catObj = MOCK_CATEGORIES.find((c) => c.id === categoryId);
  const catNameLower = catObj ? catObj.name.toLowerCase() : '';

  // 1. Direct name match in categories array
  if (
    catNameLower &&
    res.categories.some((c) => {
      const cLower = c.toLowerCase();
      return cLower.includes(catNameLower) || catNameLower.includes(cLower);
    })
  ) {
    return true;
  }

  if (keywords) {
    // 2. Keyword match in categories
    if (res.categories.some((c) => keywords.some((k) => c.toLowerCase().includes(k)))) {
      return true;
    }

    // 3. Keyword match in restaurant name or tagline
    const nameTag = (res.name + ' ' + (res.tagline || '')).toLowerCase();
    if (keywords.some((k) => nameTag.includes(k))) {
      return true;
    }

    // 4. Keyword match in menu dishes
    if (
      res.menu &&
      res.menu.some((f) => {
        const foodText = (f.name + ' ' + f.category + ' ' + (f.description || '')).toLowerCase();
        return keywords.some((k) => foodText.includes(k));
      })
    ) {
      return true;
    }
  }

  return false;
};

export const getMatchingDishesForCategory = (restaurants: Restaurant[], categoryId: string): FoodItem[] => {
  if (!categoryId || categoryId === 'cat-all') return [];
  const keywords = CATEGORY_KEYWORDS[categoryId];
  if (!keywords) return [];

  const dishes: FoodItem[] = [];
  const seenIds = new Set<string>();

  restaurants.forEach((r) => {
    (r.menu || []).forEach((food) => {
      if (seenIds.has(food.id)) return;
      const text = (food.name + ' ' + food.category + ' ' + (food.description || '')).toLowerCase();
      if (keywords.some((k) => text.includes(k))) {
        seenIds.add(food.id);
        dishes.push(food);
      }
    });
  });

  return dishes;
};

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    "id": "res-bamuamiquang",
    "name": "Mì Quảng Bà Mua - Đặc Sản Đà Nẵng",
    "tagline": "Mì Quảng trứ danh xứ Quảng - Sợi mì mềm dai, nước nhưn đậm đà truyền thống",
    "logo": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80",
    "coverImage": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&auto=format&fit=crop&q=80",
    "categories": [
      "Mì Quảng Xứ Quảng",
      "Đặc Sản Đà Nẵng"
    ],
    "rating": 4.96,
    "totalReviews": 2420,
    "distanceKm": 0.8,
    "deliveryTimeMin": 18,
    "minOrderPrice": 40000,
    "address": "95A Nguyễn Tri Phương, Phường Chính Gián, Quận Thanh Khê, TP. Đà Nẵng",
    "district": "Hải Châu",
    "city": "TP. Đà Nẵng",
    "lat": 16.062,
    "lng": 108.2045,
    "isOpen": true,
    "openHours": "06:00 - 22:00",
    "isVerified": true,
    "featuredPromo": "Tặng bánh tráng mè nướng cho đơn từ 80k",
    "hasFreeShip": true,
    "landmark": "CAU_RONG",
    "branches": [
      {
        "id": "br-bm-1",
        "restaurantId": "res-bamuamiquang",
        "name": "Bà Mua - Nguyễn Tri Phương (Thanh Khê)",
        "address": "95A Nguyễn Tri Phương, Thanh Khê",
        "district": "Thanh Khê",
        "phone": "0905 123 456",
        "isOpen": true,
        "todayRevenue": 18500000
      },
      {
        "id": "br-bm-2",
        "restaurantId": "res-bamuamiquang",
        "name": "Bà Mua - Trần Bình Trọng (Hải Châu)",
        "address": "19 Trần Bình Trọng, Hải Châu",
        "district": "Hải Châu",
        "phone": "0905 789 123",
        "isOpen": true,
        "todayRevenue": 24200000
      },
      {
        "id": "br-bm-3",
        "restaurantId": "res-bamuamiquang",
        "name": "Bà Mua - 40 Ngũ Hành Sơn (Biển Mỹ Khê)",
        "address": "40 Ngũ Hành Sơn, Ngũ Hành Sơn",
        "district": "Ngũ Hành Sơn",
        "phone": "0905 456 789",
        "isOpen": true,
        "todayRevenue": 15300000
      }
    ],
    "menu": [
      {
        "id": "f-bm-1",
        "restaurantId": "res-bamuamiquang",
        "name": "Mì Quảng Gà Ta Rút Xương & Trứng Cút",
        "description": "Thịt gà ta thả vườn rim nghệ thơm nức, cắn ngập thịt, trứng cút bùi, rau sống bắp chuối tươi mát, đậu phộng rang giòn.",
        "price": 45000,
        "originalPrice": 55000,
        "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80",
        "category": "Mì Quảng Truyền Thống",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 3840,
        "likesCount": 1250,
        "allergens": [
          "Đậu phộng",
          "Trứng"
        ],
        "calories": 520,
        "mealTime": [
          "BREAKFAST",
          "LUNCH",
          "DINNER"
        ],
        "sizes": [
          {
            "id": "s-std",
            "name": "Tô Vừa",
            "priceDiff": 0
          },
          {
            "id": "s-big",
            "name": "Tô Lớn (Nhiều thịt & mì)",
            "priceDiff": 15000
          }
        ],
        "toppings": [
          {
            "id": "top-egg",
            "name": "Thêm 2 trứng cút rim",
            "price": 8000
          },
          {
            "id": "top-ricepaper",
            "name": "Bánh tráng nướng mè Đại Lộc",
            "price": 10000
          }
        ]
      },
      {
        "id": "f-bm-2",
        "restaurantId": "res-bamuamiquang",
        "name": "Mì Quảng Tôm Thịt Ba Chỉ Đậm Đà",
        "description": "Tôm sông rim ngọt thịt, thịt ba chỉ heo mọi rim cháy cạnh, nước nhưn sánh ngọt từ tôm thịt tự nhiên, ăn kèm bánh tráng mè nướng.",
        "price": 48000,
        "originalPrice": 55000,
        "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80",
        "category": "Mì Quảng Truyền Thống",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 2950,
        "likesCount": 910,
        "allergens": [
          "Hải sản",
          "Đậu phộng"
        ],
        "calories": 540,
        "mealTime": [
          "BREAKFAST",
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-bm-3",
        "restaurantId": "res-bamuamiquang",
        "name": "Mì Quảng Sườn Non Rim Cay Xứ Quảng",
        "description": "Sườn non heo chọn lọc hầm mềm róc xương, rim sốt hạt điều đỏ óng ánh, vị hơi cay nồng ấm bụng ngày mưa Đà Nẵng.",
        "price": 52000,
        "originalPrice": 60000,
        "image": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&auto=format&fit=crop&q=80",
        "category": "Mì Quảng Truyền Thống",
        "isBestSeller": false,
        "isAvailable": true,
        "soldCount": 1680,
        "likesCount": 520,
        "allergens": [
          "Đậu phộng"
        ],
        "calories": 580,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-bm-4",
        "restaurantId": "res-bamuamiquang",
        "name": "Mì Quảng Lươn Đồng Xứ Quảng",
        "description": "Lươn đồng béo vàng xào sả ớt nghệ tươi, nước dùng thơm nồng ấm cay, món tẩm bổ đặc sản dân dã.",
        "price": 55000,
        "originalPrice": 65000,
        "image": "https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&auto=format&fit=crop&q=80",
        "category": "Món Đặc Biệt",
        "isBestSeller": false,
        "isAvailable": true,
        "soldCount": 940,
        "likesCount": 310,
        "allergens": [
          "Đậu phộng"
        ],
        "calories": 510,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-bm-5",
        "restaurantId": "res-bamuamiquang",
        "name": "Bánh Tráng Đại Lộc Mè Đen Nướng Giòn",
        "description": "Bánh tráng gạo nguyên chất phơi sương Đại Lộc rắc nhiều mè đen, nướng than hoa giòn rụm bẻ đôi ăn kèm mì quảng.",
        "price": 12000,
        "image": "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop&q=80",
        "category": "Món Phụ & Ăn Kèm",
        "isAvailable": true,
        "soldCount": 4200,
        "likesCount": 880,
        "calories": 120,
        "mealTime": [
          "ALL_DAY"
        ]
      },
      {
        "id": "f-bm-6",
        "restaurantId": "res-bamuamiquang",
        "name": "Sữa Đậu Nành Lá Dứa Tự Nấu (Chai 330ml)",
        "description": "Sữa đậu nành nguyên chất thơm mùi lá dứa tươi, ít đường thanh mát giải nhiệt.",
        "price": 15000,
        "image": "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format&fit=crop&q=80",
        "category": "Đồ Uống Giải Nhiệt",
        "isAvailable": true,
        "soldCount": 2300,
        "likesCount": 610,
        "calories": 90,
        "mealTime": [
          "ALL_DAY"
        ]
      }
    ]
  },
  {
    "id": "res-beptrang-miquang",
    "name": "Mì Quảng Ếch Bếp Trang - Cầu Rồng",
    "tagline": "Mì Quảng Ếch nguyên con để thố đất trứ danh - Đẳng cấp ẩm thực Đà Thành",
    "logo": "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop&q=80",
    "coverImage": "https://images.unsplash.com/photo-1544025162-d76694265947?w=900&auto=format&fit=crop&q=80",
    "categories": [
      "Mì Quảng Xứ Quảng",
      "Đặc Sản Đà Nẵng"
    ],
    "rating": 4.95,
    "totalReviews": 3120,
    "distanceKm": 1.1,
    "deliveryTimeMin": 20,
    "minOrderPrice": 60000,
    "address": "441 Ông Ích Khiêm, Phường Nam Dương, Quận Hải Châu, TP. Đà Nẵng",
    "district": "Hải Châu",
    "city": "TP. Đà Nẵng",
    "lat": 16.0645,
    "lng": 108.216,
    "isOpen": true,
    "openHours": "06:30 - 22:30",
    "isVerified": true,
    "featuredPromo": "Tặng ly trà sả hạt chia cho đơn từ 120k",
    "hasFreeShip": true,
    "landmark": "CAU_RONG",
    "branches": [
      {
        "id": "br-bt-1",
        "restaurantId": "res-beptrang-miquang",
        "name": "Bếp Trang - Ông Ích Khiêm (Hải Châu)",
        "address": "441 Ông Ích Khiêm, Hải Châu",
        "district": "Hải Châu",
        "phone": "0905 666 888",
        "isOpen": true,
        "todayRevenue": 28500000
      },
      {
        "id": "br-bt-2",
        "restaurantId": "res-beptrang-miquang",
        "name": "Bếp Trang - Bạch Đằng Sông Hàn",
        "address": "24 Bạch Đằng, Hải Châu",
        "district": "Hải Châu",
        "phone": "0905 888 999",
        "isOpen": true,
        "todayRevenue": 34100000
      }
    ],
    "menu": [
      {
        "id": "f-bt-1",
        "restaurantId": "res-beptrang-miquang",
        "name": "Mẹt Mì Quảng Ếch Bếp Trang (Đặc Biệt)",
        "description": "Ếch đồng nguyên con om thố đất sôi sùng sục cùng sả nghệ, mì vàng để mẹt riêng cùng rau sống 9 vị tươi ngon và bánh tráng mè nướng.",
        "price": 65000,
        "originalPrice": 75000,
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80",
        "category": "Đặc Sản Bếp Trang",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 4620,
        "likesCount": 1890,
        "allergens": [
          "Đậu phộng"
        ],
        "calories": 590,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-bt-2",
        "restaurantId": "res-beptrang-miquang",
        "name": "Mì Quảng Bếp Trang Tôm & Thịt Ba Chỉ Heo",
        "description": "Tôm rim ngọt đậm đà hòa quyện nước sốt gia truyền Bếp Trang thơm nức mũi.",
        "price": 55000,
        "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80",
        "category": "Mì Quảng Truyền Thống",
        "isAvailable": true,
        "soldCount": 2100,
        "likesCount": 750,
        "allergens": [
          "Hải sản",
          "Đậu phộng"
        ],
        "calories": 530,
        "mealTime": [
          "BREAKFAST",
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-bt-3",
        "restaurantId": "res-beptrang-miquang",
        "name": "Mì Quảng Cá Lóc Đồng Chiên Giòn",
        "description": "Phi lê cá lóc đồng chiên vàng giòn thơm lừng ngấm sốt nghệ tiêu rừng cay nhẹ.",
        "price": 58000,
        "image": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&auto=format&fit=crop&q=80",
        "category": "Đặc Sản Bếp Trang",
        "isAvailable": true,
        "soldCount": 1450,
        "likesCount": 520,
        "calories": 500,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-bt-4",
        "restaurantId": "res-beptrang-miquang",
        "name": "Chả Ram Tôm Đất Bếp Trang (Đĩa 6 cuốn)",
        "description": "Tôm đất tươi cuốn bánh tráng giòn rụm chiên ráo dầu, chấm kèm tương đậu béo bùi.",
        "price": 45000,
        "image": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80",
        "category": "Món Khai Vị",
        "isAvailable": true,
        "soldCount": 2890,
        "likesCount": 940,
        "calories": 320,
        "mealTime": [
          "ALL_DAY"
        ]
      },
      {
        "id": "f-bt-5",
        "restaurantId": "res-beptrang-miquang",
        "name": "Trà Nha Đam Hạt Chia Bếp Trang",
        "description": "Trà sả nha đam giòn hạt chia bổ dưỡng thanh nhiệt.",
        "price": 20000,
        "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80",
        "category": "Đồ Uống Giải Nhiệt",
        "isAvailable": true,
        "soldCount": 1980,
        "likesCount": 420,
        "calories": 80,
        "mealTime": [
          "ALL_DAY"
        ]
      }
    ]
  },
  {
    "id": "res-dacsan-tran",
    "name": "Đặc Sản Trần - Bánh Tráng Cuốn Thịt Heo",
    "tagline": "Thịt heo 2 đầu da luộc chuẩn tỉ lệ - Nước chấm mắm nêm Dì Cẩn gia truyền đượm vị",
    "logo": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80",
    "coverImage": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&auto=format&fit=crop&q=80",
    "categories": [
      "Bánh Tráng Thịt Heo",
      "Đặc Sản Đà Nẵng"
    ],
    "rating": 4.97,
    "totalReviews": 4560,
    "distanceKm": 1.2,
    "deliveryTimeMin": 22,
    "minOrderPrice": 70000,
    "address": "04 Lê Duẩn, Phường Thạch Thang, Quận Hải Châu, TP. Đà Nẵng",
    "district": "Hải Châu",
    "city": "TP. Đà Nẵng",
    "lat": 16.0712,
    "lng": 108.2235,
    "isOpen": true,
    "openHours": "08:00 - 22:00",
    "isVerified": true,
    "featuredPromo": "Giảm 20k đơn từ 170k + Freeship Hải Châu",
    "hasFreeShip": true,
    "landmark": "CAU_RONG",
    "branches": [
      {
        "id": "br-tr-1",
        "restaurantId": "res-dacsan-tran",
        "name": "Đặc Sản Trần - Lê Duẩn (Hải Châu)",
        "address": "04 Lê Duẩn, Hải Châu",
        "district": "Hải Châu",
        "phone": "0236 3849 022",
        "isOpen": true,
        "todayRevenue": 42000000
      },
      {
        "id": "br-tr-2",
        "restaurantId": "res-dacsan-tran",
        "name": "Đặc Sản Trần - Phạm Văn Đồng (Biển Mỹ Khê)",
        "address": "Phạm Văn Đồng, Sơn Trà",
        "district": "Sơn Trà",
        "phone": "0236 3849 023",
        "isOpen": true,
        "todayRevenue": 38500000
      }
    ],
    "menu": [
      {
        "id": "f-tr-1",
        "restaurantId": "res-dacsan-tran",
        "name": "Bánh Tráng Cuốn Thịt Heo 2 Đầu Da Luộc (Suất Chuẩn)",
        "description": "Từng lát thịt heo 2 đầu da luộc trong vắt, bì mỏng mềm, cuốn bánh tráng phơi sương, mì mỏng cùng 12 loại rau rừng tươi rói, chấm mắm nêm gia truyền.",
        "price": 85000,
        "originalPrice": 99000,
        "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80",
        "category": "Bánh Tráng Cuốn Thịt Heo",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 6890,
        "likesCount": 2310,
        "allergens": [
          "Hải sản"
        ],
        "calories": 640,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-tr-2",
        "restaurantId": "res-dacsan-tran",
        "name": "Bánh Tráng Cuốn Thịt Heo Quay Giòn Bì",
        "description": "Thịt ba chỉ quay giòn rụm lớp bì, phần nạc ngọt mềm mọng nước, cuốn bánh tráng rau rừng chấm mắm nêm thơm nồng vị ớt tỏi.",
        "price": 90000,
        "originalPrice": 105000,
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80",
        "category": "Bánh Tráng Cuốn Thịt Heo",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 4120,
        "likesCount": 1650,
        "allergens": [
          "Hải sản"
        ],
        "calories": 680,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-tr-3",
        "restaurantId": "res-dacsan-tran",
        "name": "Bún Mắm Nêm Thịt Quay Chả Bò Đà Nẵng",
        "description": "Tô bún mắm nêm cay nồng thơm phức mùi dứa băm tỏi ớt, thịt heo quay bì giòn rụm kết hợp chả bò Đà Nẵng ngọt giòn sần sật.",
        "price": 45000,
        "originalPrice": 55000,
        "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80",
        "category": "Món Bún Đặc Sản",
        "isBestSeller": false,
        "isAvailable": true,
        "soldCount": 3200,
        "likesCount": 1140,
        "allergens": [
          "Hải sản",
          "Đậu phộng"
        ],
        "calories": 520,
        "mealTime": [
          "BREAKFAST",
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-tr-4",
        "restaurantId": "res-dacsan-tran",
        "name": "Bánh Bèo Chén Nhân Tôm Thịt Ướt (Khay 8 chén)",
        "description": "Bánh bèo bột gạo mềm mịn đúc trong từng chén sứ, rưới nhân tôm thịt băm sốt ướt màu cam óng và tóp mỡ giòn.",
        "price": 35000,
        "image": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80",
        "category": "Bánh Quê Truyền Thống",
        "isAvailable": true,
        "soldCount": 2980,
        "likesCount": 910,
        "calories": 340,
        "mealTime": [
          "ALL_DAY"
        ]
      },
      {
        "id": "f-tr-5",
        "restaurantId": "res-dacsan-tran",
        "name": "Chả Bò Đà Nẵng Cây 500g (Loại Đặc Biệt)",
        "description": "Chả bò nguyên chất không pha bột, thơm nức tiêu đen hạt giã dập và tỏi Lý Sơn, đóng gói hút chân không quà biếu.",
        "price": 180000,
        "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80",
        "category": "Đặc Sản Làm Quà",
        "isAvailable": true,
        "soldCount": 1750,
        "likesCount": 820,
        "calories": 890,
        "mealTime": [
          "ALL_DAY"
        ]
      },
      {
        "id": "f-tr-6",
        "restaurantId": "res-dacsan-tran",
        "name": "Chai Mắm Nêm Dì Cẩn Gia Truyền (500ml)",
        "description": "Chai mắm nêm thơm nồng nguyên chất đã được pha sẵn tỏi ớt đường dứa chua ngọt.",
        "price": 45000,
        "image": "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500&auto=format&fit=crop&q=80",
        "category": "Đặc Sản Làm Quà",
        "isAvailable": true,
        "soldCount": 3100,
        "likesCount": 990,
        "calories": 180,
        "mealTime": [
          "ALL_DAY"
        ]
      }
    ]
  },
  {
    "id": "res-banhtrang-bahuong",
    "name": "Bánh Tráng Cuốn Thịt Heo Bà Hường",
    "tagline": "Quán ăn lâu năm của người bản địa - Rau sống Đại Lộc tươi ngon phong phú",
    "logo": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80",
    "coverImage": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&auto=format&fit=crop&q=80",
    "categories": [
      "Bánh Tráng Thịt Heo",
      "Đặc Sản Đà Nẵng"
    ],
    "rating": 4.92,
    "totalReviews": 2150,
    "distanceKm": 2.1,
    "deliveryTimeMin": 25,
    "minOrderPrice": 50000,
    "address": "126 Duy Tân, Phường Hòa Thuận Nam, Quận Hải Châu, TP. Đà Nẵng",
    "district": "Hải Châu",
    "city": "TP. Đà Nẵng",
    "lat": 16.0501,
    "lng": 108.2145,
    "isOpen": true,
    "openHours": "09:00 - 21:30",
    "isVerified": true,
    "featuredPromo": "Tặng nước ngô ngọt cho đơn từ 100k",
    "hasFreeShip": true,
    "landmark": "AIRPORT",
    "menu": [
      {
        "id": "f-bh-1",
        "restaurantId": "res-banhtrang-bahuong",
        "name": "Suất Bánh Tráng Thịt Heo Đại Lộc Bà Hường",
        "description": "Thịt heo luộc xắt mỏng vừa miệng, mắm nêm thơm lừng cay cay quyện rau sống bắp chuối diếp cá.",
        "price": 80000,
        "originalPrice": 90000,
        "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80",
        "category": "Món Bánh Tráng",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 3100,
        "likesCount": 980,
        "allergens": [
          "Hải sản"
        ],
        "calories": 610,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-bh-2",
        "restaurantId": "res-banhtrang-bahuong",
        "name": "Bánh Tráng Cuốn Bò Tái Nhúng Dấm Bà Hường",
        "description": "Bò bắp hoa mềm ngọt nhúng dấm chua nhẹ, cuốn rau thơm chuối chát chấm mắm nêm đậm vị.",
        "price": 95000,
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80",
        "category": "Món Bánh Tráng",
        "isAvailable": true,
        "soldCount": 1620,
        "likesCount": 540,
        "calories": 580,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-bh-3",
        "restaurantId": "res-banhtrang-bahuong",
        "name": "Bún Thịt Nướng Kim Tiền Nướng Mỡ Chài",
        "description": "Thịt nướng thơm phức bọc mỡ chài béo ngọt, ăn cùng bún tươi, lạc rang và đồ chua.",
        "price": 40000,
        "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80",
        "category": "Món Bún",
        "isAvailable": true,
        "soldCount": 2210,
        "likesCount": 710,
        "calories": 490,
        "mealTime": [
          "BREAKFAST",
          "LUNCH"
        ]
      },
      {
        "id": "f-bh-4",
        "restaurantId": "res-banhtrang-bahuong",
        "name": "Ram Cuốn Cải Chấm Tương Đậu Phộng",
        "description": "Ram bắp chiên vàng giòn cuốn cùng lá cải cay xanh mát, chấm sốt tương đậu phộng béo bùi.",
        "price": 35000,
        "image": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80",
        "category": "Món Ăn Kèm",
        "isAvailable": true,
        "soldCount": 2750,
        "likesCount": 890,
        "calories": 310,
        "mealTime": [
          "ALL_DAY"
        ]
      },
      {
        "id": "f-bh-5",
        "restaurantId": "res-banhtrang-bahuong",
        "name": "Nước Ngô Nếp Luộc Nóng Ngọt Thanh",
        "description": "Nước luộc bắp nếp nguyên chất ngọt thanh tự nhiên.",
        "price": 15000,
        "image": "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format&fit=crop&q=80",
        "category": "Đồ Uống",
        "isAvailable": true,
        "soldCount": 1420,
        "likesCount": 330,
        "calories": 60,
        "mealTime": [
          "ALL_DAY"
        ]
      }
    ]
  },
  {
    "id": "res-beman-seafood",
    "name": "Hải Sản Bé Mặn - Tươi Sống Biển Mỹ Khê",
    "tagline": "Vựa hải sản lớn nhất đường biển Võ Nguyên Giáp - Đánh bắt tươi sống trong ngày",
    "logo": "https://images.unsplash.com/photo-1559847844-5315695dadae?w=200&auto=format&fit=crop&q=80",
    "coverImage": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=900&auto=format&fit=crop&q=80",
    "categories": [
      "Hải Sản Biển Mỹ Khê",
      "Đặc Sản Đà Nẵng"
    ],
    "rating": 4.95,
    "totalReviews": 5890,
    "distanceKm": 2.8,
    "deliveryTimeMin": 28,
    "minOrderPrice": 100000,
    "address": "Lô 11 Võ Nguyên Giáp, Phường Mân Thái, Quận Sơn Trà, TP. Đà Nẵng",
    "district": "Sơn Trà",
    "city": "TP. Đà Nẵng",
    "lat": 16.0785,
    "lng": 108.2472,
    "isOpen": true,
    "openHours": "09:00 - 23:30",
    "isVerified": true,
    "featuredPromo": "Tặng phần chíp chíp hấp sả cho đơn từ 300k",
    "hasFreeShip": true,
    "landmark": "MY_KHE",
    "branches": [
      {
        "id": "br-bm-11",
        "restaurantId": "res-beman-seafood",
        "name": "Bé Mặn Quán - Võ Nguyên Giáp (Sơn Trà)",
        "address": "Lô 11 Võ Nguyên Giáp, Sơn Trà",
        "district": "Sơn Trà",
        "phone": "0905 252 525",
        "isOpen": true,
        "todayRevenue": 98000000
      },
      {
        "id": "br-bm-12",
        "restaurantId": "res-beman-seafood",
        "name": "Bé Mặn B - Hoàng Sa (Bán đảo Sơn Trà)",
        "address": "Đường Hoàng Sa, Sơn Trà",
        "district": "Sơn Trà",
        "phone": "0905 363 636",
        "isOpen": true,
        "todayRevenue": 64000000
      }
    ],
    "menu": [
      {
        "id": "f-beman-1",
        "restaurantId": "res-beman-seafood",
        "name": "Mực Cơm Hấp Gừng Chấm Muối Ớt Xanh (Phần 350g)",
        "description": "Mực cơm câu đêm tươi rói nhấp nháy túi mực, hấp cùng gừng non hành hoa thơm phức, chấm muối ớt xanh Nha Trang chua cay đã miệng.",
        "price": 120000,
        "originalPrice": 140000,
        "image": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80",
        "category": "Mực Biển Tươi Sống",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 4210,
        "likesCount": 1670,
        "allergens": [
          "Hải sản"
        ],
        "calories": 380,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-beman-2",
        "restaurantId": "res-beman-seafood",
        "name": "Mực Trứng Nướng Sa Tế Cực Cay Giòn Ngọt",
        "description": "Mực ôm đầy trứng béo ngậy ướp sa tế cay nồng nướng than hồng thơm điếc mũi.",
        "price": 145000,
        "originalPrice": 170000,
        "image": "https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&auto=format&fit=crop&q=80",
        "category": "Mực Biển Tươi Sống",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 3950,
        "likesCount": 1540,
        "allergens": [
          "Hải sản"
        ],
        "calories": 440,
        "mealTime": [
          "DINNER"
        ]
      },
      {
        "id": "f-beman-3",
        "restaurantId": "res-beman-seafood",
        "name": "Chíp Chíp Hấp Sả Ớt Nóng Hổi (Tô Lớn)",
        "description": "Nghêu hai cùi (chíp chíp) biển Sơn Trà thịt béo ngậy ngọt nước, hấp ngập sả đập dập thơm lừng, húp trọn từng muỗng nước dùng thanh ngọt.",
        "price": 85000,
        "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80",
        "category": "Nghêu Sò Ốc Hến",
        "isBestSeller": false,
        "isAvailable": true,
        "soldCount": 5200,
        "likesCount": 1980,
        "allergens": [
          "Hải sản"
        ],
        "calories": 220,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-beman-4",
        "restaurantId": "res-beman-seafood",
        "name": "Tôm Sú Biển Nướng Muối Ớt Đà Nẵng (Đĩa 300g)",
        "description": "Tôm sú tươi nhảy tanh tách nướng than hoa vỏ giòn thịt chắc ngọt thơm.",
        "price": 160000,
        "image": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500&auto=format&fit=crop&q=80",
        "category": "Tôm Cua Tươi Sống",
        "isAvailable": true,
        "soldCount": 2890,
        "likesCount": 1120,
        "allergens": [
          "Hải sản"
        ],
        "calories": 390,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-beman-5",
        "restaurantId": "res-beman-seafood",
        "name": "Càng Cua Rang Muối Ớt Cay Nồng",
        "description": "Càng cua chắc nịch phủ lớp muối ớt sấy cay giòn đậm vị nhậu.",
        "price": 180000,
        "image": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80",
        "category": "Tôm Cua Tươi Sống",
        "isAvailable": true,
        "soldCount": 1720,
        "likesCount": 680,
        "allergens": [
          "Hải sản"
        ],
        "calories": 420,
        "mealTime": [
          "DINNER"
        ]
      },
      {
        "id": "f-beman-6",
        "restaurantId": "res-beman-seafood",
        "name": "Lẩu Hải Sản Thập Cẩm Chua Cay Nước Dừa Biển",
        "description": "Nồi lẩu đầy ắp tôm sú, mực cơm, chíp chíp, cá bớp kèm rau muống hoa chuối và bún tươi.",
        "price": 250000,
        "originalPrice": 280000,
        "image": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&auto=format&fit=crop&q=80",
        "category": "Lẩu Hải Sản",
        "isAvailable": true,
        "soldCount": 1980,
        "likesCount": 890,
        "allergens": [
          "Hải sản"
        ],
        "calories": 780,
        "mealTime": [
          "DINNER"
        ]
      }
    ]
  },
  {
    "id": "res-namdanh-seafood",
    "name": "Hải Sản Năm Đảnh - Thọ Quang Sơn Trà",
    "tagline": "Quán hải sản ngõ hẻm nức tiếng - Giá bình dân tươi sống bậc nhất bán đảo Sơn Trà",
    "logo": "https://images.unsplash.com/photo-1559847844-5315695dadae?w=200&auto=format&fit=crop&q=80",
    "coverImage": "https://images.unsplash.com/photo-1559847844-5315695dadae?w=900&auto=format&fit=crop&q=80",
    "categories": [
      "Hải Sản Biển Mỹ Khê",
      "Đặc Sản Đà Nẵng"
    ],
    "rating": 4.93,
    "totalReviews": 3840,
    "distanceKm": 4.2,
    "deliveryTimeMin": 32,
    "minOrderPrice": 80000,
    "address": "K139/H59/38 Trần Quang Khải, Phường Thọ Quang, Quận Sơn Trà, TP. Đà Nẵng",
    "district": "Sơn Trà",
    "city": "TP. Đà Nẵng",
    "lat": 16.1012,
    "lng": 108.2415,
    "isOpen": true,
    "openHours": "10:00 - 22:00",
    "isVerified": true,
    "featuredPromo": "Đồng giá món ốc sốt bơ tỏi chỉ 85k",
    "hasFreeShip": true,
    "landmark": "MY_KHE",
    "menu": [
      {
        "id": "f-nd-1",
        "restaurantId": "res-namdanh-seafood",
        "name": "Ốc Hương Xào Bơ Tỏi Kèm Bánh Mì Nóng Giòn",
        "description": "Ốc hương tươi giòn sần sật sốt bơ béo ngậy đẫm tỏi phi thơm lừng chấm bánh mì.",
        "price": 110000,
        "originalPrice": 125000,
        "image": "https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&auto=format&fit=crop&q=80",
        "category": "Món Ốc Biển",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 3980,
        "likesCount": 1620,
        "allergens": [
          "Hải sản",
          "Sữa"
        ],
        "calories": 450,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-nd-2",
        "restaurantId": "res-namdanh-seafood",
        "name": "Sò Điệp Nướng Mỡ Hành Đậu Phộng Bùi Béo",
        "description": "Sò điệp cồi to ngọt nướng mỡ hành sôi xèo xèo rắc đậu phộng rang giòn thơm.",
        "price": 85000,
        "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80",
        "category": "Món Ốc Biển",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 3210,
        "likesCount": 1150,
        "allergens": [
          "Hải sản",
          "Đậu phộng"
        ],
        "calories": 360,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-nd-3",
        "restaurantId": "res-namdanh-seafood",
        "name": "Ghẹ Rang Me Chua Ngọt Đậm Vị (Phần 2 con)",
        "description": "Ghẹ tươi nhiều thịt rim sốt me chua ngọt cay dịu đậm đà.",
        "price": 150000,
        "image": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80",
        "category": "Món Cua Ghẹ",
        "isAvailable": true,
        "soldCount": 1840,
        "likesCount": 790,
        "allergens": [
          "Hải sản"
        ],
        "calories": 480,
        "mealTime": [
          "DINNER"
        ]
      },
      {
        "id": "f-nd-4",
        "restaurantId": "res-namdanh-seafood",
        "name": "Nghêu Hấp Thái Chua Cay Nồng Ấm",
        "description": "Nghêu tươi hấp sả lá chanh ớt sừng nước dùng chua cay kiểu Thái ăn ấm lòng.",
        "price": 75000,
        "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80",
        "category": "Món Ốc Biển",
        "isAvailable": true,
        "soldCount": 2450,
        "likesCount": 880,
        "calories": 210,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-nd-5",
        "restaurantId": "res-namdanh-seafood",
        "name": "Mực Ống Chiên Nước Mắm Tỏi Ớt Giòn Rụm",
        "description": "Mực ống tươi thái khoanh chiên vàng giòn quyện sốt nước mắm nhỉ tỏi ớt thơm ngon.",
        "price": 115000,
        "image": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500&auto=format&fit=crop&q=80",
        "category": "Món Mực Biển",
        "isAvailable": true,
        "soldCount": 2100,
        "likesCount": 920,
        "calories": 460,
        "mealTime": [
          "DINNER"
        ]
      }
    ]
  },
  {
    "id": "res-bunchacahon",
    "name": "Bún Chả Cá Hờn 113A - Gia Truyền Hải Châu",
    "tagline": "Quán bún chả cá lâu đời nức tiếng Đà Nẵng - Nước dùng hầm bí đỏ bắp cải thanh ngọt",
    "logo": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&auto=format&fit=crop&q=80",
    "coverImage": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=900&auto=format&fit=crop&q=80",
    "categories": [
      "Bún Chả Cá & Bún Bò",
      "Đặc Sản Đà Nẵng"
    ],
    "rating": 4.95,
    "totalReviews": 3200,
    "distanceKm": 0.6,
    "deliveryTimeMin": 15,
    "minOrderPrice": 35000,
    "address": "113/3 Nguyễn Chí Thanh, Phường Hải Châu 1, Quận Hải Châu, TP. Đà Nẵng",
    "district": "Hải Châu",
    "city": "TP. Đà Nẵng",
    "lat": 16.0688,
    "lng": 108.2205,
    "isOpen": true,
    "openHours": "06:00 - 22:00",
    "isVerified": true,
    "featuredPromo": "Tô đặc biệt tặng kèm ly sữa đậu nành lá dứa",
    "hasFreeShip": true,
    "landmark": "CAU_RONG",
    "menu": [
      {
        "id": "f-hon-1",
        "restaurantId": "res-bunchacahon",
        "name": "Bún Chả Cá Thập Cẩm (Tô Đặc Biệt Có Cá Ngừ & Chả Hấp)",
        "description": "Tô bún đầy ắp chả cá thu chiên vàng ruộm giòn dai, chả cá hấp tiêu thơm lừng, khúc cá ngừ đại dương tươi ngọt hầm bí đỏ măng chua ngọt nước.",
        "price": 45000,
        "originalPrice": 55000,
        "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80",
        "category": "Bún Chả Cá Truyền Thống",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 4890,
        "likesCount": 1780,
        "allergens": [
          "Hải sản"
        ],
        "calories": 460,
        "mealTime": [
          "BREAKFAST",
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-hon-2",
        "restaurantId": "res-bunchacahon",
        "name": "Bún Chả Cá Thác Lác Tô Lớn",
        "description": "Chả cá thác lác quết dẻo tay chiên giòn phồng thơm nức mũi ăn cùng măng tươi giòn ngọt.",
        "price": 40000,
        "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80",
        "category": "Bún Chả Cá Truyền Thống",
        "isBestSeller": false,
        "isAvailable": true,
        "soldCount": 2850,
        "likesCount": 920,
        "allergens": [
          "Hải sản"
        ],
        "calories": 430,
        "mealTime": [
          "BREAKFAST",
          "LUNCH"
        ]
      },
      {
        "id": "f-hon-3",
        "restaurantId": "res-bunchacahon",
        "name": "Bún Cá Thu Tươi Lát Dày (Tô Đặc Biệt)",
        "description": "Lát cá thu biển tươi dày cộm ngọt thơm tự nhiên, nước dùng ninh xương cá hầm cà chua bí đỏ thanh mát.",
        "price": 55000,
        "image": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&auto=format&fit=crop&q=80",
        "category": "Bún Cá Biển",
        "isAvailable": true,
        "soldCount": 1980,
        "likesCount": 840,
        "calories": 470,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-hon-4",
        "restaurantId": "res-bunchacahon",
        "name": "Bún Rạm Sông Hàn Nước Dùng Ngọt Thanh",
        "description": "Con rạm sông giòn rụm nấu cùng mồng tơi và bún tươi vị ngọt lịm đậm đà hồn quê.",
        "price": 45000,
        "image": "https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&auto=format&fit=crop&q=80",
        "category": "Món Đặc Sản",
        "isAvailable": true,
        "soldCount": 1420,
        "likesCount": 510,
        "calories": 410,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-hon-5",
        "restaurantId": "res-bunchacahon",
        "name": "Đĩa Chả Cá Chiên & Hấp Thêm (Phần 4 miếng)",
        "description": "Chả cá thu quết dai tự nhiên không pha bột chiên vàng ươm ăn kèm bún.",
        "price": 25000,
        "image": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80",
        "category": "Ăn Kèm Thêm",
        "isAvailable": true,
        "soldCount": 3120,
        "likesCount": 790,
        "calories": 220,
        "mealTime": [
          "ALL_DAY"
        ]
      }
    ]
  },
  {
    "id": "res-bunbo-badiu",
    "name": "Bún Bò Đà Nẵng Bà Diệu - Trần Tống",
    "tagline": "Bún bò chuẩn phong vị người xứ Quảng - Nước dùng đậm đà hương sả ruốc Huế",
    "logo": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=200&auto=format&fit=crop&q=80",
    "coverImage": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=900&auto=format&fit=crop&q=80",
    "categories": [
      "Bún Chả Cá & Bún Bò",
      "Đặc Sản Đà Nẵng"
    ],
    "rating": 4.94,
    "totalReviews": 2890,
    "distanceKm": 1.4,
    "deliveryTimeMin": 18,
    "minOrderPrice": 40000,
    "address": "17 Trần Tống, Phường Vĩnh Trung, Quận Thanh Khê, TP. Đà Nẵng",
    "district": "Thanh Khê",
    "city": "TP. Đà Nẵng",
    "lat": 16.0615,
    "lng": 108.2095,
    "isOpen": true,
    "openHours": "14:00 - 20:00",
    "isVerified": true,
    "featuredPromo": "Tô lớn tặng kèm bánh quẩy giòn",
    "hasFreeShip": true,
    "landmark": "CAU_RONG",
    "menu": [
      {
        "id": "f-bd-1",
        "restaurantId": "res-bunbo-badiu",
        "name": "Bún Bò Giò Nạc Chả Cua (Tô Lớn Đầy Đủ)",
        "description": "Khoanh giò heo nạc bùi mềm, chả cua quết ngọt đậm vị, thịt bò nạm hoa mềm ngọt cùng nước dùng bún bò ngào ngạt mùi sả và ớt sa tế cay xé lưỡi.",
        "price": 55000,
        "originalPrice": 65000,
        "image": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&auto=format&fit=crop&q=80",
        "category": "Bún Bò Gia Truyền",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 3950,
        "likesCount": 1560,
        "calories": 590,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-bd-2",
        "restaurantId": "res-bunbo-badiu",
        "name": "Bún Bò Tái Nạm Gầu Béo Giòn",
        "description": "Bò tái mềm ngọt cùng gầu giòn béo ngậy chan nước dùng thơm phức vị ruốc sả truyền thống.",
        "price": 50000,
        "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80",
        "category": "Bún Bò Gia Truyền",
        "isAvailable": true,
        "soldCount": 2120,
        "likesCount": 880,
        "calories": 540,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-bd-3",
        "restaurantId": "res-bunbo-badiu",
        "name": "Bún Bò Gân Trong Hầm Mềm Bổ Dưỡng",
        "description": "Gân bò vàng ươm ninh mềm dẻo sần sật bùi ngọt ngập trong nước dùng sả cay nóng.",
        "price": 50000,
        "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80",
        "category": "Bún Bò Gia Truyền",
        "isAvailable": true,
        "soldCount": 1840,
        "likesCount": 650,
        "calories": 520,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-bd-4",
        "restaurantId": "res-bunbo-badiu",
        "name": "Bún Chả Cua & Huyết Nóng Hổi",
        "description": "Chả cua quết tươi mềm xốp ngọt thơm ăn cùng huyết ninh đậm vị.",
        "price": 40000,
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80",
        "category": "Bún Bò Gia Truyền",
        "isAvailable": true,
        "soldCount": 1690,
        "likesCount": 470,
        "calories": 450,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-bd-5",
        "restaurantId": "res-bunbo-badiu",
        "name": "Trà Đá Hoa Cúc Mát Lạnh",
        "description": "Trà đá nấu hoa cúc thanh mát làm dịu cơn cay bún bò.",
        "price": 5000,
        "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80",
        "category": "Đồ Uống",
        "isAvailable": true,
        "soldCount": 3500,
        "likesCount": 510,
        "calories": 20,
        "mealTime": [
          "ALL_DAY"
        ]
      }
    ]
  },
  {
    "id": "res-banhxeobaduong",
    "name": "Bánh Xèo Bà Dưỡng - Kiệt 280 Hoàng Diệu",
    "tagline": "Quán bánh xèo huyền thoại kiệt 280 - Nước tương gan đậu phộng chấm béo ngậy độc nhất",
    "logo": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=200&auto=format&fit=crop&q=80",
    "coverImage": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=900&auto=format&fit=crop&q=80",
    "categories": [
      "Bánh Xèo & Nem Lụi",
      "Đặc Sản Đà Nẵng"
    ],
    "rating": 4.98,
    "totalReviews": 6120,
    "distanceKm": 0.9,
    "deliveryTimeMin": 20,
    "minOrderPrice": 50000,
    "address": "K280/23 Hoàng Diệu, Phường Bình Hiên, Quận Hải Châu, TP. Đà Nẵng",
    "district": "Hải Châu",
    "city": "TP. Đà Nẵng",
    "lat": 16.0592,
    "lng": 108.2178,
    "isOpen": true,
    "openHours": "09:30 - 21:30",
    "isVerified": true,
    "featuredPromo": "Tặng 2 cây nem lụi cho đơn bánh xèo từ 150k",
    "hasFreeShip": true,
    "landmark": "CAU_RONG",
    "menu": [
      {
        "id": "f-bxd-1",
        "restaurantId": "res-banhxeobaduong",
        "name": "Mẹt Bánh Xèo Giòn Rụm Bà Dưỡng (4 Cái)",
        "description": "Vỏ bánh đổ 2 lần vàng ươm giòn tan rôm rốp, nhân tôm tươi nhảy ngọt lịm, thịt bò xào lăn, giá đỗ giòn ngọt, cuốn bánh tráng rau sống chấm nước sốt gan heo tương đậu gia truyền độc quyền.",
        "price": 75000,
        "originalPrice": 85000,
        "image": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80",
        "category": "Bánh Xèo Đặc Biệt",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 8200,
        "likesCount": 3120,
        "allergens": [
          "Đậu phộng",
          "Hải sản"
        ],
        "calories": 680,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-bxd-2",
        "restaurantId": "res-banhxeobaduong",
        "name": "Nem Lụi Nướng Than Hoa Nước Tương Gan Béo (10 Cây)",
        "description": "Nem quết thịt heo nạc mỡ cân đối nướng thơm nức mũi than hoa, ăn kèm rau rừng chấm đẫm sốt tương gan béo ngậy.",
        "price": 70000,
        "originalPrice": 80000,
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80",
        "category": "Nem Lụi Nướng",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 6540,
        "likesCount": 2450,
        "allergens": [
          "Đậu phộng"
        ],
        "calories": 520,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-bxd-3",
        "restaurantId": "res-banhxeobaduong",
        "name": "Bò Nướng Lá Lốt Nóng Hổi (Đĩa 8 cuốn)",
        "description": "Thịt bò băm nêm nếm đậm đà cuộn trong lá lốt nướng xém cạnh thơm lừng chấm tương đậu.",
        "price": 65000,
        "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80",
        "category": "Món Nướng Đặc Biệt",
        "isAvailable": true,
        "soldCount": 3410,
        "likesCount": 1210,
        "allergens": [
          "Đậu phộng"
        ],
        "calories": 480,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-bxd-4",
        "restaurantId": "res-banhxeobaduong",
        "name": "Bún Thịt Nướng Nem Lụi Rau Sống Rau Thơm",
        "description": "Tô bún tươi đầy ắp nem lụi và thịt xiên nướng than thơm lừng rưới tương gan đậu phộng.",
        "price": 40000,
        "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80",
        "category": "Món Bún",
        "isAvailable": true,
        "soldCount": 2980,
        "likesCount": 880,
        "calories": 490,
        "mealTime": [
          "BREAKFAST",
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-bxd-5",
        "restaurantId": "res-banhxeobaduong",
        "name": "Nước Mía Tươi Cốt Tắc Ép Nguyên Chất",
        "description": "Mía tươi ép kèm trái tắc thơm dịu ngọt mát giải ngấy.",
        "price": 15000,
        "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80",
        "category": "Đồ Uống",
        "isAvailable": true,
        "soldCount": 4100,
        "likesCount": 790,
        "calories": 90,
        "mealTime": [
          "ALL_DAY"
        ]
      }
    ]
  },
  {
    "id": "res-chesaulien",
    "name": "Chè Sầu Liên Đà Nẵng - Hoàng Diệu",
    "tagline": "Chè Thái sầu riêng trứ danh khắp cả nước - Cơm sầu riêng Ri6 tươi nguyên chất thơm lừng",
    "logo": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=200&auto=format&fit=crop&q=80",
    "coverImage": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=900&auto=format&fit=crop&q=80",
    "categories": [
      "Chè Sầu Liên & Tráng Miệng",
      "Đặc Sản Đà Nẵng"
    ],
    "rating": 4.98,
    "totalReviews": 7850,
    "distanceKm": 0.7,
    "deliveryTimeMin": 14,
    "minOrderPrice": 30000,
    "address": "189 Hoàng Diệu, Phường Nam Dương, Quận Hải Châu, TP. Đà Nẵng",
    "district": "Hải Châu",
    "city": "TP. Đà Nẵng",
    "lat": 16.0612,
    "lng": 108.2185,
    "isOpen": true,
    "openHours": "08:00 - 23:00",
    "isVerified": true,
    "featuredPromo": "Mua 5 tặng 1 chè Thái sầu riêng",
    "hasFreeShip": true,
    "landmark": "CAU_RONG",
    "branches": [
      {
        "id": "br-csl-1",
        "restaurantId": "res-chesaulien",
        "name": "Chè Liên - Hoàng Diệu (Hải Châu)",
        "address": "189 Hoàng Diệu, Hải Châu",
        "district": "Hải Châu",
        "phone": "0905 111 222",
        "isOpen": true,
        "todayRevenue": 35000000
      },
      {
        "id": "br-csl-2",
        "restaurantId": "res-chesaulien",
        "name": "Chè Liên - 175 Hải Phòng (Thanh Khê)",
        "address": "175 Hải Phòng, Thanh Khê",
        "district": "Thanh Khê",
        "phone": "0905 333 444",
        "isOpen": true,
        "todayRevenue": 28000000
      },
      {
        "id": "br-csl-3",
        "restaurantId": "res-chesaulien",
        "name": "Chè Liên - Đường 2/9 Sông Hàn",
        "address": "Số 320 Đường 2/9, Hải Châu",
        "district": "Hải Châu",
        "phone": "0905 555 666",
        "isOpen": true,
        "todayRevenue": 24000000
      }
    ],
    "menu": [
      {
        "id": "f-csl-1",
        "restaurantId": "res-chesaulien",
        "name": "Chè Thái Sầu Riêng Cô Liên (Bestseller Toàn Quốc)",
        "description": "Múi sầu riêng Ri6 xay nhuyễn béo ngậy thơm nức mũi, hạt thốt nốt giòn dẻo, mít nghệ chín vàng, thạch hoa quả giòn thanh, nước cốt dừa sánh mịn độc quyền thơm lừng.",
        "price": 35000,
        "originalPrice": 42000,
        "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80",
        "category": "Chè Sầu Riêng Trứ Danh",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 9950,
        "likesCount": 3980,
        "allergens": [
          "Sữa"
        ],
        "calories": 360,
        "mealTime": [
          "ALL_DAY"
        ]
      },
      {
        "id": "f-csl-2",
        "restaurantId": "res-chesaulien",
        "name": "Tàu Hũ Sầu Riêng Nước Cốt Dừa Béo Ngậy",
        "description": "Tàu hũ non mềm mướt tan chảy ngay trên đầu lưỡi, phủ sốt sầu riêng tươi và nước cốt dừa béo thơm ngất ngây.",
        "price": 30000,
        "image": "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&auto=format&fit=crop&q=80",
        "category": "Tàu Hũ Tráng Miệng",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 5420,
        "likesCount": 1890,
        "calories": 280,
        "mealTime": [
          "ALL_DAY"
        ]
      },
      {
        "id": "f-csl-3",
        "restaurantId": "res-chesaulien",
        "name": "Chè Khúc Bạch Phô Mai Hạnh Nhân Giòn",
        "description": "Khúc bạch phô mai sữa béo mềm mọng nước, nhãn lồng giòn ngọt và hạnh nhân lát sấy thơm bùi.",
        "price": 32000,
        "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80",
        "category": "Chè Khúc Bạch",
        "isAvailable": true,
        "soldCount": 3890,
        "likesCount": 1240,
        "calories": 260,
        "mealTime": [
          "ALL_DAY"
        ]
      },
      {
        "id": "f-csl-4",
        "restaurantId": "res-chesaulien",
        "name": "Rau Câu Ba Màu Cốt Dừa Lá Dứa Thanh Mát",
        "description": "Từng lớp rau câu giòn dai đan xen vị cốt dừa béo và lá dứa xanh ngát tươi mát.",
        "price": 25000,
        "image": "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&auto=format&fit=crop&q=80",
        "category": "Rau Câu & Ăn Vặt",
        "isAvailable": true,
        "soldCount": 2950,
        "likesCount": 910,
        "calories": 190,
        "mealTime": [
          "ALL_DAY"
        ]
      },
      {
        "id": "f-csl-5",
        "restaurantId": "res-chesaulien",
        "name": "Sữa Chua Hạt Đác Rim Thơm Rim Đường Phèn",
        "description": "Sữa chua dẻo mịn kết hợp hạt đác rim quả thơm chua ngọt giòn dẻo lạ miệng.",
        "price": 28000,
        "image": "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format&fit=crop&q=80",
        "category": "Sữa Chua & Trái Cây",
        "isAvailable": true,
        "soldCount": 3100,
        "likesCount": 880,
        "calories": 210,
        "mealTime": [
          "ALL_DAY"
        ]
      }
    ]
  },
  {
    "id": "res-comgababuoi",
    "name": "Cơm Gà Bà Buội Đà Nẵng - Sơn Trà",
    "tagline": "Cơm gà Hội An trứ danh chi nhánh Đà Nẵng - Hạt cơm dẻo vàng nước luộc gà óng ả",
    "logo": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&auto=format&fit=crop&q=80",
    "coverImage": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=900&auto=format&fit=crop&q=80",
    "categories": [
      "Cơm Gà & Cơm Niêu",
      "Đặc Sản Đà Nẵng"
    ],
    "rating": 4.93,
    "totalReviews": 3410,
    "distanceKm": 2.2,
    "deliveryTimeMin": 22,
    "minOrderPrice": 45000,
    "address": "253 Hồ Nghinh, Phường Phước Mỹ, Quận Sơn Trà, TP. Đà Nẵng",
    "district": "Sơn Trà",
    "city": "TP. Đà Nẵng",
    "lat": 16.0715,
    "lng": 108.241,
    "isOpen": true,
    "openHours": "10:00 - 21:00",
    "isVerified": true,
    "featuredPromo": "Tặng canh lòng gà lá giang cho đơn từ 120k",
    "hasFreeShip": true,
    "landmark": "MY_KHE",
    "menu": [
      {
        "id": "f-cg-1",
        "restaurantId": "res-comgababuoi",
        "name": "Cơm Gà Xé Bóp Gỏi Hành Tây Rau Răm Xứ Quảng",
        "description": "Hạt cơm nấu nước luộc gà nghệ vàng ươm dẻo thơm, thịt gà ta xé phay bóp gỏi hành tây chua ngọt thấm thía, đồ chua đu đủ, tương ớt rim phố Hội.",
        "price": 55000,
        "originalPrice": 65000,
        "image": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80",
        "category": "Cơm Gà Đặc Sản",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 5120,
        "likesCount": 1840,
        "calories": 620,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-cg-2",
        "restaurantId": "res-comgababuoi",
        "name": "Cơm Gà Chặt Đùi Góc Tư Da Vàng Óng",
        "description": "Đùi gà ta góc tư luộc vàng óng thịt dai ngọt béo, ăn kèm cơm vàng thơm và chén nước sốt mạ gà đậm đà.",
        "price": 65000,
        "originalPrice": 75000,
        "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80",
        "category": "Cơm Gà Đặc Sản",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 3950,
        "likesCount": 1410,
        "calories": 690,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-cg-3",
        "restaurantId": "res-comgababuoi",
        "name": "Cơm Gà Quay Da Giòn Rụm Sốt Nước Tương Tỏi",
        "description": "Đùi gà quay lớp da giòn rụm màu cánh gián bắt mắt thịt ngập mềm thơm sốt gia truyền.",
        "price": 60000,
        "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80",
        "category": "Cơm Gà Đặc Sản",
        "isAvailable": true,
        "soldCount": 2840,
        "likesCount": 930,
        "calories": 670,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-cg-4",
        "restaurantId": "res-comgababuoi",
        "name": "Gỏi Gà Xé Hoa Chuối Chua Ngọt Cỡ Lớn",
        "description": "Thịt gà xé trộn hoa chuối bào sợi giòn sần sật đậu phộng rang và rau răm thơm nồng.",
        "price": 80000,
        "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80",
        "category": "Món Gỏi Ăn Chung",
        "isAvailable": true,
        "soldCount": 1980,
        "likesCount": 710,
        "allergens": [
          "Đậu phộng"
        ],
        "calories": 380,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-cg-5",
        "restaurantId": "res-comgababuoi",
        "name": "Canh Lòng Gà Nấu Lá Giang Chua Thanh",
        "description": "Tô canh lòng gà béo ngậy nấu lá giang chua dịu húp nóng sảng khoái.",
        "price": 25000,
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80",
        "category": "Món Canh",
        "isAvailable": true,
        "soldCount": 2450,
        "likesCount": 620,
        "calories": 180,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      }
    ]
  },
  {
    "id": "res-comnieu-nhado",
    "name": "Cơm Niêu Nhà Đỏ Đà Nẵng - Cơm Niêu Đập",
    "tagline": "Cơm niêu đập cháy giòn rụm - Cá bống Sông Trà kho tộ đậm đà phong vị quê hương",
    "logo": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=200&auto=format&fit=crop&q=80",
    "coverImage": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=900&auto=format&fit=crop&q=80",
    "categories": [
      "Cơm Gà & Cơm Niêu",
      "Đặc Sản Đà Nẵng"
    ],
    "rating": 4.94,
    "totalReviews": 2980,
    "distanceKm": 1.5,
    "deliveryTimeMin": 25,
    "minOrderPrice": 80000,
    "address": "86 Nguyễn Tri Phương, Phường Chính Gián, Quận Thanh Khê, TP. Đà Nẵng",
    "district": "Hải Châu",
    "city": "TP. Đà Nẵng",
    "lat": 16.0632,
    "lng": 108.2052,
    "isOpen": true,
    "openHours": "10:00 - 22:00",
    "isVerified": true,
    "featuredPromo": "Tặng canh cua đồng mồng tơi cho đơn từ 200k",
    "hasFreeShip": true,
    "landmark": "CAU_RONG",
    "menu": [
      {
        "id": "f-cn-1",
        "restaurantId": "res-comnieu-nhado",
        "name": "Set Cơm Niêu Cá Bống Sông Trà Kho Tộ (Suất Ăn Gia Đình)",
        "description": "Cơm niêu đất đáy cháy vàng giòn rụm, cá bống Sông Trà thịt săn chắc kho tộ sền sệt nước đường thốt nốt tiêu sọ cay nồng, ăn kèm canh cua mồng tơi và cà pháo muối giòn.",
        "price": 110000,
        "originalPrice": 130000,
        "image": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80",
        "category": "Cơm Niêu Đặc Biệt",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 4120,
        "likesCount": 1680,
        "calories": 720,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-cn-2",
        "restaurantId": "res-comnieu-nhado",
        "name": "Cơm Niêu Cháy Giòn Rụm Mỡ Hành Nước Mắm Tỏi",
        "description": "Niêu cơm đất nung cháy 2 mặt vàng ruộm thơm nức rưới mỡ hành lá béo thơm.",
        "price": 35000,
        "image": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80",
        "category": "Cơm Niêu",
        "isAvailable": true,
        "soldCount": 3890,
        "likesCount": 1220,
        "calories": 410,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-cn-3",
        "restaurantId": "res-comnieu-nhado",
        "name": "Thịt Ba Chỉ Rang Cháy Cạnh Kèm Dưa Cải Muối Chua",
        "description": "Ba chỉ heo tươi thái mỏng rang sém vàng cạnh thơm nước mắm cốt ăn cùng dưa muối giòn chua.",
        "price": 85000,
        "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80",
        "category": "Món Mặn Gia Đình",
        "isAvailable": true,
        "soldCount": 2650,
        "likesCount": 890,
        "calories": 550,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-cn-4",
        "restaurantId": "res-comnieu-nhado",
        "name": "Canh Cua Mồng Tơi Mướp Hương Cà Pháo Giòn",
        "description": "Tô canh cua đồng giã tay đóng tảng gạch béo ngọt nấu mướp hương thơm lừng.",
        "price": 60000,
        "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80",
        "category": "Món Canh",
        "isAvailable": true,
        "soldCount": 3100,
        "likesCount": 990,
        "calories": 160,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-cn-5",
        "restaurantId": "res-comnieu-nhado",
        "name": "Sườn Non Xào Chua Ngọt Miền Trung Đậm Đà",
        "description": "Sườn non mềm róc xương sốt dứa cà chua chua ngọt óng ánh màu đỏ tươi hấp dẫn.",
        "price": 95000,
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80",
        "category": "Món Mặn Gia Đình",
        "isAvailable": true,
        "soldCount": 2190,
        "likesCount": 780,
        "calories": 580,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      }
    ]
  },
  {
    "id": "res-banhmi-balan",
    "name": "Bánh Mì Chả Bò Bà Lan - Trưng Nữ Vương",
    "tagline": "Thương hiệu bánh mì gia truyền nức tiếng Đà Thành - Chả bò đặc sản loại 1 giòn ngọt tự nhiên",
    "logo": "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=200&auto=format&fit=crop&q=80",
    "coverImage": "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=900&auto=format&fit=crop&q=80",
    "categories": [
      "Bánh Tráng Thịt Heo",
      "Đặc Sản Đà Nẵng"
    ],
    "rating": 4.96,
    "totalReviews": 4890,
    "distanceKm": 0.5,
    "deliveryTimeMin": 12,
    "minOrderPrice": 25000,
    "address": "62 Trưng Nữ Vương, Phường Bình Hiên, Quận Hải Châu, TP. Đà Nẵng",
    "district": "Hải Châu",
    "city": "TP. Đà Nẵng",
    "lat": 16.0618,
    "lng": 108.2212,
    "isOpen": true,
    "openHours": "06:00 - 23:00",
    "isVerified": true,
    "featuredPromo": "Combo 2 ổ bánh mì tặng ly sữa đậu nành",
    "hasFreeShip": true,
    "landmark": "CAU_RONG",
    "menu": [
      {
        "id": "f-bl-1",
        "restaurantId": "res-banhmi-balan",
        "name": "Bánh Mì Chả Bò Đà Nẵng Thập Cẩm Bà Lan (Ổ Lớn)",
        "description": "Ổ bánh mì nướng lò than giòn rụm, kẹp đầy chả bò Đà Nẵng loại 1 giòn ngọt, chả heo, thịt nguội, patê gan béo ngậy tự làm, sốt bơ trứng gà và ớt xanh cay nồng nàn.",
        "price": 30000,
        "originalPrice": 35000,
        "image": "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop&q=80",
        "category": "Bánh Mì Truyền Thống",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 9450,
        "likesCount": 3620,
        "allergens": [
          "Trứng",
          "Bột mì"
        ],
        "calories": 480,
        "mealTime": [
          "BREAKFAST",
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-bl-2",
        "restaurantId": "res-banhmi-balan",
        "name": "Bánh Mì Thịt Nguội & Patê Gan Béo Ngậy Bà Lan",
        "description": "Patê gan béo mịn tự làm theo công thức cổ truyền 30 năm, thịt nguội thơm ngậy dưa leo giòn rụm.",
        "price": 28000,
        "image": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80",
        "category": "Bánh Mì Truyền Thống",
        "isAvailable": true,
        "soldCount": 4210,
        "likesCount": 1510,
        "calories": 460,
        "mealTime": [
          "BREAKFAST",
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-bl-3",
        "restaurantId": "res-banhmi-balan",
        "name": "Bánh Mì Que Nóng Giòn Cay Nồng (Gói 3 ổ)",
        "description": "Bánh mì que giòn xốp quết patê gan đầy ắp rắc ớt cay xè thơm lừng.",
        "price": 25000,
        "image": "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop&q=80",
        "category": "Bánh Mì Que",
        "isAvailable": true,
        "soldCount": 3100,
        "likesCount": 890,
        "calories": 320,
        "mealTime": [
          "ALL_DAY"
        ]
      },
      {
        "id": "f-bl-4",
        "restaurantId": "res-banhmi-balan",
        "name": "Đòn Chả Bò Đà Nẵng 500g Gói Lá Chuối Truyền Thống",
        "description": "Chả bò nguyên chất thịt bò đùi tươi dẻo quết tay thơm nức mùi tiêu sọ và tỏi tươi.",
        "price": 175000,
        "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80",
        "category": "Đặc Sản Đóng Gói",
        "isAvailable": true,
        "soldCount": 2200,
        "likesCount": 940,
        "calories": 890,
        "mealTime": [
          "ALL_DAY"
        ]
      },
      {
        "id": "f-bl-5",
        "restaurantId": "res-banhmi-balan",
        "name": "Sữa Đậu Nành Mè Đen Thơm Lừng Tự Nấu",
        "description": "Sữa đậu nành sánh đậm bùi béo hạt mè đen bổ dưỡng uống nóng hoặc đá.",
        "price": 12000,
        "image": "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format&fit=crop&q=80",
        "category": "Đồ Uống",
        "isAvailable": true,
        "soldCount": 2890,
        "likesCount": 640,
        "calories": 95,
        "mealTime": [
          "ALL_DAY"
        ]
      }
    ]
  },
  {
    "id": "res-phuclong-danang",
    "name": "Phúc Long Coffee & Tea - Nguyễn Văn Linh",
    "tagline": "Đậm vị trà truyền thống - Đồ uống yêu thích của giới trẻ và dân văn phòng Đà Nẵng",
    "logo": "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=200&auto=format&fit=crop&q=80",
    "coverImage": "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=900&auto=format&fit=crop&q=80",
    "categories": [
      "Trà Sữa & Cà Phê Muối"
    ],
    "rating": 4.96,
    "totalReviews": 5410,
    "distanceKm": 0.3,
    "deliveryTimeMin": 10,
    "minOrderPrice": 40000,
    "address": "61 Nguyễn Văn Linh, Phường Phước Ninh, Quận Hải Châu, TP. Đà Nẵng",
    "district": "Hải Châu",
    "city": "TP. Đà Nẵng",
    "lat": 16.0605,
    "lng": 108.2198,
    "isOpen": true,
    "openHours": "07:00 - 22:30",
    "isVerified": true,
    "featuredPromo": "Giảm 25% thức uống thứ 2",
    "hasFreeShip": true,
    "landmark": "CAU_RONG",
    "menu": [
      {
        "id": "f-pl-1",
        "restaurantId": "res-phuclong-danang",
        "name": "Trà Sữa Phúc Long Truyền Thống Đậm Vị Trà (Size L)",
        "description": "Vị trà đen đậm đà chát nhẹ hậu vị ngọt lịm kết hợp sữa thơm béo hài hòa tuyệt hảo trứ danh.",
        "price": 55000,
        "originalPrice": 65000,
        "image": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80",
        "category": "Trà Sữa Đậm Vị",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 8850,
        "likesCount": 3200,
        "allergens": [
          "Sữa"
        ],
        "calories": 380,
        "mealTime": [
          "ALL_DAY"
        ]
      },
      {
        "id": "f-pl-2",
        "restaurantId": "res-phuclong-danang",
        "name": "Trà Đào Cam Sả Tươi Mát Giòn Đào (Size L)",
        "description": "Trà đen hảo hạng pha cùng nước cốt cam sả tươi, điểm xuyết từng lát đào ngâm giòn ngọt thanh tao.",
        "price": 52000,
        "originalPrice": 60000,
        "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80",
        "category": "Trà Trái Cây",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 6420,
        "likesCount": 2510,
        "calories": 190,
        "mealTime": [
          "ALL_DAY"
        ]
      },
      {
        "id": "f-pl-3",
        "restaurantId": "res-phuclong-danang",
        "name": "Trà Vải Lài Thơm Mát Hương Hoa (Size L)",
        "description": "Trà hoa lài thanh khiết ướp lạnh cùng trái vải ngâm mọng nước ngọt ngào.",
        "price": 50000,
        "image": "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format&fit=crop&q=80",
        "category": "Trà Trái Cây",
        "isAvailable": true,
        "soldCount": 3980,
        "likesCount": 1420,
        "calories": 170,
        "mealTime": [
          "ALL_DAY"
        ]
      },
      {
        "id": "f-pl-4",
        "restaurantId": "res-phuclong-danang",
        "name": "Cà Phê Muối Đà Nẵng Lớp Bọt Kem Béo Mặn",
        "description": "Cà phê Robusta Đắk Lắk pha phin nguyên chất phủ lớp bọt kem muối biển mằn mặn béo ngậy.",
        "price": 38000,
        "originalPrice": 45000,
        "image": "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&auto=format&fit=crop&q=80",
        "category": "Cà Phê & Kem Muối",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 5210,
        "likesCount": 2190,
        "allergens": [
          "Sữa"
        ],
        "calories": 220,
        "mealTime": [
          "BREAKFAST",
          "ALL_DAY"
        ]
      },
      {
        "id": "f-pl-5",
        "restaurantId": "res-phuclong-danang",
        "name": "Bánh Croissant Bơ Tỏi Nướng Nóng Giòn",
        "description": "Bánh sừng bò ngàn lớp thơm lừng bơ Pháp sốt tỏi nướng nóng hổi ăn kèm trà.",
        "price": 35000,
        "image": "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop&q=80",
        "category": "Bánh Ngọt & Bakery",
        "isAvailable": true,
        "soldCount": 2310,
        "likesCount": 790,
        "allergens": [
          "Bột mì",
          "Bơ"
        ],
        "calories": 290,
        "mealTime": [
          "ALL_DAY"
        ]
      }
    ]
  },
  {
    "id": "res-kfc-danang",
    "name": "KFC Vietnam - Nguyễn Văn Linh Đà Nẵng",
    "tagline": "Vị ngon trên từng ngón tay - Gà rán giòn cay nóng hổi giao tận cửa",
    "logo": "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=200&auto=format&fit=crop&q=80",
    "coverImage": "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=900&auto=format&fit=crop&q=80",
    "categories": [
      "Gà Rán, Burger & Pizza"
    ],
    "rating": 4.91,
    "totalReviews": 3890,
    "distanceKm": 0.4,
    "deliveryTimeMin": 15,
    "minOrderPrice": 60000,
    "address": "116 Nguyễn Văn Linh, Phường Nam Dương, Quận Hải Châu, TP. Đà Nẵng",
    "district": "Hải Châu",
    "city": "TP. Đà Nẵng",
    "lat": 16.0608,
    "lng": 108.218,
    "isOpen": true,
    "openHours": "09:00 - 22:30",
    "isVerified": true,
    "featuredPromo": "Combo trưa tiết kiệm giảm 30%",
    "hasFreeShip": true,
    "landmark": "CAU_RONG",
    "menu": [
      {
        "id": "f-kfc-1",
        "restaurantId": "res-kfc-danang",
        "name": "Combo Gà Rán Giòn Cay (2 Miếng + Khoai + Pepsi)",
        "description": "2 miếng gà rán công thức 11 loại thảo mộc da giòn rụm thịt mềm ngọt mọng nước, kèm khoai chiên và Pepsi mát lạnh.",
        "price": 79000,
        "originalPrice": 99000,
        "image": "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=500&auto=format&fit=crop&q=80",
        "category": "Combo Gà Rán",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 5890,
        "likesCount": 2150,
        "allergens": [
          "Bột mì",
          "Đậu nành"
        ],
        "calories": 780,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-kfc-2",
        "restaurantId": "res-kfc-danang",
        "name": "Burger Tôm Giòn Sốt Mayonnaise Tiêu Đen",
        "description": "Nhân tôm biển tươi giòn ngọt bọc bột xù chiên vàng kẹp xà lách sốt tiêu đen hấp dẫn.",
        "price": 55000,
        "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80",
        "category": "Burger & Cơm",
        "isAvailable": true,
        "soldCount": 3120,
        "likesCount": 980,
        "calories": 490,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-kfc-3",
        "restaurantId": "res-kfc-danang",
        "name": "Cơm Gà Rán Teriyaki Súp Rong Biển",
        "description": "Cơm dẻo nóng sốt Teriyaki Nhật Bản mặn ngọt cùng miếng phi lê gà chiên giòn.",
        "price": 52000,
        "image": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80",
        "category": "Burger & Cơm",
        "isAvailable": true,
        "soldCount": 2650,
        "likesCount": 810,
        "calories": 590,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-kfc-4",
        "restaurantId": "res-kfc-danang",
        "name": "Khoai Tây Chiên Lắc Phô Mai Béo Thơm (Hộp Lớn)",
        "description": "Khoai tây cắt lát giòn tan lắc đều bột phô mai mặn béo cay nhẹ.",
        "price": 38000,
        "image": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80",
        "category": "Món Ăn Kèm",
        "isAvailable": true,
        "soldCount": 4120,
        "likesCount": 1320,
        "calories": 340,
        "mealTime": [
          "ALL_DAY"
        ]
      },
      {
        "id": "f-kfc-5",
        "restaurantId": "res-kfc-danang",
        "name": "Bánh Trứng Egg Tart Nướng Nóng (Hộp 4 cái)",
        "description": "Vỏ bánh ngàn lớp giòn xốp nhân kem trứng thơm nức béo ngậy nướng nóng.",
        "price": 65000,
        "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80",
        "category": "Tráng Miệng",
        "isAvailable": true,
        "soldCount": 3890,
        "likesCount": 1450,
        "calories": 420,
        "mealTime": [
          "ALL_DAY"
        ]
      }
    ]
  },
  {
    "id": "res-pizza4ps-danang",
    "name": "Pizza 4P's - Hoàng Văn Thụ & Bạch Đằng",
    "tagline": "Pizza nướng củi phô mai tự làm - Đỉnh cao ẩm thực Ý phong cách Nhật Bản",
    "logo": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop&q=80",
    "coverImage": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&auto=format&fit=crop&q=80",
    "categories": [
      "Gà Rán, Burger & Pizza"
    ],
    "rating": 4.98,
    "totalReviews": 4120,
    "distanceKm": 0.9,
    "deliveryTimeMin": 25,
    "minOrderPrice": 120000,
    "address": "08 Hoàng Văn Thụ, Phường Phước Ninh, Quận Hải Châu, TP. Đà Nẵng",
    "district": "Hải Châu",
    "city": "TP. Đà Nẵng",
    "lat": 16.064,
    "lng": 108.2225,
    "isOpen": true,
    "openHours": "10:30 - 22:30",
    "isVerified": true,
    "featuredPromo": "Tặng tráng miệng tiramisu cho đơn từ 400k",
    "hasFreeShip": true,
    "landmark": "CAU_RONG",
    "menu": [
      {
        "id": "f-p4p-1",
        "restaurantId": "res-pizza4ps-danang",
        "name": "Pizza 4 Loại Phô Mai Kèm Mật Ong Tự Nhiên (4 Cheese Pizza)",
        "description": "Đế bánh nhào ủ men tươi nướng lò củi xém hoa báo giòn rụm, phủ 4 loại phô mai nhà làm Camembert, Mozzarella, Gorgonzola, Ricotta béo ngậy rưới mật ong thơm lừng.",
        "price": 245000,
        "originalPrice": 280000,
        "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80",
        "category": "Pizza Lò Củi",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 3890,
        "likesCount": 1980,
        "allergens": [
          "Sữa",
          "Bột mì"
        ],
        "calories": 890,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-p4p-2",
        "restaurantId": "res-pizza4ps-danang",
        "name": "Pizza Hải Sản Sốt Cà Chua Phô Mai Camembert",
        "description": "Tôm mực tươi rói sốt cà chua San Marzano mọng nước phủ phô mai tươi béo.",
        "price": 265000,
        "image": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500&auto=format&fit=crop&q=80",
        "category": "Pizza Lò Củi",
        "isAvailable": true,
        "soldCount": 2450,
        "likesCount": 1120,
        "allergens": [
          "Hải sản",
          "Sữa"
        ],
        "calories": 820,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-p4p-3",
        "restaurantId": "res-pizza4ps-danang",
        "name": "Mì Ý Thịt Cua Sốt Cà Chua Kem Béo Trứ Danh (Crab Spaghetti)",
        "description": "Thịt cua biển ngọt lịm ngập trong sốt kem cà chua béo ngậy phủ bột ớt cay nhẹ.",
        "price": 225000,
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80",
        "category": "Mì Ý Thủ Công",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 3120,
        "likesCount": 1650,
        "allergens": [
          "Hải sản",
          "Sữa"
        ],
        "calories": 710,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-p4p-4",
        "restaurantId": "res-pizza4ps-danang",
        "name": "Salad Phô Mai Burrata Tươi & Thịt Giăm Bông Parma Ham",
        "description": "Quả phô mai Burrata tươi béo mọng nước kết hợp giăm bông Parma Ý và cà chua bi hữu cơ.",
        "price": 195000,
        "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80",
        "category": "Khai Vị & Salad",
        "isAvailable": true,
        "soldCount": 1890,
        "likesCount": 880,
        "calories": 450,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-p4p-5",
        "restaurantId": "res-pizza4ps-danang",
        "name": "Bánh Mousse Trà Xanh Nhật Bản Tươi Mát",
        "description": "Lớp mousse matcha Uji Kyoto mềm tan đắng nhẹ ngọt dịu thanh tao.",
        "price": 85000,
        "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80",
        "category": "Tráng Miệng",
        "isAvailable": true,
        "soldCount": 1420,
        "likesCount": 650,
        "calories": 280,
        "mealTime": [
          "ALL_DAY"
        ]
      }
    ]
  },
  {
    "id": "res-sinhvien-bachkhoa",
    "name": "Cơm Niêu & Bánh Mì Bách Khoa Đà Nẵng",
    "tagline": "Thiên đường ẩm thực sinh viên làng ĐH Bách Khoa - Ngon, bổ, rẻ, no căng bụng",
    "logo": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&auto=format&fit=crop&q=80",
    "coverImage": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=900&auto=format&fit=crop&q=80",
    "categories": [
      "Cơm Gà & Cơm Niêu"
    ],
    "rating": 4.88,
    "totalReviews": 3100,
    "distanceKm": 6.8,
    "deliveryTimeMin": 35,
    "minOrderPrice": 20000,
    "address": "54 Nguyễn Lương Bằng, Phường Hòa Khánh Bắc, Quận Liên Chiểu, TP. Đà Nẵng",
    "district": "Liên Chiểu",
    "city": "TP. Đà Nẵng",
    "lat": 16.0748,
    "lng": 108.1512,
    "isOpen": true,
    "openHours": "06:00 - 22:00",
    "isVerified": true,
    "featuredPromo": "Tặng ly trà tắc khổng lồ cho đơn từ 50k",
    "hasFreeShip": true,
    "landmark": "UNIVERSITIES",
    "menu": [
      {
        "id": "f-bk-1",
        "restaurantId": "res-sinhvien-bachkhoa",
        "name": "Suất Cơm Tấm Sườn Cốt Lết Bì Chả Trứng Ốp La (Đặc Biệt)",
        "description": "Sườn cốt lết dày tẩm ướp mật ong nướng than hoa thơm lừng mọng nước, bì thơm, chả trứng hấp, trứng ốp la lòng đào rưới mỡ hành tóp mỡ giòn rụm.",
        "price": 38000,
        "originalPrice": 45000,
        "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80",
        "category": "Cơm Tấm Sinh Viên",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 7850,
        "likesCount": 2980,
        "calories": 680,
        "mealTime": [
          "BREAKFAST",
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-bk-2",
        "restaurantId": "res-sinhvien-bachkhoa",
        "name": "Cơm Gà Xối Mỡ Da Giòn Nước Tương Tỏi",
        "description": "Đùi gà xối mỡ da giòn rụm nóng hổi, cơm chiên đỏ cà chua bùi béo ăn kèm dưa leo rau răm.",
        "price": 35000,
        "image": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80",
        "category": "Cơm Sinh Viên",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 6410,
        "likesCount": 2150,
        "calories": 640,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-bk-3",
        "restaurantId": "res-sinhvien-bachkhoa",
        "name": "Bánh Mì Chả Trứng Nóng Giòn Sinh Viên",
        "description": "Bánh mì nướng nóng kẹp trứng ốp la lòng đào, chả heo, pate và tương ớt béo bùi.",
        "price": 18000,
        "image": "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop&q=80",
        "category": "Bánh Mì Nóng",
        "isAvailable": true,
        "soldCount": 4890,
        "likesCount": 1670,
        "calories": 380,
        "mealTime": [
          "BREAKFAST",
          "ALL_DAY"
        ]
      },
      {
        "id": "f-bk-4",
        "restaurantId": "res-sinhvien-bachkhoa",
        "name": "Mì Xào Bò Rau Cải Giòn (Suất No Căng)",
        "description": "Mì trứng xào thịt bò mềm và rau cải ngọt sốt dầu hào thơm phức.",
        "price": 35000,
        "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80",
        "category": "Món Mì Xào",
        "isAvailable": true,
        "soldCount": 3210,
        "likesCount": 1120,
        "calories": 550,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-bk-5",
        "restaurantId": "res-sinhvien-bachkhoa",
        "name": "Trà Tắc Khổng Lồ 1 Lít Mát Lạnh",
        "description": "Ly trà tắc khổng lồ 1000ml mát lạnh giải khát ngày hè oi ả.",
        "price": 15000,
        "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80",
        "category": "Đồ Uống Giải Khát",
        "isAvailable": true,
        "soldCount": 5400,
        "likesCount": 1980,
        "calories": 120,
        "mealTime": [
          "ALL_DAY"
        ]
      }
    ]
  },
  {
    "id": "res-comnieu-phudong",
    "name": "Cơm Niêu Phù Đổng - Biển Sơn Trà",
    "tagline": "Cơm niêu truyền thống miền Trung - Cá bớp kho tộ và canh chua hải sản biển",
    "logo": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=200&auto=format&fit=crop&q=80",
    "coverImage": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=900&auto=format&fit=crop&q=80",
    "categories": [
      "Cơm Gà & Cơm Niêu",
      "Đặc Sản Đà Nẵng"
    ],
    "rating": 4.93,
    "totalReviews": 2450,
    "distanceKm": 2.5,
    "deliveryTimeMin": 22,
    "minOrderPrice": 60000,
    "address": "158 Hồ Nghinh, Phường Phước Mỹ, Quận Sơn Trà, TP. Đà Nẵng",
    "district": "Sơn Trà",
    "city": "TP. Đà Nẵng",
    "lat": 16.072,
    "lng": 108.2395,
    "isOpen": true,
    "openHours": "10:00 - 22:00",
    "isVerified": true,
    "featuredPromo": "Giảm 25k đơn từ 150k cho khách du lịch",
    "hasFreeShip": true,
    "landmark": "MY_KHE",
    "menu": [
      {
        "id": "f-pd-1",
        "restaurantId": "res-comnieu-phudong",
        "name": "Cá Bớp Biển Kho Tộ Sền Sệt Tiêu Cay",
        "description": "Lát cá bớp biển Mỹ Khê tươi béo kho trong niêu đất cùng ớt hiểm và tiêu sọ thơm ngào ngạt.",
        "price": 95000,
        "originalPrice": 110000,
        "image": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80",
        "category": "Cá Biển Kho Tộ",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 3120,
        "likesCount": 1140,
        "calories": 520,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-pd-2",
        "restaurantId": "res-comnieu-phudong",
        "name": "Cơm Niêu Cháy Đáy Giòn Tan (Niêu Riêng)",
        "description": "Gạo tám thơm hạt dẻo nung niêu đất tạo lớp cháy vàng ươm giòn rụm.",
        "price": 25000,
        "image": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80",
        "category": "Cơm Niêu",
        "isAvailable": true,
        "soldCount": 4200,
        "likesCount": 1350,
        "calories": 380,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-pd-3",
        "restaurantId": "res-comnieu-phudong",
        "name": "Canh Chua Cá Bớp Nấu Thơm Cà & Dọc Mùng",
        "description": "Nước canh chua thanh vị me thơm dọc mùng giòn sần sật và cá bớp ngọt béo.",
        "price": 85000,
        "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80",
        "category": "Món Canh",
        "isAvailable": true,
        "soldCount": 2650,
        "likesCount": 920,
        "calories": 320,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-pd-4",
        "restaurantId": "res-comnieu-phudong",
        "name": "Rau Muống Xào Tỏi Giòn Xanh Mướt",
        "description": "Đọt rau muống non xào tỏi đập dập thơm lừng xanh mướt giòn ngọt.",
        "price": 40000,
        "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80",
        "category": "Món Xào",
        "isAvailable": true,
        "soldCount": 3100,
        "likesCount": 880,
        "calories": 140,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      }
    ]
  },
  {
    "id": "res-bunbo-babe",
    "name": "Bún Bò & Bánh Nậm Bà Bé - Ngũ Hành Sơn",
    "tagline": "Món ngon gia truyền khu danh thắng Non Nước - Bánh bèo, bánh nậm, bánh lọc thơm lá chuối",
    "logo": "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop&q=80",
    "coverImage": "https://images.unsplash.com/photo-1544025162-d76694265947?w=900&auto=format&fit=crop&q=80",
    "categories": [
      "Bún Chả Cá & Bún Bò",
      "Đặc Sản Đà Nẵng"
    ],
    "rating": 4.92,
    "totalReviews": 2180,
    "distanceKm": 3.5,
    "deliveryTimeMin": 26,
    "minOrderPrice": 35000,
    "address": "102 Lê Văn Hiến, Phường Khuê Mỹ, Quận Ngũ Hành Sơn, TP. Đà Nẵng",
    "district": "Ngũ Hành Sơn",
    "city": "TP. Đà Nẵng",
    "lat": 16.035,
    "lng": 108.245,
    "isOpen": true,
    "openHours": "06:30 - 21:00",
    "isVerified": true,
    "featuredPromo": "Tặng đĩa bánh lọc cho đơn bún bò từ 100k",
    "hasFreeShip": true,
    "landmark": "MY_KHE",
    "menu": [
      {
        "id": "f-bb-1",
        "restaurantId": "res-bunbo-babe",
        "name": "Tô Bún Bò Gân Nạm Chả Giò Non Nước",
        "description": "Tô bún bò nóng hổi thơm nức mùi ruốc sả, giò heo ninh nhừ, thịt bò mềm ngọt ngào.",
        "price": 48000,
        "originalPrice": 55000,
        "image": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&auto=format&fit=crop&q=80",
        "category": "Bún Bò",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 3890,
        "likesCount": 1410,
        "calories": 560,
        "mealTime": [
          "BREAKFAST",
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-bb-2",
        "restaurantId": "res-bunbo-babe",
        "name": "Mẹt Bánh Nậm & Bánh Lọc Gói Lá Chuối (10 chiếc)",
        "description": "Bột bánh lọc trong vắt thấy rõ tôm thịt rim đỏ au, bánh nậm mềm mịn tan chảy.",
        "price": 45000,
        "image": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80",
        "category": "Bánh Quê",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 4120,
        "likesCount": 1780,
        "calories": 340,
        "mealTime": [
          "ALL_DAY"
        ]
      },
      {
        "id": "f-bb-3",
        "restaurantId": "res-bunbo-babe",
        "name": "Ram Bắp Quảng Nam Giòn Rụm Rau Sống",
        "description": "Bắp non băm nhỏ cuốn bánh tráng chiên vàng ươm chấm nước mắm chua ngọt.",
        "price": 35000,
        "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80",
        "category": "Món Ăn Vặt",
        "isAvailable": true,
        "soldCount": 2890,
        "likesCount": 890,
        "calories": 290,
        "mealTime": [
          "ALL_DAY"
        ]
      },
      {
        "id": "f-bb-4",
        "restaurantId": "res-bunbo-babe",
        "name": "Trà Sữa Thái Xanh Hạt Thạch Giòn",
        "description": "Trà thái xanh thơm ngát béo ngậy sữa đặc và thạch giòn.",
        "price": 20000,
        "image": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80",
        "category": "Đồ Uống",
        "isAvailable": true,
        "soldCount": 2100,
        "likesCount": 650,
        "calories": 220,
        "mealTime": [
          "ALL_DAY"
        ]
      }
    ]
  },
  {
    "id": "res-burger-anthuong",
    "name": "An Thượng Beach Burger & Grill - Ngũ Hành Sơn",
    "tagline": "Phố Tây An Thượng - Burger Bò Wagyu nướng than hồng, cánh gà BBQ và sinh tố trái cây nhiệt đới",
    "logo": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80",
    "coverImage": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&auto=format&fit=crop&q=80",
    "categories": [
      "Gà Rán, Burger & Pizza"
    ],
    "rating": 4.95,
    "totalReviews": 2980,
    "distanceKm": 2.9,
    "deliveryTimeMin": 22,
    "minOrderPrice": 65000,
    "address": "15 An Thượng 2, Phường Mỹ An, Quận Ngũ Hành Sơn, TP. Đà Nẵng",
    "district": "Ngũ Hành Sơn",
    "city": "TP. Đà Nẵng",
    "lat": 16.0498,
    "lng": 108.243,
    "isOpen": true,
    "openHours": "10:00 - 23:30",
    "isVerified": true,
    "featuredPromo": "Tặng khoai tây chiên cho đơn burger từ 120k",
    "hasFreeShip": true,
    "landmark": "MY_KHE",
    "menu": [
      {
        "id": "f-at-1",
        "restaurantId": "res-burger-anthuong",
        "name": "Burger Bò Wagyu Úc Phô Mai Cheddar Nướng Than",
        "description": "Thịt bò Wagyu Úc xay mọng nước nướng than hoa thơm phức, kẹp phô mai Cheddar tan chảy, hành tây caramel và sốt BBQ đặc biệt.",
        "price": 95000,
        "originalPrice": 115000,
        "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80",
        "category": "Burger Cao Cấp",
        "isBestSeller": true,
        "isAvailable": true,
        "soldCount": 4210,
        "likesCount": 1890,
        "allergens": [
          "Bột mì",
          "Sữa"
        ],
        "calories": 750,
        "mealTime": [
          "LUNCH",
          "DINNER"
        ]
      },
      {
        "id": "f-at-2",
        "restaurantId": "res-burger-anthuong",
        "name": "Cánh Gà Nướng Sốt Cay BBQ Biển An Thượng (6 cánh)",
        "description": "Cánh gà tươi nướng mọng nước thấm đẫm sốt BBQ cay ngọt kiểu Mỹ.",
        "price": 79000,
        "image": "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=500&auto=format&fit=crop&q=80",
        "category": "Gà & Khai Vị",
        "isAvailable": true,
        "soldCount": 3120,
        "likesCount": 1240,
        "calories": 520,
        "mealTime": [
          "DINNER"
        ]
      },
      {
        "id": "f-at-3",
        "restaurantId": "res-burger-anthuong",
        "name": "Khoai Tây Múi Cau Nướng Muối Ớt Rosemary",
        "description": "Khoai tây nguyên củ nướng lá hương thảo giòn rụm chấm sốt tỏi Mayo.",
        "price": 45000,
        "image": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80",
        "category": "Ăn Kèm",
        "isAvailable": true,
        "soldCount": 2890,
        "likesCount": 910,
        "calories": 280,
        "mealTime": [
          "ALL_DAY"
        ]
      },
      {
        "id": "f-at-4",
        "restaurantId": "res-burger-anthuong",
        "name": "Sinh Tố Bơ Dừa Sáp Sông Hàn Mát Lạnh",
        "description": "Bơ sáp Đắk Lắk dẻo quánh xay cùng dừa sáp ngọt béo thơm lừng giải nhiệt phố biển.",
        "price": 45000,
        "image": "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format&fit=crop&q=80",
        "category": "Sinh Tố Nhiệt Đới",
        "isAvailable": true,
        "soldCount": 3410,
        "likesCount": 1450,
        "calories": 320,
        "mealTime": [
          "ALL_DAY"
        ]
      }
    ]
  }
,
{
  "id": "res-bunmam-dicuc",
  "name": "Bún Mắm Nêm Dì Cúc - Chợ Cồn",
  "tagline": "Bún mắm nêm thịt quay giòn rụm chuẩn vị Chợ Cồn - Nước mắm nêm cá cơm nguyên chất thơm nồng",
  "logo": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80",
  "coverImage": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&auto=format&fit=crop&q=80",
  "categories": [
    "Bún Chả Cá & Bún Bò",
    "Đặc Sản Đà Nẵng"
  ],
  "rating": 4.95,
  "totalReviews": 1820,
  "distanceKm": 1.1,
  "deliveryTimeMin": 18,
  "minOrderPrice": 35000,
  "address": "128 Ông Ích Khiêm, Phường Hải Châu 2, Quận Hải Châu, TP. Đà Nẵng",
  "district": "Hải Châu",
  "city": "TP. Đà Nẵng",
  "lat": 16.069,
  "lng": 108.215,
  "isOpen": true,
  "openHours": "06:30 - 21:00",
  "isVerified": true,
  "featuredPromo": "Giảm 15k đơn từ 120k + Free ship",
  "hasFreeShip": true,
  "landmark": "CAU_RONG",
  "branches": [
    {
      "id": "br-dicuc-1",
      "restaurantId": "res-bunmam-dicuc",
      "name": "Dì Cúc - Ông Ích Khiêm (Hải Châu)",
      "address": "128 Ông Ích Khiêm, Hải Châu",
      "district": "Hải Châu",
      "phone": "0905 777 888",
      "isOpen": true,
      "todayRevenue": 14200000
    }
  ],
  "menu": [
    {
      "id": "f-dc-1",
      "restaurantId": "res-bunmam-dicuc",
      "name": "Bún Mắm Nêm Heo Quay Da Giòn Rụm",
      "description": "Thịt heo quay da nổ giòn tan, bún tươi cọng nhỏ, mít non luộc, rau sống húng quế và nước mắm nêm cá cơm dầm dứa ớt tỏi đậm đà.",
      "price": 42000,
      "originalPrice": 50000,
      "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80",
      "category": "Bún Mắm Nêm",
      "isBestSeller": true,
      "isAvailable": true,
      "soldCount": 2450,
      "likesCount": 830,
      "allergens": [
        "Hải sản"
      ],
      "calories": 480,
      "mealTime": [
        "BREAKFAST",
        "LUNCH",
        "DINNER"
      ],
      "sizes": [
        {
          "id": "s-std",
          "name": "Tô Chuẩn",
          "priceDiff": 0
        },
        {
          "id": "s-big",
          "name": "Tô Đặc Biệt Heo Quay",
          "priceDiff": 15000
        }
      ],
      "toppings": [
        {
          "id": "top-pork",
          "name": "Thêm đĩa heo quay da giòn",
          "price": 18000
        }
      ]
    },
    {
      "id": "f-dc-2",
      "restaurantId": "res-bunmam-dicuc",
      "name": "Bún Mắm Nêm Chả Bò & Nem Chua Cây",
      "description": "Chả bò tiêu sọ loại 1 giòn dai thơm ngát, nem chua nướng cay the bọc trong lá ổi, kết hợp mắm nêm bí truyền Dì Cúc.",
      "price": 45000,
      "originalPrice": 52000,
      "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80",
      "category": "Bún Mắm Nêm",
      "isBestSeller": true,
      "isAvailable": true,
      "soldCount": 1890,
      "likesCount": 610,
      "allergens": [
        "Hải sản"
      ],
      "calories": 460,
      "mealTime": [
        "LUNCH",
        "DINNER"
      ],
      "sizes": [
        {
          "id": "s-std",
          "name": "Tô Chuẩn",
          "priceDiff": 0
        }
      ],
      "toppings": [
        {
          "id": "top-chabo",
          "name": "Thêm 3 lát chả bò Đà Nẵng",
          "price": 15000
        }
      ]
    }
  ]
},
{
  "id": "res-tocotoco-danang",
  "name": "ToCoToCo Bubble Tea - Bạch Đằng Sông Hàn",
  "tagline": "Trà sữa kem cheese & trân châu hoàng kim ngắm trọn Cầu Rồng lung linh",
  "logo": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80",
  "coverImage": "https://images.unsplash.com/photo-1556881286-fc6915169721?w=900&auto=format&fit=crop&q=80",
  "categories": [
    "Trà Sữa & Cà Phê Muối",
    "Chè Sầu Liên & Ăn Vặt"
  ],
  "rating": 4.92,
  "totalReviews": 2150,
  "distanceKm": 0.9,
  "deliveryTimeMin": 15,
  "minOrderPrice": 30000,
  "address": "218 Bạch Đằng, Phường Phước Ninh, Quận Hải Châu, TP. Đà Nẵng",
  "district": "Hải Châu",
  "city": "TP. Đà Nẵng",
  "lat": 16.064,
  "lng": 108.222,
  "isOpen": true,
  "openHours": "08:00 - 23:00",
  "isVerified": true,
  "featuredPromo": "Mua 1 tặng 1 size L + Tặng trân châu hoàng kim",
  "hasFreeShip": true,
  "landmark": "CAU_RONG",
  "branches": [
    {
      "id": "br-toco-1",
      "restaurantId": "res-tocotoco-danang",
      "name": "ToCoToCo - Bạch Đằng (Hải Châu)",
      "address": "218 Bạch Đằng, Hải Châu",
      "district": "Hải Châu",
      "phone": "0905 333 444",
      "isOpen": true,
      "todayRevenue": 16800000
    }
  ],
  "menu": [
    {
      "id": "f-tc-1",
      "restaurantId": "res-tocotoco-danang",
      "name": "Trà Sữa Panda Trân Châu Hoàng Kim Kem Cheese",
      "description": "Trà sữa truyền thống ủ lá trà Mộc Châu hảo hạng kết hợp trân châu sợi dẻo dai và lớp kem phô mai sánh mịn mặn béo ngậy.",
      "price": 45000,
      "originalPrice": 55000,
      "image": "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format&fit=crop&q=80",
      "category": "Trà Sữa ToCo",
      "isBestSeller": true,
      "isAvailable": true,
      "soldCount": 4200,
      "likesCount": 1650,
      "allergens": [
        "Sữa"
      ],
      "calories": 380,
      "mealTime": [
        "ALL_DAY"
      ],
      "sizes": [
        {
          "id": "s-m",
          "name": "Size M",
          "priceDiff": 0
        },
        {
          "id": "s-l",
          "name": "Size L Khổng Lồ",
          "priceDiff": 8000
        }
      ],
      "toppings": [
        {
          "id": "top-cheese",
          "name": "Thêm lớp Kem Cheese Macchiato",
          "price": 10000
        }
      ]
    },
    {
      "id": "f-tc-2",
      "restaurantId": "res-tocotoco-danang",
      "name": "Ô Long Sữa Nướng Trân Châu Sợi Phô Mai",
      "description": "Hương trà ô long rang lửa than thơm khói quyện đường nướng caramel thanh tao, topping trân châu sợi độc quyền.",
      "price": 48000,
      "originalPrice": 58000,
      "image": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80",
      "category": "Trà Sữa ToCo",
      "isBestSeller": true,
      "isAvailable": true,
      "soldCount": 3100,
      "likesCount": 1120,
      "allergens": [
        "Sữa"
      ],
      "calories": 395,
      "mealTime": [
        "ALL_DAY"
      ],
      "sizes": [
        {
          "id": "s-m",
          "name": "Size M",
          "priceDiff": 0
        },
        {
          "id": "s-l",
          "name": "Size L",
          "priceDiff": 8000
        }
      ],
      "toppings": [
        {
          "id": "top-boba",
          "name": "Thêm trân châu hoàng kim",
          "price": 8000
        }
      ]
    }
  ]
},
{
  "id": "res-banhcanh-ruong",
  "name": "Bánh Canh Ruộng Cầu Thuận Phước - Sơn Trà",
  "tagline": "Bánh canh cá nướng & chả cá đậm đà nổi tiếng chân cầu Thuận Phước - Cay nồng chuẩn vị xứ biển",
  "logo": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80",
  "coverImage": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=900&auto=format&fit=crop&q=80",
  "categories": [
    "Bún Chả Cá & Bún Bò",
    "Hải Sản Biển Mỹ Khê"
  ],
  "rating": 4.94,
  "totalReviews": 3100,
  "distanceKm": 2.2,
  "deliveryTimeMin": 22,
  "minOrderPrice": 30000,
  "address": "Kiệt 20 Trần Hưng Đạo, Phường Nại Hiên Đông, Quận Sơn Trà, TP. Đà Nẵng",
  "district": "Sơn Trà",
  "city": "TP. Đà Nẵng",
  "lat": 16.088,
  "lng": 108.225,
  "isOpen": true,
  "openHours": "14:00 - 23:30",
  "isVerified": true,
  "featuredPromo": "Freeship đơn từ 60k + Tặng chả ram",
  "hasFreeShip": true,
  "landmark": "MY_KHE",
  "branches": [
    {
      "id": "br-bcruong-1",
      "restaurantId": "res-banhcanh-ruong",
      "name": "Bánh Canh Ruộng - Chân Cầu Thuận Phước",
      "address": "Kiệt 20 Trần Hưng Đạo, Sơn Trà",
      "district": "Sơn Trà",
      "phone": "0905 555 666",
      "isOpen": true,
      "todayRevenue": 21500000
    }
  ],
  "menu": [
    {
      "id": "f-bcr-1",
      "restaurantId": "res-banhcanh-ruong",
      "name": "Bánh Canh Cá Chỉ Vàng Nướng & Trứng Cút",
      "description": "Cá chỉ vàng tẩm ướp nướng than hoa thơm phức gỡ xương, sợi bánh canh bột gạo mềm mại, nước dùng nấu từ xương cá ngọt tự nhiên và sa tế cay xé lưỡi.",
      "price": 30000,
      "originalPrice": 35000,
      "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80",
      "category": "Bánh Canh Đặc Sản",
      "isBestSeller": true,
      "isAvailable": true,
      "soldCount": 5800,
      "likesCount": 2100,
      "allergens": [
        "Hải sản"
      ],
      "calories": 420,
      "mealTime": [
        "SNACK",
        "DINNER"
      ],
      "sizes": [
        {
          "id": "s-std",
          "name": "Tô Vừa",
          "priceDiff": 0
        },
        {
          "id": "s-big",
          "name": "Tô Lớn Thập Cẩm",
          "priceDiff": 10000
        }
      ],
      "toppings": [
        {
          "id": "top-banhmi",
          "name": "Bánh mì chấm súp (1 ổ)",
          "price": 5000
        }
      ]
    }
  ]
},
{
  "id": "res-bethui-muoihien",
  "name": "Bê Thui Cầu Mống Mười Hiển - Ngũ Hành Sơn",
  "tagline": "Bê thui than hoa da vàng giòn ngọt thịt - Mắm cái thượng hạng cuốn rau rừng Tây Giang",
  "logo": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80",
  "coverImage": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&auto=format&fit=crop&q=80",
  "categories": [
    "Đặc Sản Đà Nẵng",
    "Bánh Tráng Thịt Heo"
  ],
  "rating": 4.96,
  "totalReviews": 1650,
  "distanceKm": 3.8,
  "deliveryTimeMin": 25,
  "minOrderPrice": 100000,
  "address": "268 Lê Văn Hiến, Phường Khuê Mỹ, Quận Ngũ Hành Sơn, TP. Đà Nẵng",
  "district": "Ngũ Hành Sơn",
  "city": "TP. Đà Nẵng",
  "lat": 16.025,
  "lng": 108.245,
  "isOpen": true,
  "openHours": "09:00 - 22:00",
  "isVerified": true,
  "featuredPromo": "Tặng đĩa rau rừng & mắm cái thượng hạng",
  "hasFreeShip": true,
  "landmark": "MY_KHE",
  "branches": [
    {
      "id": "br-muoihien-1",
      "restaurantId": "res-bethui-muoihien",
      "name": "Mười Hiển - Lê Văn Hiến (Ngũ Hành Sơn)",
      "address": "268 Lê Văn Hiến, Ngũ Hành Sơn",
      "district": "Ngũ Hành Sơn",
      "phone": "0905 111 222",
      "isOpen": true,
      "todayRevenue": 26000000
    }
  ],
  "menu": [
    {
      "id": "f-bt-1",
      "restaurantId": "res-bethui-muoihien",
      "name": "Mẹt Bê Thui Than Hoa Cầu Mống Loại 1 (300g)",
      "description": "Thịt bê tơ thui rơm nguyên con da mềm mọng nước, tái chanh chấm mắm cái cá cơm dầm ớt xiêm xanh cuốn bánh tráng mè và 12 vị rau rừng.",
      "price": 180000,
      "originalPrice": 220000,
      "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80",
      "category": "Bê Thui Đặc Sản",
      "isBestSeller": true,
      "isAvailable": true,
      "soldCount": 1620,
      "likesCount": 780,
      "allergens": [
        "Hải sản"
      ],
      "calories": 650,
      "mealTime": [
        "LUNCH",
        "DINNER"
      ],
      "sizes": [
        {
          "id": "s-300g",
          "name": "Phần 300g (2 người)",
          "priceDiff": 0
        },
        {
          "id": "s-500g",
          "name": "Phần 500g (3-4 người)",
          "priceDiff": 110000
        }
      ],
      "toppings": [
        {
          "id": "top-chao",
          "name": "Tô cháo tủy bê hành hoa",
          "price": 45000
        }
      ]
    }
  ]
},
{
  "id": "res-comtam-baghien",
  "name": "Cơm Tấm Sài Gòn Ba Ghiền - Hà Huy Tập (Thanh Khê)",
  "tagline": "Sườn cây nướng than hoa mềm mọng đẫm sốt mật ong - Chả trứng hấp & bì heo nhà làm",
  "logo": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80",
  "coverImage": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&auto=format&fit=crop&q=80",
  "categories": [
    "Cơm Gà & Cơm Niêu",
    "Thức Ăn Nhanh"
  ],
  "rating": 4.93,
  "totalReviews": 1980,
  "distanceKm": 2.1,
  "deliveryTimeMin": 20,
  "minOrderPrice": 40000,
  "address": "45 Hà Huy Tập, Phường Chính Gián, Quận Thanh Khê, TP. Đà Nẵng",
  "district": "Thanh Khê",
  "city": "TP. Đà Nẵng",
  "lat": 16.065,
  "lng": 108.192,
  "isOpen": true,
  "openHours": "07:00 - 21:30",
  "isVerified": true,
  "featuredPromo": "Giảm 20k đơn từ 150k + Trà đá miễn phí",
  "hasFreeShip": true,
  "landmark": "AIRPORT",
  "branches": [
    {
      "id": "br-baghien-1",
      "restaurantId": "res-comtam-baghien",
      "name": "Ba Ghiền - Hà Huy Tập (Thanh Khê)",
      "address": "45 Hà Huy Tập, Thanh Khê",
      "district": "Thanh Khê",
      "phone": "0905 444 333",
      "isOpen": true,
      "todayRevenue": 18200000
    }
  ],
  "menu": [
    {
      "id": "f-ct-1",
      "restaurantId": "res-comtam-baghien",
      "name": "Cơm Tấm Sườn Bì Chả Trứng Ốp La Đầy Đủ",
      "description": "Sườn cốt lết dày thịt ướp mật ong nướng than hoa cháy xém thơm lừng, chả trứng thịt hấp mộc nhĩ, bì heo thơm thính gạo rang, mỡ hành tép mỡ giòn rụm.",
      "price": 68000,
      "originalPrice": 78000,
      "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80",
      "category": "Cơm Tấm Sài Gòn",
      "isBestSeller": true,
      "isAvailable": true,
      "soldCount": 3400,
      "likesCount": 1290,
      "allergens": [
        "Trứng"
      ],
      "calories": 720,
      "mealTime": [
        "LUNCH",
        "DINNER"
      ],
      "sizes": [
        {
          "id": "s-std",
          "name": "Dĩa Chuẩn",
          "priceDiff": 0
        },
        {
          "id": "s-extra",
          "name": "Dĩa Thêm Cơm & Ốp La",
          "priceDiff": 12000
        }
      ],
      "toppings": [
        {
          "id": "top-suon",
          "name": "Thêm 1 miếng sườn nướng",
          "price": 32000
        }
      ]
    }
  ]
},
{
  "id": "res-laubo-sauhung",
  "name": "Lẩu Bò Sáu Hưng - Tôn Đức Thắng (Liên Chiểu & Làng ĐH)",
  "tagline": "Lẩu bò tươi nhúng thố đất gia truyền - Nước dùng hầm xương ống ngọt thanh đậm đà",
  "logo": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80",
  "coverImage": "https://images.unsplash.com/photo-1547592180-85f173990554?w=900&auto=format&fit=crop&q=80",
  "categories": [
    "Đặc Sản Đà Nẵng",
    "Cơm Gà & Cơm Niêu"
  ],
  "rating": 4.95,
  "totalReviews": 2400,
  "distanceKm": 4.5,
  "deliveryTimeMin": 28,
  "minOrderPrice": 80000,
  "address": "1191 Tôn Đức Thắng, Phường Hòa Khánh Bắc, Quận Liên Chiểu, TP. Đà Nẵng",
  "district": "Liên Chiểu",
  "city": "TP. Đà Nẵng",
  "lat": 16.078,
  "lng": 108.148,
  "isOpen": true,
  "openHours": "10:00 - 23:00",
  "isVerified": true,
  "featuredPromo": "Tặng đĩa mì trứng + Rau nhúng lẩu thả ga",
  "hasFreeShip": true,
  "landmark": "UNIVERSITIES",
  "branches": [
    {
      "id": "br-sauhung-1",
      "restaurantId": "res-laubo-sauhung",
      "name": "Sáu Hưng - Tôn Đức Thắng (Liên Chiểu)",
      "address": "1191 Tôn Đức Thắng, Liên Chiểu",
      "district": "Liên Chiểu",
      "phone": "0905 999 111",
      "isOpen": true,
      "todayRevenue": 29400000
    }
  ],
  "menu": [
    {
      "id": "f-lb-1",
      "restaurantId": "res-laubo-sauhung",
      "name": "Nồi Lẩu Bò Thập Cẩm Thố Đất (Nạm, Gầu, Gân, Đuôi)",
      "description": "Nồi lẩu bò thơm nồng mùi quế hồi và sả ớt, đầy ắp nạm bò mềm, gầu giòn, gân bò dẻo trong và khoanh đuôi bò béo ngậy, ăn kèm cải xanh mồng tơi và mì tươi.",
      "price": 220000,
      "originalPrice": 260000,
      "image": "https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=80",
      "category": "Lẩu Bò Thố Đất",
      "isBestSeller": true,
      "isAvailable": true,
      "soldCount": 2100,
      "likesCount": 940,
      "allergens": [],
      "calories": 780,
      "mealTime": [
        "DINNER"
      ],
      "sizes": [
        {
          "id": "s-small",
          "name": "Nồi Nhỏ (2 người)",
          "priceDiff": 0
        },
        {
          "id": "s-large",
          "name": "Nồi Lớn (3-4 người)",
          "priceDiff": 80000
        }
      ],
      "toppings": [
        {
          "id": "top-mi",
          "name": "Thêm đĩa mì trứng tươi (2 vắt)",
          "price": 15000
        }
      ]
    }
  ]
},
{
  "id": "res-banhtrang-dailoc",
  "name": "Bánh Tráng Cuốn Thịt Heo Đại Lộc (Cẩm Lệ)",
  "tagline": "Bánh tráng phơi sương Đại Lộc dẻo thơm hạt gạo - Thịt heo ba chỉ quế luộc mềm ngọt cuốn rau tươi",
  "logo": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80",
  "coverImage": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&auto=format&fit=crop&q=80",
  "categories": [
    "Bánh Tráng Thịt Heo",
    "Đặc Sản Đà Nẵng"
  ],
  "rating": 4.93,
  "totalReviews": 1420,
  "distanceKm": 3.2,
  "deliveryTimeMin": 24,
  "minOrderPrice": 45000,
  "address": "98 Cách Mạng Tháng 8, Phường Khuê Trung, Quận Cẩm Lệ, TP. Đà Nẵng",
  "district": "Cẩm Lệ",
  "city": "TP. Đà Nẵng",
  "lat": 16.031,
  "lng": 108.201,
  "isOpen": true,
  "openHours": "08:30 - 21:30",
  "isVerified": true,
  "featuredPromo": "Freeship toàn TP đơn từ 90k",
  "hasFreeShip": true,
  "landmark": "ALL",
  "branches": [
    {
      "id": "br-dailoc-1",
      "restaurantId": "res-banhtrang-dailoc",
      "name": "Đại Lộc Quán - Cách Mạng Tháng 8 (Cẩm Lệ)",
      "address": "98 Cách Mạng Tháng 8, Cẩm Lệ",
      "district": "Cẩm Lệ",
      "phone": "0905 888 999",
      "isOpen": true,
      "todayRevenue": 15800000
    }
  ],
  "menu": [
    {
      "id": "f-btdl-1",
      "restaurantId": "res-banhtrang-dailoc",
      "name": "Mẹt Bánh Tráng Phơi Sương Cuốn Thịt Heo Quế Luộc",
      "description": "Thịt heo ba chỉ quế luộc tới thơm mềm, bánh tráng Đại Lộc nhúng nước mềm dẻo, rổ rau ghém gồm dưa leo, chuối chát, khế chua và mắm nêm gia truyền.",
      "price": 75000,
      "originalPrice": 85000,
      "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80",
      "category": "Bánh Tráng Cuốn",
      "isBestSeller": true,
      "isAvailable": true,
      "soldCount": 2780,
      "likesCount": 990,
      "allergens": [
        "Hải sản"
      ],
      "calories": 560,
      "mealTime": [
        "LUNCH",
        "DINNER"
      ],
      "sizes": [
        {
          "id": "s-1p",
          "name": "Suất 1 người",
          "priceDiff": 0
        },
        {
          "id": "s-2p",
          "name": "Mẹt lớn 2 người",
          "priceDiff": 60000
        }
      ],
      "toppings": [
        {
          "id": "top-meat",
          "name": "Thêm đĩa thịt luộc quế",
          "price": 40000
        }
      ]
    }
  ]
}
];

export const MOCK_FLASH_DEALS = [
  {
    "id": "flash-1",
    "foodId": "f-bm-1",
    "restaurantId": "res-bamuamiquang",
    "restaurantName": "Mì Quảng Bà Mua",
    "name": "Mì Quảng Gà Ta Rút Xương & Trứng Cút",
    "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80",
    "originalPrice": 55000,
    "salePrice": 35000,
    "discountPercent": 36,
    "soldPercent": 88,
    "totalStock": 100,
    "remainingStock": 12,
    "badge": "GIẢM 36%"
  },
  {
    "id": "flash-2",
    "foodId": "f-tr-1",
    "restaurantId": "res-dacsan-tran",
    "restaurantName": "Đặc Sản Trần",
    "name": "Bánh Tráng Cuốn Thịt Heo 2 Đầu Da Luộc",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80",
    "originalPrice": 99000,
    "salePrice": 69000,
    "discountPercent": 30,
    "soldPercent": 92,
    "totalStock": 80,
    "remainingStock": 6,
    "badge": "GIẢM 30k"
  },
  {
    "id": "flash-3",
    "foodId": "f-hon-1",
    "restaurantId": "res-bunchacahon",
    "restaurantName": "Bún Chả Cá Hờn 113A",
    "name": "Bún Chả Cá Thập Cẩm Tô Lớn Đặc Biệt",
    "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80",
    "originalPrice": 55000,
    "salePrice": 38000,
    "discountPercent": 31,
    "soldPercent": 84,
    "totalStock": 120,
    "remainingStock": 19,
    "badge": "GIẢM 31%"
  },
  {
    "id": "flash-4",
    "foodId": "f-csl-1",
    "restaurantId": "res-chesaulien",
    "restaurantName": "Chè Sầu Liên",
    "name": "Chè Thái Sầu Riêng Cô Liên Bestseller",
    "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80",
    "originalPrice": 42000,
    "salePrice": 28000,
    "discountPercent": 33,
    "soldPercent": 95,
    "totalStock": 150,
    "remainingStock": 8,
    "badge": "GIẢM 33%"
  },
  {
    "id": "flash-5",
    "foodId": "f-pl-1",
    "restaurantId": "res-phuclong-danang",
    "restaurantName": "Phúc Long Nguyễn Văn Linh",
    "name": "Trà Sữa Phúc Long Truyền Thống (Size L)",
    "image": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80",
    "originalPrice": 65000,
    "salePrice": 45000,
    "discountPercent": 31,
    "soldPercent": 78,
    "totalStock": 100,
    "remainingStock": 22,
    "badge": "GIẢM 20k"
  },
  {
    "id": "flash-6",
    "foodId": "f-bl-1",
    "restaurantId": "res-banhmi-balan",
    "restaurantName": "Bánh Mì Bà Lan",
    "name": "Bánh Mì Chả Bò Đà Nẵng Thập Cẩm",
    "image": "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop&q=80",
    "originalPrice": 35000,
    "salePrice": 22000,
    "discountPercent": 37,
    "soldPercent": 89,
    "totalStock": 90,
    "remainingStock": 10,
    "badge": "GIẢM 37%"
  }
];

export const MOCK_BEST_SELLERS = [
  {
    "id": "f-bm-1",
    "restaurantId": "res-bamuamiquang",
    "restaurantName": "Mì Quảng Bà Mua",
    "name": "Mì Quảng Gà Ta Rút Xương & Trứng Cút",
    "price": 45000,
    "originalPrice": 55000,
    "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80",
    "rating": 4.96,
    "soldCount": 3840,
    "tag": "Top 1 Mì Quảng Đà Nẵng",
    "category": "Mì Quảng"
  },
  {
    "id": "f-tr-1",
    "restaurantId": "res-dacsan-tran",
    "restaurantName": "Đặc Sản Trần",
    "name": "Bánh Tráng Cuốn Thịt Heo 2 Đầu Da Luộc",
    "price": 85000,
    "originalPrice": 99000,
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=80",
    "rating": 4.97,
    "soldCount": 6890,
    "tag": "Đặc Sản Nức Tiếng",
    "category": "Bánh Tráng"
  },
  {
    "id": "f-beman-2",
    "restaurantId": "res-beman-seafood",
    "restaurantName": "Hải Sản Bé Mặn",
    "name": "Mực Trứng Nướng Sa Tế Cực Cay Giòn Ngọt",
    "price": 145000,
    "originalPrice": 170000,
    "image": "https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&auto=format&fit=crop&q=80",
    "rating": 4.95,
    "soldCount": 3950,
    "tag": "Hải Sản Biển Mỹ Khê",
    "category": "Hải Sản"
  },
  {
    "id": "f-hon-1",
    "restaurantId": "res-bunchacahon",
    "restaurantName": "Bún Chả Cá Hờn 113A",
    "name": "Bún Chả Cá Thập Cẩm (Tô Đặc Biệt)",
    "price": 45000,
    "originalPrice": 55000,
    "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80",
    "rating": 4.95,
    "soldCount": 4890,
    "tag": "Gia Truyền Hải Châu",
    "category": "Bún Chả Cá"
  },
  {
    "id": "f-bxd-1",
    "restaurantId": "res-banhxeobaduong",
    "restaurantName": "Bánh Xèo Bà Dưỡng",
    "name": "Mẹt Bánh Xèo Giòn Rụm Bà Dưỡng (4 Cái)",
    "price": 75000,
    "originalPrice": 85000,
    "image": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80",
    "rating": 4.98,
    "soldCount": 8200,
    "tag": "Huyền Thoại Kiệt 280",
    "category": "Bánh Xèo"
  },
  {
    "id": "f-cg-1",
    "restaurantId": "res-comgababuoi",
    "restaurantName": "Cơm Gà Bà Buội",
    "name": "Cơm Gà Xé Bóp Gỏi Hành Tây Rau Răm",
    "price": 55000,
    "originalPrice": 65000,
    "image": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80",
    "rating": 4.93,
    "soldCount": 5120,
    "tag": "Cơm Gà Xứ Quảng",
    "category": "Cơm Gà"
  },
  {
    "id": "f-csl-1",
    "restaurantId": "res-chesaulien",
    "restaurantName": "Chè Sầu Liên",
    "name": "Chè Thái Sầu Riêng Cô Liên Bestseller",
    "price": 35000,
    "originalPrice": 42000,
    "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80",
    "rating": 4.98,
    "soldCount": 9950,
    "tag": "Bestseller Toàn Quốc",
    "category": "Chè Sầu"
  },
  {
    "id": "f-bl-1",
    "restaurantId": "res-banhmi-balan",
    "restaurantName": "Bánh Mì Bà Lan",
    "name": "Bánh Mì Chả Bò Đà Nẵng Thập Cẩm",
    "price": 30000,
    "originalPrice": 35000,
    "image": "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop&q=80",
    "rating": 4.96,
    "soldCount": 9450,
    "tag": "Bánh Mì Ngon Nhất Đà Nẵng",
    "category": "Bánh Mì"
  }
];

export const MOCK_CLAIMABLE_VOUCHERS = [
  {
    "id": "voc-claim-giabao",
    "code": "GIABAO50",
    "title": "Gia Bảo Khao 50% Tối Đa 50K",
    "desc": "Đơn từ 70k toàn TP Đà Nẵng",
    "tag": "ĐỘC QUYỀN",
    "color": "from-amber-400 via-yellow-500 to-amber-600"
  },
  {
    "id": "voc-claim-1",
    "code": "BEFOOD50",
    "title": "Giảm 50% Tối Đa 40K",
    "desc": "Đơn từ 80k toàn Đà Nẵng",
    "tag": "HOT NHẤT",
    "color": "from-amber-500 to-yellow-400"
  },
  {
    "id": "voc-claim-2",
    "code": "FREESHIP0D",
    "title": "Freeship 0Đ Tối Đa 25K",
    "desc": "Giao nhanh bằng BeBike",
    "tag": "FREESHIP",
    "color": "from-blue-600 to-cyan-500"
  },
  {
    "id": "voc-claim-3",
    "code": "DANANG35K",
    "title": "Chào Đà Nẵng Giảm 35K",
    "desc": "Cho đơn đặc sản từ 90k",
    "tag": "ĐÀ NẴNG",
    "color": "from-emerald-600 to-teal-500"
  },
  {
    "id": "voc-claim-4",
    "code": "TRUANAY50K",
    "title": "Trưa Nay Ăn Gì Giảm 50K",
    "desc": "Áp dụng khung giờ 10h30 - 13h30",
    "tag": "GIỜ VÀNG",
    "color": "from-rose-500 to-orange-400"
  },
  {
    "id": "voc-claim-5",
    "code": "TIECNHAU70K",
    "title": "Hải Sản Tối Giảm 70K",
    "desc": "Đơn hải sản Bé Mặn, Năm Đảnh từ 250k",
    "tag": "TIỆC TỐI",
    "color": "from-purple-600 to-indigo-500"
  }
];

export const MOCK_VOUCHERS: Voucher[] = [
  {
    id: 'voc-dn-1',
    code: 'DANANGWELCOME',
    title: 'Chào Bạn Đến Đà Nẵng - Giảm 30.000đ',
    description: 'Ưu đãi đặt món đặc sản Mì Quảng, Bánh tráng thịt heo cho đơn từ 80.000đ tại TP. Đà Nẵng.',
    discountType: 'FIXED',
    discountValue: 30000,
    minOrderValue: 80000,
    expireDate: '31/12/2026',
    badge: 'ĐÀ NẴNG HOT',
  },
  {
    id: 'voc-dn-2',
    code: 'CAURONG50K',
    title: 'Ẩm Thực Cầu Rồng Sông Hàn - Giảm 50.000đ',
    description: 'Giảm 50.000đ cho đơn tiệc gia đình hoặc đặt nhóm tại quận Hải Châu và Sơn Trà.',
    discountType: 'FIXED',
    discountValue: 50000,
    minOrderValue: 200000,
    expireDate: '31/12/2026',
    badge: 'CẦU RỒNG VIP',
  },
  {
    id: 'voc-dn-3',
    code: 'FREESHIP',
    title: 'Miễn Phí Vận Chuyển Toàn Đà Nẵng',
    description: 'Freeship 0Đ cho đơn từ 50.000đ, tài xế beBike giao nóng tận cửa trong 20 phút.',
    discountType: 'PERCENT',
    discountValue: 100,
    minOrderValue: 50000,
    maxDiscount: 25000,
    expireDate: '31/12/2026',
    badge: 'FREESHIP 0Đ',
  },
  {
    id: 'voc-dn-4',
    code: 'MYKHEBEACH',
    title: 'Tiệc Hải Sản Biển Mỹ Khê - Giảm 70.000đ',
    description: 'Giảm 70.000đ khi đặt món hải sản tươi sống tại quán Bé Mặn, Năm Đảnh cho đơn từ 300.000đ.',
    discountType: 'FIXED',
    discountValue: 70000,
    minOrderValue: 300000,
    expireDate: '31/12/2026',
    badge: 'BIỂN MỸ KHÊ',
  },
];

export const MOCK_ACTIVE_DRIVER: DriverInfo = {
  id: 'drv-dn-88',
  name: 'Nguyễn Văn Be (Đà Nẵng)',
  phone: '0905 888 668',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  vehicleType: 'Honda Wave RSX 110cc',
  licensePlate: '43-D1 888.68 (Biển số Đà Nẵng)',
  rating: 4.96,
  completedTrips: 3412,
  currentLat: 16.0603,
  currentLng: 108.2160,
  todayEarnings: 420000,
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-dn-101',
    orderCode: 'BE-DN-9941',
    userId: 'usr-101',
    userName: 'Trần Minh Quang',
    userPhone: '0908 123 456',
    restaurantId: 'res-bamuamiquang',
    restaurantName: 'Mì Quảng Bà Mua - Đặc Sản Đà Nẵng',
    restaurantAddress: '95A Nguyễn Tri Phương, Thanh Khê, Đà Nẵng',
    restaurantLogo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
    deliveryAddress: INITIAL_USER.addresses[0],
    items: [
      {
        cartItemId: 'ci-1',
        food: MOCK_RESTAURANTS[0].menu[0],
        quantity: 2,
        unitPrice: 53000,
        totalPrice: 106000,
        options: {
          size: MOCK_RESTAURANTS[0].menu[0].sizes?.[0],
          toppings: [MOCK_RESTAURANTS[0].menu[0].toppings![1]],
        },
      },
      {
        cartItemId: 'ci-2',
        food: MOCK_RESTAURANTS[0].menu[3],
        quantity: 2,
        unitPrice: 18000,
        totalPrice: 36000,
        options: {
          toppings: [],
        },
      },
    ],
    subtotal: 142000,
    deliveryFee: 15000,
    discountAmount: 30000,
    voucherCode: 'DANANGWELCOME',
    driverTip: 10000,
    totalAmount: 137000,
    paymentMethod: 'BEPAY',
    paymentStatus: 'PAID',
    orderStatus: 'DELIVERING',
    statusHistory: [
      { status: 'PENDING', timestamp: '11:15', note: 'Khách hàng hoàn tất đặt đơn tại Đà Nẵng' },
      { status: 'CONFIRMED', timestamp: '11:17', note: 'Quán Bà Mua đã xác nhận đơn' },
      { status: 'PREPARING', timestamp: '11:20', note: 'Bếp đang trụng mì và nướng bánh tráng mè' },
      { status: 'DELIVERING', timestamp: '11:28', note: 'Tài xế Nguyễn Văn Be đang chạy qua cầu Rồng giao đến 155 Nguyễn Văn Linh' },
    ],
    driver: MOCK_ACTIVE_DRIVER,
    createdAt: '2026-11-01T11:15:00Z',
    estimatedDeliveryTime: '11:40 (Khoảng 12 phút nữa)',
    customerNote: 'Cho em thêm ớt xanh miền Trung và chanh nhé anh tài xế ơi!',
  },
];

export const MOCK_KITCHEN_TICKETS: KitchenTicket[] = [
  {
    id: 'kds-dn-1',
    orderCode: 'BE-DN-9941',
    restaurantName: 'Mì Quảng Bà Mua - Đà Nẵng',
    orderType: 'DELIVERY',
    status: 'COOKING',
    createdAtTime: '11:20',
    elapsedMinutes: 8,
    items: [
      {
        name: 'Mì Quảng Gà Ta Thả Vườn',
        quantity: 2,
        notes: 'Thêm bánh tráng mè nướng giòn',
      },
      {
        name: 'Sữa Bắp Nếp Cẩm Mát Lạnh',
        quantity: 2,
      },
    ],
  },
];

export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'ing-dn-1',
    ingredientName: 'Gạo ST25 Ông Cua (Nấu Cơm Gà Đà Nẵng)',
    category: 'Lương thực chính',
    currentStock: 120,
    unit: 'kg',
    minThreshold: 100,
    supplier: 'Đại lý gạo sạch Sông Hàn Đà Nẵng',
    expiryDate: '15/12/2026',
    isExpiringSoon: false,
    costPerUnit: 28000,
  },
  {
    id: 'ing-dn-2',
    ingredientName: 'Mì Quảng Tươi Sợi Nghệ Đại Lộc',
    category: 'Mì & Bún tươi',
    currentStock: 35,
    unit: 'kg',
    minThreshold: 40,
    supplier: 'Lò tráng mì truyền thống Đại Lộc',
    expiryDate: '02/11/2026',
    isExpiringSoon: true,
    costPerUnit: 18000,
  },
  {
    id: 'ing-dn-3',
    ingredientName: 'Mắm Nêm Dì Cẩn Thượng Hạng',
    category: 'Gia vị đặc sản',
    currentStock: 48,
    unit: 'hũ',
    minThreshold: 20,
    supplier: 'Cơ sở Mắm Dì Cẩn - Chợ Cồn Đà Nẵng',
    expiryDate: '30/08/2027',
    isExpiringSoon: false,
    costPerUnit: 45000,
  },
  {
    id: 'ing-dn-4',
    ingredientName: 'Tôm Sú Biển Mỹ Khê Tươi Sống',
    category: 'Hải sản',
    currentStock: 15,
    unit: 'kg',
    minThreshold: 25,
    supplier: 'Hợp tác xã Ngư dân Thọ Quang Sơn Trà',
    expiryDate: '03/11/2026',
    isExpiringSoon: true,
    costPerUnit: 220000,
  },
  {
    id: 'ing-dn-5',
    ingredientName: 'Cơm Sầu Riêng Ri6 Tươi (Nấu Chè Liên)',
    category: 'Trái cây & Tráng miệng',
    currentStock: 25,
    unit: 'kg',
    minThreshold: 15,
    supplier: 'Nhà cung cấp nông sản sạch Đà Nẵng',
    expiryDate: '05/11/2026',
    isExpiringSoon: false,
    costPerUnit: 160000,
  },
];

export const MOCK_SETTLEMENTS: RestaurantSettlement[] = [
  {
    id: 'set-dn-1',
    restaurantId: 'res-bamuamiquang',
    restaurantName: 'Mì Quảng Bà Mua - Đà Nẵng',
    period: 'Kỳ 1 (01/10 - 15/10/2026)',
    totalOrders: 1450,
    grossAmount: 78500000,
    commissionAmount: 14130000,
    payoutAmount: 64370000,
    status: 'PAID',
  },
  {
    id: 'set-dn-2',
    restaurantId: 'res-dacsan-tran',
    restaurantName: 'Đặc Sản Trần - Lê Duẩn',
    period: 'Kỳ 2 (16/10 - 31/10/2026)',
    totalOrders: 2180,
    grossAmount: 142000000,
    commissionAmount: 25560000,
    payoutAmount: 116440000,
    status: 'PENDING',
  },
  {
    id: 'set-dn-3',
    restaurantId: 'res-beman-seafood',
    restaurantName: 'Hải Sản Bé Mặn - Biển Mỹ Khê',
    period: 'Kỳ 2 (16/10 - 31/10/2026)',
    totalOrders: 3120,
    grossAmount: 245000000,
    commissionAmount: 44100000,
    payoutAmount: 200900000,
    status: 'PENDING',
  },
];

export const MOCK_MARKETING_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'cam-dn-1',
    title: 'Lễ Hội Ẩm Thực Đà Nẵng 2026 - Mỹ Vị Sông Hàn',
    targetGroup: 'ALL',
    type: 'VOUCHER',
    bannerImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
    discountInfo: 'Giảm 25% tối đa 50k',
    startDate: '01/11/2026',
    endDate: '15/11/2026',
    status: 'ACTIVE',
  },
  {
    id: 'cam-dn-2',
    title: 'Mỹ Khê Đêm Hải Sản - Freeship 0Đ Sau 20H',
    targetGroup: 'VIP',
    type: 'FLASH_SALE',
    bannerImage: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&auto=format&fit=crop&q=80',
    discountInfo: 'Freeship 0Đ bãi biển Mỹ Khê',
    startDate: '01/11/2026',
    endDate: '30/11/2026',
    status: 'ACTIVE',
  },
];

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tik-dn-1',
    ticketCode: 'TK-DN-881',
    customerId: 'usr-101',
    customerName: 'Trần Minh Quang',
    customerPhone: '0908 123 456',
    orderCode: 'BE-DN-9941',
    restaurantName: 'Mì Quảng Bà Mua',
    topic: 'Quán quên gửi kèm bánh tráng mè nướng theo đơn',
    priority: 'MEDIUM',
    status: 'OPEN',
    createdAt: '11:32 01/11/2026',
    messages: [
      {
        id: 'msg-tk-1',
        sender: 'customer',
        senderName: 'Trần Minh Quang',
        text: 'Em đặt 2 tô Mì Quảng Bà Mua có chọn thêm bánh tráng nướng mè mà kiểm tra bọc hàng chỉ có mì thôi ạ!',
        timestamp: '11:32',
      },
    ],
  },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-dn-1',
    restaurantId: 'res-bamuamiquang',
    restaurantName: 'Mì Quảng Bà Mua - Đặc Sản Đà Nẵng',
    foodName: 'Mì Quảng Gà Ta Thả Vườn',
    userId: 'usr-101',
    userName: 'Trần Minh Quang',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Mì Quảng Bà Mua đúng chuẩn gốc Quảng Nam - Đà Nẵng! Sợi mì mềm dai, nước nhưn gà ta rim sả ớt thơm lừng, thịt gà săn chắc ngọt thịt. Bánh tráng mè Đại Lộc nướng giòn rụm bẻ vụn vào ăn cực đã. Tài xế BeBike giao đến còn nóng hổi chỉ mất 15 phút. Sẽ ủng hộ quán dài lâu!',
    tags: ['Ngon chuẩn vị Đà Nẵng', 'Giao nhanh 15p', 'Nóng hổi', 'Thịt gà ta ngọt'],
    images: [
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop&q=80'
    ],
    orderCode: 'BE-DN-9941',
    likes: 24,
    isLiked: false,
    createdAt: 'Hôm nay lúc 11:45',
    reply: {
      author: 'Chủ Quán Mì Quảng Bà Mua',
      content: 'Cảm ơn anh Quang nhiều ạ! Quán luôn chọn lọc gà ta tươi mỗi sáng và rim theo công thức gia truyền để phục vụ bà con. Chúc anh một bữa trưa ngon miệng!',
      date: 'Hôm nay lúc 12:00'
    }
  },
  {
    id: 'rev-dn-2',
    restaurantId: 'res-bamuamiquang',
    restaurantName: 'Mì Quảng Bà Mua - Đặc Sản Đà Nẵng',
    foodName: 'Mì Quảng Ếch Đồng',
    userId: 'usr-102',
    userName: 'Lê Hoàng Yến (Sơn Trà)',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Mì ếch đồng để trong thố giữ nhiệt rất nóng, ếch làm sạch sẽ xào nghệ tươi vàng ươm thơm nức mũi. Rau sống bắp chuối và cải non tươi roi rói. 10 điểm cho chất lượng và độ đóng gói sạch sẽ của BeFood!',
    tags: ['Đóng gói sạch sẽ', 'Ngon xuất sắc', 'Rau sống tươi'],
    images: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80'
    ],
    orderCode: 'BE-DN-8812',
    likes: 18,
    isLiked: true,
    createdAt: 'Hôm qua lúc 18:20'
  },
  {
    id: 'rev-dn-3',
    restaurantId: 'res-bunchacahon113',
    restaurantName: 'Bún Chả Cá Hờn 113A - Gia Truyền Hải Châu',
    foodName: 'Bún Chả Cá Thập Cẩm Tô Lớn',
    userId: 'usr-103',
    userName: 'Nguyễn Văn Đạt (Hải Châu)',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Bún chả cá Hờn thì quá trứ danh đất Đà Thành rồi, nước dùng hầm từ xương cá thu cùng bí đỏ và thơm ngọt thanh không gắt bột ngọt. Chả cá hấp và chiên cắn ngập răng dai giòn. Kèm theo sữa đậu nành lá dứa mát rượi.',
    tags: ['Nước dùng ngọt thanh', 'Chả cá dai giòn', 'Chuẩn vị truyền thống'],
    orderCode: 'BE-DN-7734',
    likes: 12,
    isLiked: false,
    createdAt: '01/11/2026 09:15',
    reply: {
      author: 'Chủ Quán Bún Chả Cá Hờn',
      content: 'Dạ quán Hờn 113A cảm ơn quý khách! Chúc quý khách ngày mới nhiều năng lượng ạ.',
      date: '01/11/2026 09:40'
    }
  },
  {
    id: 'rev-dn-4',
    restaurantId: 'res-beman',
    restaurantName: 'Hải Sản Bé Mặn - Tươi Sống Biển Mỹ Khê',
    foodName: 'Mực Một Nắng Nướng Sa Tế',
    userId: 'usr-104',
    userName: 'Hoàng Minh Thu (Khách du lịch Hà Nội)',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Đi du lịch Đà Nẵng thèm hải sản mà ngại ra quán đông đúc nên đặt beFood giao tận khách sạn Novotel. Mực nướng sa tế thơm phức, cay the the, chấm muối tiêu chanh ớt xanh đúng bài miền Trung. Giao nhanh bất ngờ!',
    tags: ['Hải sản tươi sống', 'Giao tận khách sạn', 'Cay ngon đậm vị'],
    images: [
      'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&auto=format&fit=crop&q=80'
    ],
    orderCode: 'BE-DN-6621',
    likes: 31,
    isLiked: false,
    createdAt: '31/10/2026 21:10'
  },
  {
    id: 'rev-dn-5',
    restaurantId: 'res-chesaulien',
    restaurantName: 'Chè Sầu Liên Đà Nẵng - Hoàng Diệu',
    foodName: 'Chè Thái Sầu Riêng Cô Liên Bestseller',
    userId: 'usr-105',
    userName: 'Võ Mai Anh',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Múi sầu riêng tươi dày cơm, nước cốt dừa béo ngậy ngào ngạt hương thơm, thạch hạt lựu và mít thái giòn giòn ăn ghiền thực sự. Đặt 4 ly được quán tặng kèm đá lạnh và túi giữ nhiệt rất chu đáo.',
    tags: ['Sầu riêng ngập tràn', 'Béo ngậy thơm ngon', 'Có tặng kèm đá'],
    orderCode: 'BE-DN-5519',
    likes: 42,
    isLiked: true,
    createdAt: '31/10/2026 15:30'
  }
];
