# 🍲 GIA BẢO FOOD - HỆ THỐNG GIAO ĐỒ ĂN ĐÀ NẴNG HOÀN CHỈNH (FULL-STACK 12 PHÂN HỆ)

[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/UI-Tailwind%20CSS%20v4-38B2AC.svg)](https://tailwindcss.com/)
[![.NET 10](https://img.shields.io/badge/Backend-ASP.NET%20Core%20Web%20API-512BD4.svg)](https://dotnet.microsoft.com/)
[![Entity Framework](https://img.shields.io/badge/ORM-EF%20Core%20SQL%20Server-red.svg)](https://learn.microsoft.com/en-us/ef/core/)
[![SignalR](https://img.shields.io/badge/Realtime-SignalR%20WebSockets-green.svg)](https://dotnet.microsoft.com/apps/aspnet/signalr)
[![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini%20API-orange.svg)](https://ai.google.dev/)

> **Gia Bảo Food** là nền tảng thương mại điện tử giao đồ ăn trực tuyến chuyên nghiệp tại **Đà Nẵng**, phục vụ hơn 95+ món đặc sản nức tiếng Sông Hàn (Mì Quảng Bà Mua, Bánh tráng cuốn thịt heo Trần, Hải sản Bé Mặn, Bún chả cá Hờn, Chè Sầu Liên...).  
> Hệ thống được thiết kế theo kiến trúc chuẩn doanh nghiệp với đầy đủ **12 phân hệ tích hợp**, đồng bộ dữ liệu thời gian thực (Realtime SignalR) và trí tuệ nhân tạo Gemini AI.

---

## 📑 MỤC LỤC
1. [Kiến Trúc Công Nghệ](#-1-kiến-trúc-công-nghệ)
2. [Chi Tiết 12 Phân Hệ Hệ Thống (Giải Thích Dễ Hiểu)](#-2-chi-tiết-12-phân-hệ-hệ-thống-giải-thích-dễ-hiểu)
3. [Các Chức Năng Nổi Bật](#-3-các-chức-năng-nổi-bật)
4. [Hướng Dẫn Cài Đặt & Câu Lệnh Chạy](#-4-hướng-dẫn-cài-đặt--câu-lệnh-chạy)
5. [Cấu Trúc Thư Mục Dự Án](#-5-cấu-trúc-thư-mục-dự-án)
6. [Tài Khoản Đăng Nhập Demo](#-6-tài-khoản-đăng-nhập-demo)

---

## 🏗️ 1. Kiến Trúc Công Nghệ

| Lớp kiến trúc | Công nghệ sử dụng | Vai trò & Tính năng chính |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite | Xây dựng giao diện Single Page App (SPA) siêu tốc, phản hồi mượt mà |
| **Giao diện (UI)** | Tailwind CSS v4, Lucide React Icons | Thiết kế hiện đại, bảng màu chuẩn Vàng (`#FFC700`) & Xanh Navy (`#00204A`), responsive Desktop/Tablet/Mobile |
| **Bản đồ trực tuyến** | Leaflet + Google Maps Tiles | Bản đồ GPS định vị tài xế, tuyến đường Đà Nẵng, tính khoảng cách & thời gian giao |
| **Backend API** | C# ASP.NET Core Web API (.NET 10.0) | Hệ thống RESTful API chuẩn, xử lý nghiệp vụ, xác thực JWT, phân quyền RBAC |
| **Cơ sở dữ liệu** | SQL Server + Entity Framework Core | Lưu trữ Orders, Users, Restaurants, Menu, Reviews, Settlements, Audit Logs |
| **Truyền tin thời gian thực** | ASP.NET Core SignalR (`/hubs/order`) | Phát thông báo nổ đơn, cập nhật trạng thái đơn hàng và vị trí GPS tức thời |
| **Trí tuệ nhân tạo** | Google Gemini API (Proxy qua Backend) | Trợ lý Chatbot AI khách hàng, AI Business Analyst tra cứu doanh thu, dự báo đơn |
| **Biểu đồ thống kê** | Recharts Data Visualization | Biểu đồ doanh thu ngày/tuần/tháng, phân bổ đơn theo quận, phương thức thanh toán |

---

## 🌟 2. Chi Tiết 12 Phân Hệ Hệ Thống (Giải Thích Dễ Hiểu)

Thanh điều hướng trên cùng cho phép chuyển đổi tức thì giữa **12 phân hệ**:

```
[1. Khách hàng]  [2. Nhà hàng]  [3. Màn hình Bếp]  [4. Kho vận]     [5. Tài xế Be]  [6. CSKH]
[7. Tiếp thị]    [8. Kế toán]   [9. Quản trị]      [10. Gemini AI]  [11. Phân tích] [12. Nhân sự]
```

### 1. 👤 Phân Hệ Khách Hàng (Customer Portal)
- **Đặt món đặc sản Đà Nẵng**: Menu phong phú với hơn 95+ món ăn đặc sắc của Hải Châu, Sơn Trà, Thanh Khê, Ngũ Hành Sơn, Cẩm Lệ, Liên Chiểu.
- **Tùy biến món ăn (Customization Modal)**: Chọn kích cỡ (Size Nhỏ/Vừa/Lớn), thêm topping (trứng cút, chả cua, bánh tráng nướng...), chọn mức cay/đá/đường, ghi chú riêng cho đầu bếp.
- **Đặt đơn nhóm (Group Order)**: Tạo phòng gom đơn chung cùng đồng nghiệp cơ quan, chia tiền tự động, tạo link mời bạn bè.
- **So sánh giá (Price Comparison)**: So giá món ăn giữa các quán ngon gần bạn để chọn quán tiết kiệm nhất.
- **Tìm kiếm thông minh**: Tìm kiếm bằng văn bản, giọng nói (Voice Search) và hình ảnh (Visual Food Search).
- **Đánh giá & Bình luận sao (⭐ Reviews)**: Khách hàng chấm điểm 1-5 sao, gắn tag nhận xét, đính kèm ảnh món ăn thực tế và thả tim.
- **Theo dõi đơn hàng trực tiếp (Live Tracking)**: Xem tài xế chạy trên bản đồ Google Maps từ quán đến tận địa chỉ người nhận.

### 2. 🏪 Phân Hệ Nhà Hàng (Merchant Portal)
- **Chuông báo đơn mới tự động**: Âm thanh chuông báo sinh động qua Web Audio API khi có khách đặt.
- **Xử lý đơn theo luồng**: Tiếp nhận ➔ Xác nhận món ➔ Báo bếp chế biến ➔ Bàn giao cho tài xế.
- **Quản lý thực đơn**: Bật/tắt trạng thái Còn món / Tạm hết, chỉnh sửa giá bán và khuyến mãi của quán.
- **Báo cáo doanh số quán**: Xem số lượng đĩa bán ra trong ngày và doanh thu thực nhận sau trừ chiết khấu sàn.

### 3. 👨‍🍳 Màn hình Bếp (Kitchen Display System - KDS)
- Bảng điều phối dành riêng cho đầu bếp trong quầy bếp.
- Phân loại đơn: *Mới nhận*, *Đang nấu*, *Đã nấu xong chờ bàn giao*.
- Hiển thị chi tiết từng món cần nấu, số lượng và các lưu ý đặc biệt (*"cho ít cay", "nhiều rau sống"*).

### 4. 📦 Phân Hệ Kho Vận & Nguyên Liệu (Warehouse)
- Quản lý lượng tồn kho nguyên vật liệu tươi sống (thịt heo, tôm biển, rau Trà Quế, mắm nêm, sợi mì...).
- Tự động trừ kho theo định lượng món ăn khi đơn được chế biến.
- Cảnh báo hết hạn và nhắc nhở nhập thêm hàng khi lượng tồn dưới ngưỡng tối thiểu.

### 5. 🛵 Phân Hệ Tài Xế Be (Driver Dashboard)
- **Bật/Tắt chế độ nhận cuốc**: Chuyển trạng thái Sẵn sàng nhận đơn (Online) hoặc Nghỉ ngơi (Offline).
- **Đội xe nhiều tài xế**: Chọn và đổi nhanh giữa 5 tài xế Đà Nẵng (Nguyễn Văn Be, Lê Văn Hùng, Trần Đình Trọng...) kèm biển số chuẩn 43.
- **Bản đồ Google Maps GPS thời gian thực**: Xem hướng đi đường phố Đà Nẵng, khoảng cách (km) và thời gian dự kiến (phút).
- **Quy trình 4 bước giao hàng**: 
  1. *Bắt đầu di chuyển tới quán* 🛵
  2. *Đã đến quán - Chờ lấy món* 🏪
  3. *Đã nhận món - Đang giao khách* 🚀
  4. *Xác nhận ĐÃ GIAO THÀNH CÔNG* 🎉

### 6. 🎧 Phân Hệ Chăm Sóc Khách Hàng (Support & Tickets)
- Tiếp nhận và giải quyết khiếu nại của khách hàng (đồ ăn nguội, giao chậm, thiếu món).
- Hộp chat trực tiếp giữa nhân viên CSKH và khách hàng.
- Nút bồi thường nhanh 1-chạm: Hoàn tiền ngay vào ví bePay hoặc gửi voucher ưu đãi 30K/50K.

### 7. 📢 Phân Hệ Tiếp Thị & Voucher (Marketing Hub)
- Tạo và phát hành mã giảm giá (`GIABAO50`, `BEFOOD50`, `FREESHIP0D`, `DANANG35K`...).
- Thiết lập chương trình khuyến mãi giờ vàng (Flash Sale 10h30 - 13h30).
- Quản lý chính sách thăng hạng thành viên thân thiết VIP (BRONZE, SILVER, GOLD, DIAMOND).

### 8. 💵 Phân Hệ Kế Toán & Tài Chính (Accounting & Settlement)
- **Tự động đối soát chiết khấu sàn 18%**: Tính toán doanh thu gộp (GMV), khấu trừ 18% hoa hồng nền tảng và tính tiền thực chuyển cho nhà hàng.
- Quản lý lệnh chuyển khoản ngân hàng qua Vietcombank CN Đà Nẵng.
- Quản lý tiền thưởng cuốc xe và số dư ví thu nhập của tài xế.

### 9. 🛡️ Super Admin BeFood (40 Module Quản Trị Chuyên Sâu)
Hệ thống điều hành trung tâm với kiến trúc module hóa:
- **Live Command Center**: Bản đồ radar giám sát toàn bộ đơn hàng đang di chuyển khắp 6 quận Đà Nẵng, cảnh báo vùng nghẽn giao thông, bật/tắt thuật toán Smart Dispatch.
- **Customer 360**: Xem hồ sơ trọn đời khách hàng, tổng tiền chi tiêu, lịch sử đặt, chấm điểm gian lận AI Fraud Score, khóa/mở khóa tài khoản.
- **Quản lý đối soát & hoàn tiền (Finance Center)**: Phê duyệt quyết toán hàng tuần cho đối tác nhà hàng và phê duyệt hoàn tiền.
- **Giám sát hạ tầng & Sao lưu (System Infra Center)**: Đo lường độ trễ từng API Backend C# (ms), giám sát WebSocket SignalR, sao lưu cơ sở dữ liệu SQL Server an toàn 1-click.
- **Kiểm duyệt Đánh giá (Review Moderation)**: Duyệt, ẩn hoặc trả lời đánh giá của thực khách.
- **Nhật ký hệ thống (Audit Logs)**: Ghi lại chi tiết mọi hành vi quản trị viên kèm IP và thời gian để chống gian lận.

### 10. 🤖 Phân Hệ Gemini AI Assistant
- Tích hợp mô hình AI Gemini qua Backend an toàn, bảo vệ API Key.
- Khách hàng có thể chat nhờ AI gợi ý món theo khẩu vị, túi tiền (*"Tôi có 50k ở Hải Châu nên ăn gì ngon?"*).
- AI phân tích hình ảnh món ăn do người dùng tải lên để nhận diện món và tìm quán bán.

### 11. 📈 Phân Hệ Phân Tích & Machine Learning (Analytics)
- Dự báo nhu cầu đặt món theo khung giờ và điều kiện thời tiết tại Đà Nẵng.
- Thống kê tỷ lệ khách hàng quay lại (Retention Rate ~68.5%) và tỷ lệ giao đúng giờ (~98.2%).

### 12. 👥 Phân Hệ Quản Lý Nhân Sự (HR & Shifts)
- Phân ca làm việc cho nhân viên tổng đài CSKH, nhân sự vận hành kho và trực trạm điều phối.
- Bảng chấm công và thống kê hiệu suất làm việc của từng nhân viên.

---

## 🎯 3. Các Chức Năng Nổi Bật

1. **Duy trì đăng nhập vĩnh viễn**: Khắc phục hoàn toàn lỗi tự đăng xuất khi tải lại trang; phiên làm việc được lưu an toàn trong `localStorage`.
2. **Cổng Admin bảo mật riêng**: Tách biệt hoàn toàn cổng đăng nhập Quản trị viên điều hành với tài khoản khách hàng.
3. **Thanh toán VietQR động**: Tự động sinh mã VietQR chuẩn NAPAS kèm đúng số tiền và nội dung đơn hàng để khách chuyển khoản ngân hàng nhanh chóng.
4. **Bản đồ GPS Google Maps thật**: Không dùng ảnh tĩnh, sử dụng hệ thống bản đồ Leaflet tích hợp Google Maps Tiles chuẩn quốc tế.

---

## 🚀 4. Hướng Dẫn Cài Đặt & Câu Lệnh Chạy

### Yêu Cầu Cài Đặt Ban Đầu
- **Node.js**: Phiên bản 18.0 trở lên ([Tải tại đây](https://nodejs.org/))
- **.NET SDK**: Phiên bản .NET 10.0 ([Tải tại đây](https://dotnet.microsoft.com/download))
- **Trình duyệt**: Google Chrome, Edge hoặc Brave

---

### Bước 1: Khởi chạy Giao Diện (Frontend React)
Mở cửa sổ Terminal (PowerShell hoặc Command Prompt) tại thư mục dự án:

```powershell
# Di chuyển vào thư mục dự án
cd "d:\web đồ ăn"

# Cài đặt các thư viện (chỉ cần chạy lần đầu)
npm install

# Khởi chạy máy chủ phát triển
npm run dev
```

Sau khi chạy, giao diện sẽ xuất hiện tại địa chỉ:
👉 **`http://localhost:5173/`**

---

### Bước 2: Khởi chạy Máy Chủ Backend (C# ASP.NET Core API)
Mở một cửa sổ Terminal thứ hai:

```powershell
# Di chuyển vào thư mục backend
cd "d:\web đồ ăn\backend\BeFood.Api"

# Khôi phục và chạy dự án Backend
dotnet run
```

Backend API và SignalR Hub sẽ lắng nghe tại:
👉 **`http://localhost:5000/`** (Swagger: `http://localhost:5000/swagger`)

---

### Bước 3 (Tùy chọn): Cấu hình Google Gemini AI
Nếu muốn kích hoạt trí tuệ nhân tạo Gemini phản hồi trực tiếp:
1. Lấy miễn phí API Key tại: [Google AI Studio](https://aistudio.google.com/)
2. Mở file `backend/BeFood.Api/appsettings.json` và điền:
```json
{
  "Gemini": {
    "ApiKey": "DIEN_API_KEY_CUA_BAN_TAI_DAY"
  }
}
```

---

## 📂 5. Cấu Trúc Thư Mục Dự Án

```
d:\web đồ ăn\
├── backend/
│   └── BeFood.Api/
│       ├── Controllers/      # API Controllers (Admin, Orders, Restaurants, Reviews, Chatbot)
│       ├── Data/             # BeFoodDbContext & Cấu hình Entity Framework
│       ├── Hubs/             # SignalR OrderHub truyền tin thời gian thực
│       ├── Models/           # Entity C# & Data Transfer Objects (DTO)
│       ├── Services/         # GeminiService, ChatbotService, OrderService
│       └── Program.cs        # Điểm khởi động ứng dụng .NET 10
├── src/
│   ├── components/
│   │   ├── admin/            # Super Admin & các module Customer360, LiveCommand, Finance...
│   │   ├── chatbot/          # ChatbotWidget, ChatInput, FoodRecommendationCard...
│   │   ├── common/           # Header, Footer, RoleSwitchBanner, SidebarLayout, Toast...
│   │   ├── customer/         # CustomerHome, RestaurantDetailView, ReviewModal, VietQRModal...
│   │   ├── driver/           # DriverDashboard & GPS Navigation
│   │   ├── merchant/         # MerchantDashboard
│   │   ├── kitchen/          # KitchenDisplay (KDS)
│   │   └── warehouse/        # WarehouseDashboard
│   ├── context/
│   │   └── AppContext.tsx    # State trung tâm toàn hệ thống & lưu trữ localStorage
│   ├── data/
│   │   └── mockData.ts       # 95+ món ăn đặc sản Đà Nẵng, danh mục, voucher
│   ├── services/             # Client services (adminService, geminiService)
│   ├── types/                # Định nghĩa TypeScript Types & Interfaces
│   ├── App.tsx               # Component điều hướng chính 12 phân hệ
│   └── main.tsx              # Điểm khởi chạy React
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🔑 6. Tài Khoản Đăng Nhập Demo

Tại modal đăng nhập, bạn có thể **bấm 1-chạm** vào các nút demo để trải nghiệm ngay:

| Vai trò | Tài khoản | Mật khẩu mặc định | Ghi chú |
| :--- | :--- | :--- | :--- |
| **👑 Super Admin** | `admin@befood.vn` | `123456` | Toàn quyền kiểm soát 40 module sàn |
| **🏪 Chủ Quán Bếp Hoa** | `merchant@befood.vn` | `123456` | Quản lý nhà hàng, đơn hàng & thực đơn |
| **🛵 Tài Xế BeBike** | `driver@befood.vn` | `123456` | Nhận cuốc, theo dõi GPS, thu tiền |
| **🌟 Khách Hàng VIP** | `user@befood.vn` | `123456` | Đặt món, tích điểm bePoint, đổi voucher |

---

*Phát triển bởi đội ngũ **Gia Bảo Food Đà Nẵng** — 2026. Mọi quyền được bảo lưu.*
"# web-giao-n" 
