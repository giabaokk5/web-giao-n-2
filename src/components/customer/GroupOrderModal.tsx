import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GroupOrderMember, CartItem } from '../../types';
import {
  Users,
  Copy,
  Check,
  X,
  Plus,
  Share2,
  DollarSign,
  Calculator,
  UserCheck,
  ShoppingBag,
} from 'lucide-react';

interface GroupOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GroupOrderModal: React.FC<GroupOrderModalProps> = ({ isOpen, onClose }) => {
  const { cart, cartRestaurant, cartTotal, deliveryFee, showToast } = useApp();

  const [copied, setCopied] = useState(false);
  const [members, setMembers] = useState<GroupOrderMember[]>([
    {
      id: 'm-1',
      name: 'Trần Minh Quang (Trưởng nhóm)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      isHost: true,
      itemsTotal: 135000,
    },
    {
      id: 'm-2',
      name: 'Nguyễn Lan Anh (Phòng Marketing)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      isHost: false,
      itemsTotal: 85000,
    },
    {
      id: 'm-3',
      name: 'Lê Hoàng Nam (Phòng Kỹ thuật)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      isHost: false,
      itemsTotal: 115000,
    },
  ]);

  if (!isOpen) return null;

  const groupLink = 'https://food.be.com.vn/group/BE-GRP-8921';
  const totalFoodCost = members.reduce((sum, m) => sum + m.itemsTotal, 0);
  const sharedFeePerPerson = Math.round(deliveryFee / members.length);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(groupLink);
    setCopied(true);
    showToast('Đã sao chép link đặt món nhóm vào bộ nhớ tạm!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#00204A] to-[#0A2E66] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#FFC700] text-slate-950 rounded-2xl shadow-md">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
                  Mã phòng: GRP-8921
                </span>
                <span className="text-xs text-slate-300">• {members.length} thành viên</span>
              </div>
              <h3 className="font-extrabold text-base text-white mt-0.5">
                Đặt món theo nhóm & Tự động chia tiền
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Share Link Banner */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
            <span className="font-bold text-amber-950 block">
              Gửi liên kết cho đồng nghiệp cùng chọn món:
            </span>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={groupLink}
                className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 select-all outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1 shadow-xs cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>
            <p className="text-[11px] text-amber-800">
              * Mọi người cùng thêm món vào chung 1 đơn, tiết kiệm tối đa phí ship và dễ đối soát tiền mặt/chuyển khoản.
            </p>
          </div>

          {/* Members Breakdown & Auto Bill Split */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-amber-500" />
                Bảng tính chia tiền chi tiết từng thành viên
              </h4>
            </div>

            <div className="space-y-2.5">
              {members.map((member) => {
                const memberTotal = member.itemsTotal + sharedFeePerPerson;
                return (
                  <div
                    key={member.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-slate-900 text-xs">{member.name}</span>
                          {member.isHost && (
                            <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-md">
                              Chủ phòng
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Tiền món: {member.itemsTotal.toLocaleString('vi-VN')}đ + Ship:{' '}
                          {sharedFeePerPerson.toLocaleString('vi-VN')}đ
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Cần thanh toán:</span>
                      <span className="font-black text-slate-950 text-sm">
                        {memberTotal.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Group Totals */}
          <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Tổng tiền món nhóm ({members.length} người):</span>
              <span className="font-bold text-slate-900">{totalFoodCost.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Phí ship chia đều ({members.length} người):</span>
              <span className="font-bold text-slate-900">{deliveryFee.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="pt-2 border-t border-slate-300 flex justify-between items-center text-sm">
              <span className="font-black text-slate-900">Tổng thanh toán cả nhóm:</span>
              <span className="font-black text-rose-600 text-base">
                {(totalFoodCost + deliveryFee).toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              showToast('Đã gửi thông báo nhắc nhở chuyển khoản tới các thành viên', 'info');
              onClose();
            }}
            className="flex-1 py-3 px-4 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
          >
            Chốt đơn nhóm & Tiến hành đặt món
          </button>
        </div>
      </div>
    </div>
  );
};

