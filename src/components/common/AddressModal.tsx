import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Address, DaNangDistrict } from '../../types';
import { MapPin, Navigation, Plus, Check, X, Building, Home, Map, Sparkles } from 'lucide-react';

export const AddressModal: React.FC = () => {
  const {
    isAddressModalOpen,
    setIsAddressModalOpen,
    currentUser,
    currentAddress,
    setCurrentAddress,
    showToast,
  } = useApp();

  const [addresses, setAddresses] = useState<Address[]>(currentUser.addresses);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newWard, setNewWard] = useState('Vĩnh Trung');
  const [newDistrict, setNewDistrict] = useState<DaNangDistrict>('Hải Châu');

  if (!isAddressModalOpen) return null;

  const daNangDistricts: DaNangDistrict[] = [
    'Hải Châu',
    'Sơn Trà',
    'Ngũ Hành Sơn',
    'Thanh Khê',
    'Liên Chiểu',
    'Cẩm Lệ',
    'Hòa Vang',
  ];

  // Quick preset locations in Da Nang
  const daNangLandmarks = [
    {
      title: '🐉 Cầu Rồng & Sông Hàn',
      detail: 'Đuôi Cầu Rồng, 155 Nguyễn Văn Linh, Phường Vĩnh Trung',
      district: 'Hải Châu' as DaNangDistrict,
      ward: 'Vĩnh Trung',
      lat: 16.0601,
      lng: 108.2120,
    },
    {
      title: '🏖️ Biển Mỹ Khê (Võ Nguyên Giáp)',
      detail: 'Lô 11 Võ Nguyên Giáp, Phường Mân Thái',
      district: 'Sơn Trà' as DaNangDistrict,
      ward: 'Mân Thái',
      lat: 16.0792,
      lng: 108.2471,
    },
    {
      title: '✈️ Sân Bay Quốc Tế Đà Nẵng',
      detail: 'Nhà ga T1, Đường Duy Tân, Phường Hòa Thuận Tây',
      district: 'Hải Châu' as DaNangDistrict,
      ward: 'Hòa Thuận Tây',
      lat: 16.0538,
      lng: 108.2022,
    },
    {
      title: '🎓 Cụm ĐH Bách Khoa Đà Nẵng',
      detail: '54 Nguyễn Lương Bằng, Phường Hòa Khánh Bắc',
      district: 'Liên Chiểu' as DaNangDistrict,
      ward: 'Hòa Khánh Bắc',
      lat: 16.0748,
      lng: 108.1512,
    },
    {
      title: '🏮 Phố Tây An Thượng (Ngũ Hành Sơn)',
      detail: '12 An Thượng 26, Phường Mỹ An',
      district: 'Ngũ Hành Sơn' as DaNangDistrict,
      ward: 'Mỹ An',
      lat: 16.0495,
      lng: 108.2435,
    },
  ];

  const handleSelect = (addr: Address) => {
    setCurrentAddress(addr);
    showToast(`Đã chọn địa chỉ giao tại Đà Nẵng: ${addr.title}`, 'success');
    setIsAddressModalOpen(false);
  };

  const handleUseCurrentLocation = () => {
    const gpsAddress: Address = {
      id: `gps-${Date.now()}`,
      title: 'Vị trí hiện tại GPS (Hải Châu, Đà Nẵng)',
      detail: 'Số 02 Bạch Đằng, Phường Thạch Thang (Bờ Sông Hàn)',
      ward: 'Thạch Thang',
      district: 'Hải Châu',
      city: 'TP. Đà Nẵng',
      lat: 16.0752,
      lng: 108.2241,
    };
    setAddresses([gpsAddress, ...addresses]);
    setCurrentAddress(gpsAddress);
    showToast('Đã định vị vị trí hiện tại tại TP. Đà Nẵng qua GPS!', 'success');
    setIsAddressModalOpen(false);
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDetail.trim()) return;
    const addr: Address = {
      id: `addr-${Date.now()}`,
      title: newTitle.trim() || 'Địa chỉ mới Đà Nẵng',
      detail: newDetail.trim(),
      ward: newWard,
      district: newDistrict,
      city: 'TP. Đà Nẵng',
      lat: 16.06 + Math.random() * 0.02,
      lng: 108.21 + Math.random() * 0.02,
    };
    setAddresses([addr, ...addresses]);
    setCurrentAddress(addr);
    setIsAddingNew(false);
    showToast(`Đã thêm địa chỉ "${addr.title}" tại ${newDistrict}, Đà Nẵng`, 'success');
    setIsAddressModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#00204A] via-[#092B5A] to-[#00204A] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#FFC700] rounded-xl text-slate-900 shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-white text-base">Địa chỉ nhận món tại Đà Nẵng</h3>
                <span className="bg-[#FFC700] text-[#00204A] text-[10px] font-black px-1.5 py-0.2 rounded-md">
                  Đà Nẵng City
                </span>
              </div>
              <p className="text-xs text-slate-300">beFood sẽ tự động tính khoảng cách và phí ship từ quán gần nhất</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddressModalOpen(false)}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* GPS Button */}
          <button
            onClick={handleUseCurrentLocation}
            className="w-full flex items-center justify-between p-3.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl text-slate-900 font-semibold text-sm transition-all cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#FFC700] text-slate-950 rounded-xl group-hover:scale-110 transition-transform">
                <Navigation className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-slate-900 font-bold">Lấy vị trí hiện tại (GPS Đà Nẵng)</div>
                <div className="text-xs text-slate-500 font-normal">Tự động bắt tọa độ chính xác bán kính 50m</div>
              </div>
            </div>
            <span className="text-xs bg-white text-amber-900 font-bold px-2.5 py-1 rounded-full shadow-xs">
              Định vị
            </span>
          </button>

          {/* Quick Da Nang Landmarks Shortcuts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Địa điểm phổ biến tại Đà Nẵng
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {daNangLandmarks.map((lm, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const presetAddr: Address = {
                      id: `landmark-${idx}`,
                      title: lm.title,
                      detail: lm.detail,
                      ward: lm.ward,
                      district: lm.district,
                      city: 'TP. Đà Nẵng',
                      lat: lm.lat,
                      lng: lm.lng,
                    };
                    handleSelect(presetAddr);
                  }}
                  className="p-2.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-400 rounded-xl text-left transition-colors cursor-pointer"
                >
                  <div className="font-bold text-xs text-slate-900">{lm.title}</div>
                  <div className="text-[10px] text-slate-500 truncate">{lm.detail}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Da Nang Map Visual Simulation */}
          <div className="relative h-28 w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center">
            {/* Visual grid / river simulation */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-70"></div>
            {/* Sông Hàn simulation */}
            <div className="absolute top-0 bottom-0 left-1/2 w-4 bg-blue-200/80 -rotate-12"></div>
            {/* Cầu Rồng simulation */}
            <div className="absolute top-1/2 left-1/3 right-1/3 h-1.5 bg-amber-400 rounded-full shadow-sm"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="p-2 bg-rose-500 text-white rounded-full shadow-lg animate-bounce">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-800 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full shadow-xs mt-1 border border-slate-200 max-w-xs truncate">
                📍 {currentAddress.detail}, {currentAddress.district}, Đà Nẵng
              </span>
            </div>
          </div>

          {/* Saved Addresses list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Địa chỉ của bạn tại Đà Nẵng
              </span>
              {!isAddingNew && (
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm địa chỉ mới</span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              {addresses.map((addr) => {
                const isSelected = addr.id === currentAddress.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => handleSelect(addr)}
                    className={`flex items-start justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 bg-amber-50/50 shadow-xs ring-2 ring-amber-400/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`p-2 rounded-xl mt-0.5 ${
                          isSelected ? 'bg-[#FFC700] text-slate-900' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {addr.title.toLowerCase().includes('công ty') || addr.title.toLowerCase().includes('văn phòng') ? (
                          <Building className="w-4 h-4" />
                        ) : addr.title.toLowerCase().includes('nhà') ? (
                          <Home className="w-4 h-4" />
                        ) : (
                          <Map className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-slate-900">{addr.title}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{addr.detail}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {addr.ward}, {addr.district}, TP. Đà Nẵng
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="p-1 rounded-full bg-amber-500 text-white shadow-xs">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form add new address */}
          {isAddingNew && (
            <form onSubmit={handleAddNew} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 animate-in fade-in">
              <div className="font-bold text-xs text-slate-800">Thêm địa chỉ giao hàng mới tại Đà Nẵng</div>
              <div>
                <input
                  type="text"
                  placeholder="Tên gợi nhớ (Ví dụ: Khách sạn Mường Thanh, KTX Bách Khoa...)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Địa chỉ cụ thể (Số nhà, Tên đường...)"
                  value={newDetail}
                  onChange={(e) => setNewDetail(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Phường / Xã"
                  value={newWard}
                  onChange={(e) => setNewWard(e.target.value)}
                  className="text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none"
                  required
                />
                <select
                  value={newDistrict}
                  onChange={(e) => setNewDistrict(e.target.value as DaNangDistrict)}
                  className="text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none font-medium"
                >
                  {daNangDistricts.map((d) => (
                    <option key={d} value={d}>
                      Quận {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs bg-[#FFC700] text-slate-950 font-bold hover:bg-amber-400 shadow-xs cursor-pointer"
                >
                  Lưu & Chọn
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
