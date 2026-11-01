import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SidebarLayout, SidebarItem } from '../common/SidebarLayout';
import {
  Users,
  Clock,
  CalendarCheck,
  Award,
  Plus,
  CheckCircle2,
  AlertCircle,
  Building2,
  Search,
  Filter,
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  phone: string;
  role: 'Bếp Trưởng' | 'Phụ Bếp' | 'Thu Ngân' | 'Quản Lý Ca';
  branch: string;
  shift: 'Ca Sáng (06:00 - 14:00)' | 'Ca Chiều (14:00 - 22:00)' | 'Ca Tối (18:00 - 23:00)';
  status: 'PRESENT' | 'LATE' | 'OFF';
  checkInTime: string;
  rating: number;
}

const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'emp-1', name: 'Lê Văn Tài', phone: '0905 112 233', role: 'Bếp Trưởng', branch: 'Bà Mua - Nguyễn Tri Phương', shift: 'Ca Sáng (06:00 - 14:00)', status: 'PRESENT', checkInTime: '05:50', rating: 4.98 },
  { id: 'emp-2', name: 'Nguyễn Thị Hồng', phone: '0914 223 344', role: 'Thu Ngân', branch: 'Bà Mua - Nguyễn Tri Phương', shift: 'Ca Sáng (06:00 - 14:00)', status: 'PRESENT', checkInTime: '05:55', rating: 4.92 },
  { id: 'emp-3', name: 'Trần Đình Nam', phone: '0935 334 455', role: 'Phụ Bếp', branch: 'Bà Mua - Nguyễn Tri Phương', shift: 'Ca Sáng (06:00 - 14:00)', status: 'LATE', checkInTime: '06:15', rating: 4.75 },
  { id: 'emp-4', name: 'Phạm Thị Mai', phone: '0977 445 566', role: 'Quản Lý Ca', branch: 'Đặc Sản Trần - Lê Duẩn', shift: 'Ca Chiều (14:00 - 22:00)', status: 'PRESENT', checkInTime: '13:45', rating: 4.95 },
  { id: 'emp-5', name: 'Hoàng Minh Tuấn', phone: '0903 556 677', role: 'Bếp Trưởng', branch: 'Hải Sản Bé Mặn - Mỹ Khê', shift: 'Ca Chiều (14:00 - 22:00)', status: 'PRESENT', checkInTime: '13:50', rating: 4.99 },
  { id: 'emp-6', name: 'Vũ Thùy Linh', phone: '0988 667 788', role: 'Thu Ngân', branch: 'Chè Sầu Liên - Hoàng Diệu', shift: 'Ca Tối (18:00 - 23:00)', status: 'OFF', checkInTime: '--:--', rating: 4.88 },
];

