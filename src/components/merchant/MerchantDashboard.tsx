import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodItem } from '../../types';
import { SidebarLayout, SidebarItem } from '../common/SidebarLayout';
import { Pagination } from '../common/Pagination';
import {
  Store,
  Power,
  Bell,
  Clock,
  CheckCircle,
  Plus,
  DollarSign,
  ShoppingBag,
  ChefHat,
  X,
  Search,
  Users,
  Package,
} from 'lucide-react';

export const MerchantDashboard: React.FC = () => {
  const {
    restaurants,
    orders,
    updateOrderStatus,
    toggleRestaurantOpen,
    toggleFoodAvailability,
    addFoodToMenu,
  } = useApp();

  const [selectedResId, setSelectedResId] = useState<string>(restaurants[0].id);
  const currentRestaurant = restaurants.find((r) => r.id === selectedResId) || restaurants[0];

  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'inventory' | 'staff' | 'revenue'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  // Add new food modal
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [foodCategory, setFoodCategory] = useState('Món đặc trưng');
  const [foodPrice, setFoodPrice] = useState('45000');
  const [foodDesc, setFoodDesc] = useState('');
  const [foodImage, setFoodImage] = useState(
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=80'
  );

  // Orders
  const resOrders = orders.filter((o) => o.restaurantId === currentRestaurant.id);
  const pendingOrders = resOrders.filter((o) => o.orderStatus === 'PENDING');
  const preparingOrders = resOrders.filter(
    (o) => o.orderStatus === 'CONFIRMED' || o.orderStatus === 'PREPARING'
  );
  const completedOrders = resOrders.filter((o) => o.orderStatus === 'COMPLETED');

  // Revenue
  const todayRevenue = resOrders
    .filter((o) => o.orderStatus !== 'CANCELLED')
    .reduce((sum, o) => sum + o.subtotal, 0);

  // Filtered menu
  const filteredMenu = currentRestaurant.menu.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const pagedMenu = filteredMenu.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const sidebarItems: SidebarItem[] = [
    { id: 'orders', label: 'Hàng đợi đơn món', icon: <ShoppingBag className="w-4 h-4" />, badge: pendingOrders.length },
    { id: 'menu', label: 'Quản lý thực đơn', icon: <ChefHat className="w-4 h-4" />, badge: currentRestaurant.menu.length },
    { id: 'inventory', label: 'Kho & Nguyên liệu', icon: <Package className="w-4 h-4" /> },
    { id: 'staff', label: 'Nhân viên quán', icon: <Users className="w-4 h-4" /> },
    { id: 'revenue', label: 'Báo cáo doanh thu', icon: <DollarSign className="w-4 h-4" /> },
  ];

  const handleCreateFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim() || !foodPrice) return;

    const newFood: FoodItem = {
      id: `f-${Date.now()}`,
      restaurantId: currentRestaurant.id,
      name: foodName.trim(),
      description: foodDesc.trim() || 'Món ăn thơm ngon chuẩn vị beFood.',
      price: parseInt(foodPrice, 10),
      image: foodImage,
      category: foodCategory,
      isAvailable: true,
      soldCount: 0,
      likesCount: 0,
      sizes: [
        { id: 'sz-1', name: 'Tiêu chuẩn', priceDiff: 0 },
        { id: 'sz-2', name: 'Cỡ Lớn', priceDiff: 10000 },
      ],
      toppings: [{ id: 'tp-1', name: 'Thêm trân châu', price: 8000 }],
    };

    addFoodToMenu(currentRestaurant.id, newFood);
    setIsAddFoodOpen(false);
    setFoodName('');
    setFoodDesc('');
  };

  return (
    <SidebarLayout
      title={currentRestaurant.name}
      subtitle={currentRestaurant.address}
      roleBadge="beMerchant"
      items={sidebarItems}
      activeItemId={activeTab}
      onSelectItem={(id) => {
        setActiveTab(id as typeof activeTab);
        setCurrentPage(1);
        setSearchQuery('');
      }}
      headerActions={
        <div className="flex items-center space-x-2">
          <select
            value={selectedResId}
            onChange={(e) => setSelectedResId(e.target.value)}
            className="text-xs bg-slate-100 border border-slate-300 rounded-xl px-2.5 py-1.5 font-bold outline-none cursor-pointer"
          >
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => toggleRestaurantOpen(currentRestaurant.id)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentRestaurant.isOpen
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{currentRestaurant.isOpen ? 'Đang nhận đơn' : 'Tạm tắt'}</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">Doanh thu hôm nay</span>
            <div className="text-2xl font-black text-slate-900">
              {todayRevenue.toLocaleString('vi-VN')}đ
            </div>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">
              ↑ 14% so với hôm qua
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">Đơn chờ nhận</span>
            <div className="text-2xl font-black text-amber-600">{pendingOrders.length}</div>
            <span className="text-[11px] text-slate-400 mt-1 inline-block">Cần xác nhận ngay</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">Đang chế biến</span>
            <div className="text-2xl font-black text-blue-600">{preparingOrders.length}</div>
            <span className="text-[11px] text-slate-400 mt-1 inline-block">Bếp đang nấu</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">Đã hoàn thành</span>
            <div className="text-2xl font-black text-purple-600">{completedOrders.length}</div>
            <span className="text-[11px] text-slate-400 mt-1 inline-block">Hôm nay</span>
          </div>
        </div>

        {/* Tab 1: Orders Queue */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900">
                Đơn hàng cần xử lý ({resOrders.length} đơn)
              </h3>
            </div>

            {resOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <ShoppingBag className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800 text-sm">Chưa có đơn hàng nào</h4>
                <p className="text-xs text-slate-400 mt-1">Đơn mới sẽ tự động hiển thị tại đây.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-black text-slate-900 text-sm">{order.orderCode}</span>
                        <p className="text-[11px] text-slate-400">
                          {order.createdAt} • Khách: {order.userName} ({order.userPhone})
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                          order.orderStatus === 'PENDING'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : order.orderStatus === 'PREPARING'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>

                    {order.customerNote && (
                      <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
                        📌 Ghi chú: "{order.customerNote}"
                      </div>
                    )}

                    <div className="space-y-1.5 border-t border-slate-100 pt-3 text-xs">
                      {order.items.map((it) => (
                        <div key={it.cartItemId} className="flex justify-between items-start">
                          <div>
                            <span className="font-extrabold text-slate-900">{it.quantity}x</span>{' '}
                            <span className="font-bold text-slate-800">{it.food.name}</span>
                            {it.options.size && (
                              <span className="text-slate-500"> ({it.options.size.name})</span>
                            )}
                          </div>
                          <span className="font-bold text-slate-900">
                            {it.totalPrice.toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400">Tiền quán nhận:</span>
                        <div className="font-black text-sm text-slate-900">
                          {order.subtotal.toLocaleString('vi-VN')}đ
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        {order.orderStatus === 'PENDING' && (
                          <button
                            onClick={() => {
                              updateOrderStatus(order.id, 'CONFIRMED', 'Quán đã nhận đơn & chuẩn bị nấu');
                            }}
                            className="px-3.5 py-1.5 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
                          >
                            Xác nhận nhận đơn
                          </button>
                        )}

                        {order.orderStatus === 'CONFIRMED' && (
                          <button
                            onClick={() => {
                              updateOrderStatus(order.id, 'PREPARING', 'Bếp đang nấu món');
                            }}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
                          >
                            Bắt đầu nấu món
                          </button>
                        )}

                        {order.orderStatus === 'PREPARING' && (
                          <button
                            onClick={() => {
                              updateOrderStatus(
                                order.id,
                                'DELIVERING',
                                'Món đã nấu xong & bàn giao cho tài xế beFood'
                              );
                            }}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
                          >
                            Bàn giao tài xế 🛵
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Menu Items Manager with Search & Pagination */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm món ăn trong thực đơn..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <button
                onClick={() => setIsAddFoodOpen(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm món mới</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pagedMenu.map((food) => (
                <div
                  key={food.id}
                  className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    />
                    <div className="truncate">
                      <h4 className="font-bold text-slate-900 text-xs truncate">{food.name}</h4>
                      <span className="text-[11px] text-slate-400">{food.category}</span>
                      <div className="text-sm font-black text-slate-900 mt-0.5">
                        {food.price.toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => toggleFoodAvailability(currentRestaurant.id, food.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                        food.isAvailable
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      }`}
                    >
                      {food.isAvailable ? 'Còn hàng' : 'Hết món'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredMenu.length / pageSize) || 1}
              onPageChange={setCurrentPage}
              totalItems={filteredMenu.length}
              pageSize={pageSize}
            />
          </div>
        )}

        {/* Tab 3: Inventory */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3 text-xs">
            <h3 className="font-extrabold text-sm text-slate-900">Quản lý kho nguyên vật liệu</h3>
            <p className="text-slate-500">
              Kiểm soát lượng nguyên liệu trà, sữa, cốt lết sườn, hộp giấy sinh thái beFood.
            </p>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 font-medium">
              ✓ Toàn bộ 12 danh mục nguyên liệu đạt mức an toàn trên 80% trữ lượng.
            </div>
          </div>
        )}

        {/* Tab 4: Staff */}
        {activeTab === 'staff' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3 text-xs">
            <h3 className="font-extrabold text-sm text-slate-900">Danh sách nhân viên nhà hàng</h3>
            <p className="text-slate-500">Phân quyền nhân viên pha chế, thu ngân và bếp trưởng.</p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              • Quản lý: Lê Văn Trưởng (Toàn quyền) • Nhân viên: 4 nhân sự đang hoạt động ca sáng.
            </div>
          </div>
        )}

        {/* Tab 5: Revenue */}
        {activeTab === 'revenue' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3 text-xs">
            <h3 className="font-extrabold text-sm text-slate-900">Báo cáo & Đối soát doanh thu</h3>
            <div className="text-2xl font-black text-emerald-600">
              {todayRevenue.toLocaleString('vi-VN')}đ
            </div>
            <p className="text-slate-500">Số tiền sẽ được tự động kết toán vào tài khoản ngân hàng quán sau mỗi 24 giờ.</p>
          </div>
        )}
      </div>

      {/* Add Food Modal */}
      {isAddFoodOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-sm">Thêm món mới vào thực đơn</h3>
              <button
                onClick={() => setIsAddFoodOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFood} className="p-6 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên món ăn / đồ uống *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Cơm tấm sườn bì trứng ốp la"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Danh mục *</label>
                  <input
                    type="text"
                    value={foodCategory}
                    onChange={(e) => setFoodCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Giá bán (VND) *</label>
                  <input
                    type="number"
                    value={foodPrice}
                    onChange={(e) => setFoodPrice(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mô tả món</label>
                <textarea
                  value={foodDesc}
                  onChange={(e) => setFoodDesc(e.target.value)}
                  placeholder="Mô tả nguyên liệu, hương vị hấp dẫn..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 h-18 resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hình ảnh món (URL)</label>
                <input
                  type="url"
                  value={foodImage}
                  onChange={(e) => setFoodImage(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddFoodOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl shadow-xs"
                >
                  Thêm món ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
};
