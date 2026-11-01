import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InventoryItem } from '../../types';
import { MOCK_INVENTORY_ITEMS } from '../../data/mockData';
import { SidebarLayout, SidebarItem } from '../common/SidebarLayout';
import { Pagination } from '../common/Pagination';
import {
  Package,
  AlertTriangle,
  Calendar,
  Truck,
  Plus,
  Search,
  CheckCircle2,
  TrendingDown,
  Layers,
  ArrowDownToLine,
  ArrowUpFromLine,
  X,
} from 'lucide-react';

export const WarehouseDashboard: React.FC = () => {
  const { showToast, playNotificationSound } = useApp();

  const [items, setItems] = useState<InventoryItem[]>(MOCK_INVENTORY_ITEMS);
  const [activeTab, setActiveTab] = useState<'ALL' | 'LOW_STOCK' | 'EXPIRING' | 'SUPPLIERS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Import stock modal
  const [selectedItemForImport, setSelectedItemForImport] = useState<InventoryItem | null>(null);
  const [importQty, setImportQty] = useState('50');

  const filteredItems = items.filter((it) => {
    if (activeTab === 'LOW_STOCK' && it.currentStock > it.minThreshold) return false;
    if (activeTab === 'EXPIRING' && !it.isExpiringSoon) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        it.ingredientName.toLowerCase().includes(q) ||
        it.category.toLowerCase().includes(q) ||
        it.supplier.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const pagedItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleImportStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForImport || !importQty) return;

    const added = parseInt(importQty, 10);
    setItems((prev) =>
      prev.map((it) =>
        it.id === selectedItemForImport.id
          ? { ...it, currentStock: it.currentStock + added, isExpiringSoon: false }
          : it
      )
    );
    playNotificationSound();
    showToast(`Đã nhập thêm ${added} ${selectedItemForImport.unit} "${selectedItemForImport.ingredientName}" vào kho thành công!`, 'success');
    setSelectedItemForImport(null);
  };

  const sidebarItems: SidebarItem[] = [
    { id: 'ALL', label: 'Tất cả nguyên liệu', icon: <Package className="w-4 h-4" />, badge: items.length },
    {
      id: 'LOW_STOCK',
      label: 'Cảnh báo sắp hết',
      icon: <TrendingDown className="w-4 h-4 text-amber-500" />,
      badge: items.filter((it) => it.currentStock <= it.minThreshold).length,
    },
    {
      id: 'EXPIRING',
      label: 'Sắp hết hạn sử dụng',
      icon: <AlertTriangle className="w-4 h-4 text-rose-500" />,
      badge: items.filter((it) => it.isExpiringSoon).length,
    },
    { id: 'SUPPLIERS', label: 'Nhà cung cấp', icon: <Truck className="w-4 h-4" /> },
  ];

  return (
    <SidebarLayout
      title="Quản Lý Kho & Nguyên Vật Liệu (beWarehouse)"
      subtitle="Kiểm soát định lượng món ăn, cảnh báo cận hạn và quản lý nhập xuất kho"
      roleBadge="beWarehouse"
      items={sidebarItems}
      activeItemId={activeTab}
      onSelectItem={(id) => {
        setActiveTab(id as typeof activeTab);
        setCurrentPage(1);
      }}
      headerActions={
        <button
          onClick={() => {
            if (items.length > 0) setSelectedItemForImport(items[0]);
          }}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs cursor-pointer"
        >
          <ArrowDownToLine className="w-4 h-4" />
          <span>Tạo phiếu nhập kho</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">Mặt hàng trong kho</span>
            <div className="text-2xl font-black text-slate-900">{items.length} mục</div>
            <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">100% định lượng</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">Cảnh báo dưới định mức</span>
            <div className="text-2xl font-black text-amber-600">
              {items.filter((it) => it.currentStock <= it.minThreshold).length} mục
            </div>
            <span className="text-[10px] text-amber-700 font-bold mt-1 inline-block">Cần đặt thêm</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">Cận hạn sử dụng (3 ngày)</span>
            <div className="text-2xl font-black text-rose-600">
              {items.filter((it) => it.isExpiringSoon).length} mục
            </div>
            <span className="text-[10px] text-rose-600 font-bold mt-1 inline-block">Cần ưu tiên chế biến</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">Tổng giá trị tồn kho</span>
            <div className="text-2xl font-black text-blue-600">42.8M</div>
            <span className="text-[10px] text-slate-400 mt-1 inline-block">Bếp Hoa & đối tác</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên nguyên liệu, loại hàng, nhà cung cấp..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Inventory Items Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">Nguyên vật liệu</th>
                  <th className="p-4">Danh mục</th>
                  <th className="p-4">Tồn kho hiện tại</th>
                  <th className="p-4">Định mức tối thiểu</th>
                  <th className="p-4">Hạn dùng</th>
                  <th className="p-4">Nhà cung cấp</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pagedItems.map((it) => {
                  const isLow = it.currentStock <= it.minThreshold;
                  return (
                    <tr key={it.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">
                        {it.ingredientName}
                        {it.isExpiringSoon && (
                          <span className="ml-2 bg-rose-100 text-rose-700 text-[10px] font-black px-1.5 py-0.2 rounded-md">
                            Cận hạn ⚠️
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-slate-500">{it.category}</td>
                      <td className="p-4 font-black text-slate-900">
                        <span className={isLow ? 'text-rose-600' : 'text-slate-900'}>
                          {it.currentStock} {it.unit}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 font-medium">
                        {it.minThreshold} {it.unit}
                      </td>
                      <td className="p-4 font-mono text-slate-600">{it.expiryDate}</td>
                      <td className="p-4 text-slate-600">{it.supplier}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedItemForImport(it)}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold rounded-xl text-xs cursor-pointer"
                        >
                          + Nhập thêm
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredItems.length}
              pageSize={pageSize}
            />
          </div>
        </div>
      </div>

      {/* Stock Import Modal */}
      {selectedItemForImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-100">
            <div className="px-6 py-4 bg-[#00204A] text-white flex items-center justify-between">
              <h3 className="font-extrabold text-sm">Nhập kho nguyên liệu</h3>
              <button
                onClick={() => setSelectedItemForImport(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleImportStock} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-400 text-[11px] block">Mặt hàng:</span>
                <div className="font-black text-sm text-slate-900">
                  {selectedItemForImport.ingredientName}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Tồn hiện tại: {selectedItemForImport.currentStock} {selectedItemForImport.unit} • NCC:{' '}
                  {selectedItemForImport.supplier}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Số lượng nhập thêm ({selectedItemForImport.unit}) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={importQty}
                  onChange={(e) => setImportQty(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 font-bold"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedItemForImport(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-xs"
                >
                  Xác nhận nhập kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
};