export const HRDashboard: React.FC = () => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'employees' | 'shifts' | 'kpis'>('employees');
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [searchQuery, setSearchQuery] = useState('');

  const sidebarItems: SidebarItem[] = [
    { id: 'employees', label: 'Danh sách nhân viên F&B', icon: <Users className="w-4 h-4" />, badge: employees.length },
    { id: 'shifts', label: 'Bảng phân ca & Chấm công', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'kpis', label: 'Đánh giá KPIs & Hiệu suất', icon: <Award className="w-4 h-4" /> },
  ];

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SidebarLayout
      title="Phân Hệ Quản Trị Nhân Sự & Chấm Công (HR & Shift)"
      subtitle="Quản lý nhân viên chi nhánh, chấm công điện tử và theo dõi KPIs bếp tại TP. Đà Nẵng"
      roleBadge="beHR Manager"
      items={sidebarItems}
      activeItemId={activeTab}
      onSelectItem={(id) => setActiveTab(id as typeof activeTab)}
    >
      <div className="space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">Tổng nhân viên</span>
            <div className="text-xl font-black text-slate-900">{employees.length} nhân sự</div>
            <span className="text-[10px] text-emerald-600 font-bold">100% hợp đồng chính thức</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">Đang trong ca làm</span>
            <div className="text-xl font-black text-amber-600">
              {employees.filter((e) => e.status === 'PRESENT').length} nhân viên
            </div>
            <span className="text-[10px] text-slate-400">Trực ca sáng & chiều</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">Tỷ lệ đúng giờ</span>
            <div className="text-xl font-black text-blue-600">94.8%</div>
            <span className="text-[10px] text-emerald-600 font-bold">Chấm công GPS chi nhánh</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">Điểm đánh giá bếp</span>
            <div className="text-xl font-black text-purple-600">4.91 ⭐</div>
            <span className="text-[10px] text-purple-600 font-bold">Dựa trên 1.200 món chế biến</span>
          </div>
        </div>

        {/* Tab 1: Employee List */}
        {activeTab === 'employees' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm nhân viên theo tên, chi nhánh, chức vụ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <button
                onClick={() => showToast('Mở form tiếp nhận nhân sự mới vào chuỗi chi nhánh', 'info')}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-2xl shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Nhân Viên</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Họ và tên</th>
                      <th className="p-4">Số điện thoại</th>
                      <th className="p-4">Chức danh</th>
                      <th className="p-4">Chi nhánh Đà Nẵng</th>
                      <th className="p-4">Ca đăng ký</th>
                      <th className="p-4">Chấm công</th>
                      <th className="p-4">Đánh giá</th>
                      <th className="p-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-900">{emp.name}</td>
                        <td className="p-4 text-slate-500">{emp.phone}</td>
                        <td className="p-4">
                          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
                            {emp.role}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600 font-medium">{emp.branch}</td>
                        <td className="p-4 text-slate-500 text-[11px]">{emp.shift}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              emp.status === 'PRESENT'
                                ? 'bg-emerald-100 text-emerald-800'
                                : emp.status === 'LATE'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {emp.status === 'PRESENT'
                              ? `Đúng giờ (${emp.checkInTime})`
                              : emp.status === 'LATE'
                              ? `Đi muộn (${emp.checkInTime})`
                              : 'Nghỉ ca'}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-amber-600">⭐ {emp.rating}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => showToast(`Cập nhật lịch làm việc cho ${emp.name}`, 'info')}
                            className="text-xs px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-xl cursor-pointer"
                          >
                            Đổi ca
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Shifts & Schedule */}
        {activeTab === 'shifts' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900">
              Khung Giờ Phân Ca Tiêu Chuẩn Tại Chuỗi Ẩm Thực Đà Nẵng
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="font-bold text-xs text-amber-900">Ca Sáng (06:00 - 14:00)</div>
                <div className="text-xl font-black text-amber-950 mt-1">Chuẩn bị & Ăn sáng / trưa</div>
                <p className="text-[11px] text-amber-800 mt-2">
                  Trọng tâm: Nấu nước lèo Mì Quảng Bà Mua, Bún chả cá Hờn, tiếp nhận rau búp chuối tươi sáng sớm.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                <div className="font-bold text-xs text-blue-900">Ca Chiều (14:00 - 22:00)</div>
                <div className="text-xl font-black text-blue-950 mt-1">Cao điểm ăn xế & cơm tối</div>
                <p className="text-[11px] text-blue-800 mt-2">
                  Trọng tâm: Chè Sầu Liên, Bánh tráng thịt heo 2 đầu da Trần, Hải sản Bé Mặn ven biển Mỹ Khê.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                <div className="font-bold text-xs text-purple-900">Ca Đêm (18:00 - 23:30)</div>
                <div className="text-xl font-black text-purple-950 mt-1">Ẩm thực đêm & Du lịch Cầu Rồng</div>
                <p className="text-[11px] text-purple-800 mt-2">
                  Trọng tâm: Phục vụ khách xem Cầu Rồng phun lửa, phố đi bộ Bạch Đằng và chợ đêm Sơn Trà.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: KPIs */}
        {activeTab === 'kpis' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900">
              Chỉ Số Đánh Giá Hiệu Suất Nhân Viên Bếp (Kitchen Performance Index)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="font-bold text-slate-800">⏱️ Thời gian chế biến trung bình (Ticket to Prep)</div>
                <div className="text-2xl font-black text-emerald-600">7.2 phút / món</div>
                <p className="text-[11px] text-slate-500">Mục tiêu: Dưới 10 phút. Đạt chuẩn 96% đơn hàng.</p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="font-bold text-slate-800">🎯 Tỷ lệ chính xác định lượng món</div>
                <div className="text-2xl font-black text-blue-600">99.4%</div>
                <p className="text-[11px] text-slate-500">Được kiểm tra qua cân điện tử tích hợp KDS.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

