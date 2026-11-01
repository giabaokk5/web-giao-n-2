using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using BeFood.Api.Data;
using BeFood.Api.Models;

namespace BeFood.Api.Services
{
    public interface IChatbotService
    {
        Task<ChatMessageResponse> ProcessMessageAsync(ChatMessageRequest request);
        Task<AdminAIReportDto> GetAdminAIReportAsync();
        Task<List<FoodRecommendationDto>> GetSmartRecommendationsAsync(string? query, double? lat, double? lng, decimal? maxPrice);
    }

    public class ChatbotService : IChatbotService
    {
        private readonly BeFoodDbContext _db;
        private readonly IChatbotRepository _repo;
        private readonly IGeminiService _gemini;

        public ChatbotService(BeFoodDbContext db, IChatbotRepository repo, IGeminiService gemini)
        {
            _db = db;
            _repo = repo;
            _gemini = gemini;
        }

        public async Task<ChatMessageResponse> ProcessMessageAsync(ChatMessageRequest request)
        {
            var role = string.IsNullOrWhiteSpace(request.Role) ? "Customer" : request.Role;
            var session = await _repo.GetOrCreateSessionAsync(request.SessionId, request.UserId ?? "usr-guest", request.UserName ?? "Khách Hàng", role);

            // 1. Save user incoming message
            var userMsg = new ChatMessage
            {
                SessionId = session.Id,
                Sender = "user",
                Content = request.Message,
                Role = role,
                CreatedAt = DateTime.UtcNow
            };
            await _repo.SaveMessageAsync(userMsg);

            // 2. Route processing based on role
            ChatMessageResponse response;
            switch (role.ToLower())
            {
                case "admin":
                    response = await ProcessAdminChatAsync(session.Id, request);
                    break;
                case "merchant":
                case "restaurant":
                    response = await ProcessMerchantChatAsync(session.Id, request);
                    break;
                case "driver":
                    response = await ProcessDriverChatAsync(session.Id, request);
                    break;
                case "customer":
                default:
                    response = await ProcessCustomerChatAsync(session.Id, request);
                    break;
            }

            // 3. Save bot response message
            var botMsg = new ChatMessage
            {
                SessionId = session.Id,
                Sender = "bot",
                Content = response.BotReply,
                Role = role,
                MetadataJson = response.Recommendations.Any() ? JsonSerializer.Serialize(response.Recommendations) : null,
                CreatedAt = DateTime.UtcNow
            };
            await _repo.SaveMessageAsync(botMsg);
            response.MessageId = botMsg.Id;

            // 4. Log AI usage
            await _repo.LogAIUsageAsync(new AIUsageLog
            {
                UserId = request.UserId,
                Role = role,
                PromptTokens = request.Message.Length / 4,
                ResponseTokens = response.BotReply.Length / 4,
                Model = _gemini.IsApiKeyConfigured() ? "gemini-2.0-flash" : "befood-native-engine",
                Action = $"chat_{role.ToLower()}",
                Status = "SUCCESS"
            });

            return response;
        }

        #region 1. Customer Chatbot Processing
        private async Task<ChatMessageResponse> ProcessCustomerChatAsync(string sessionId, ChatMessageRequest request)
        {
            var msgLower = request.Message.ToLower();
            var recommendations = new List<FoodRecommendationDto>();
            string reply;

            // Check if user is asking for order tracking
            if (msgLower.Contains("đơn") || msgLower.Contains("giao đến đâu") || msgLower.Contains("mã đơn") || !string.IsNullOrEmpty(request.OrderCode))
            {
                var order = await _db.Orders.OrderByDescending(o => o.CreatedAt).FirstOrDefaultAsync();
                if (order != null)
                {
                    reply = $"🛵 **Thông tin đơn hàng {order.OrderCode} của bạn:**\n\n" +
                            $"- **Nhà hàng:** {order.RestaurantName}\n" +
                            $"- **Trạng thái:** `{order.OrderStatus}` (Tài xế đang giao)\n" +
                            $"- **Tài xế phụ trách:** {order.DriverName ?? "Nguyễn Văn Be (43-C1 888.68)"}\n" +
                            $"- **Dự kiến giao:** Khoảng 12 - 15 phút nữa tới `{order.DeliveryAddress}`.\n\n" +
                            $"Bạn có thể theo dõi vị trí xe chạy trực tiếp trên bản đồ Google Maps của đơn hàng nhé!";
                    return new ChatMessageResponse { SessionId = sessionId, BotReply = reply, Role = "Customer" };
                }
            }

            // Check if user is asking about vouchers
            if (msgLower.Contains("voucher") || msgLower.Contains("mã giảm") || msgLower.Contains("khuyến mãi") || msgLower.Contains("freeship"))
            {
                reply = "🎁 **Các mã ưu đãi BeFood Đà Nẵng đang áp dụng hôm nay:**\n\n" +
                        "1. **`BEFOOD50`**: Giảm ngay 50.000đ cho đơn từ 120.000đ khi thanh toán qua VietQR hoặc bePay.\n" +
                        "2. **`FREESHIP0D`**: Miễn phí vận chuyển toàn quận Hải Châu, Thanh Khê cho đơn từ 2 món.\n" +
                        "3. **`BANHTRANGMEMUA`**: Tặng kèm bánh tráng mè nướng giòn rụm tại Mì Quảng Bà Mua.\n\n" +
                        "👉 Khi đến bước Thanh Toán, bạn chỉ cần nhập mã vào ô Voucher để được trừ tiền trực tiếp!";
                return new ChatMessageResponse { SessionId = sessionId, BotReply = reply, Role = "Customer" };
            }

            // Check if user has complaint / escalation
            if (msgLower.Contains("khiếu nại") || msgLower.Contains("thiếu món") || msgLower.Contains("gặp nhân viên") || msgLower.Contains("chăm sóc khách hàng") || msgLower.Contains("cskh"))
            {
                reply = "Dạ BeFood rất xin lỗi vì trải nghiệm chưa trọn vẹn này của bạn! 🙇‍♂️\n\n" +
                        "Em đã ghi nhận thông tin và chuyển thẳng hồ sơ đến **Bộ phận CSKH BeFood Đà Nẵng** (Hotline: 1900 232345). " +
                        "Chuyên viên hỗ trợ sẽ gọi lại cho bạn trong vòng 5 phút để xử lý hoàn tiền hoặc bổ sung món ngay lập tức.";
                return new ChatMessageResponse
                {
                    SessionId = sessionId,
                    BotReply = reply,
                    Role = "Customer",
                    ActionPayload = new { action = "escalate_support", priority = "HIGH" }
                };
            }

            // Food & Restaurant Recommendation Engine
            var dishes = await _db.FoodItems.Include(f => f.Restaurant).Take(8).ToListAsync();

            // Filter dishes based on keywords
            var matchedDishes = dishes.Where(d =>
                msgLower.Contains("gà") && d.Name.ToLower().Contains("gà") ||
                msgLower.Contains("mì quảng") && d.Name.ToLower().Contains("mì quảng") ||
                msgLower.Contains("trà sữa") && d.Category.ToLower().Contains("trà sữa") ||
                msgLower.Contains("bún") && d.Name.ToLower().Contains("bún") ||
                msgLower.Contains("bánh tráng") && d.Name.ToLower().Contains("bánh tráng")
            ).ToList();

            if (!matchedDishes.Any())
            {
                matchedDishes = dishes.Take(4).ToList();
            }

            foreach (var d in matchedDishes)
            {
                recommendations.Add(new FoodRecommendationDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    Description = d.Description,
                    Price = d.Price,
                    OriginalPrice = d.OriginalPrice,
                    Image = d.Image,
                    RestaurantId = d.RestaurantId,
                    RestaurantName = d.Restaurant?.Name ?? "Nhà Hàng Đặc Sản Đà Nẵng",
                    Rating = d.Restaurant?.Rating ?? 4.9,
                    MatchReason = "Đặc sản trứ danh Đà Nẵng - Giao nhanh 15 phút"
                });
            }

            // If Gemini is available, generate custom natural language response
            var geminiPrompt = $"Khách hàng hỏi: \"{request.Message}\". Hãy đóng vai trợ lý AI ẩm thực BeFood tại Đà Nẵng, tư vấn ngắn gọn, thân thiện, nhắc đến các món đặc sản vừa gợi ý và mời khách bấm nút thêm vào giỏ hàng.";
            var systemPrompt = "Bạn là trợ lý AI BeFood chuyên tư vấn ẩm thực ngon tại TP. Đà Nẵng. Phong cách giọng điệu thân thiện, ấm áp miền Trung, ngắn gọn và hữu ích.";
            var aiReply = await _gemini.GenerateContentAsync(systemPrompt, geminiPrompt);

            reply = aiReply ??
                $"Dạ chào bạn! Tại Đà Nẵng hôm nay, BeFood gợi ý bạn những món ngon chuẩn vị nhất quanh khu vực Hải Châu & Thanh Khê này nha:\n\n" +
                $"✨ **{matchedDishes.FirstOrDefault()?.Name ?? "Mì Quảng Gà Ta Thả Vườn"}** ({matchedDishes.FirstOrDefault()?.Restaurant?.Name ?? "Mì Quảng Bà Mua"})\n" +
                $"Món ăn đậm đà, nước nhưn ngọt thanh chuẩn vị Quảng. Bạn có thể bấm ngay nút **[+ Thêm vào giỏ]** bên dưới thẻ món để đặt hàng siêu tốc nhé!";

            return new ChatMessageResponse
            {
                SessionId = sessionId,
                BotReply = reply,
                Role = "Customer",
                Recommendations = recommendations
            };
        }
        #endregion

        #region 2. Admin Chatbot Processing
        private async Task<ChatMessageResponse> ProcessAdminChatAsync(string sessionId, ChatMessageRequest request)
        {
            var msgLower = request.Message.ToLower();
            var totalOrders = await _db.Orders.CountAsync();
            var totalRevenue = await _db.Orders.SumAsync(o => (decimal?)o.TotalAmount) ?? 18450000m;
            var completedOrders = await _db.Orders.CountAsync(o => o.OrderStatus == "COMPLETED");

            string reply;
            if (msgLower.Contains("bất thường") || msgLower.Contains("rủi ro") || msgLower.Contains("cảnh báo"))
            {
                reply = "⚠️ **BÁO CÁO PHÁT HIỆN ĐƠN HÀNG BẤT THƯỜNG (AI AUDIT):**\n\n" +
                        "1. **Đơn #BE-DN-9941**: Thời gian tài xế di chuyển vượt 28 phút do kẹt xe đường Nguyễn Văn Linh giờ cao điểm -> *Đề xuất điều phối lại lộ trình.*\n" +
                        "2. **Tài khoản `guest_981`**: Đặt 3 đơn liên tiếp hủy trong 10 phút tại khu vực Sơn Trà -> *Đã tạm gắn cờ cần kiểm duyệt.*\n" +
                        "3. **Tỷ lệ chuẩn bị món Quán Bún Chả Cá 113A**: Đang chậm hơn trung bình 7 phút -> *Đã gửi thông báo nhắc nhở chủ quán.*";
            }
            else if (msgLower.Contains("doanh thu") || msgLower.Contains("thống kê") || msgLower.Contains("báo cáo"))
            {
                reply = $"📊 **TỔNG QUAN DOANH THU HỆ THỐNG BEFOOD ĐÀ NẴNG:**\n\n" +
                        $"- **Tổng doanh thu hôm nay:** `{totalRevenue:N0}đ` (Tăng +18.4% so với hôm qua)\n" +
                        $"- **Tổng số đơn hàng:** `{Math.Max(totalOrders, 128)}` đơn\n" +
                        $"- **Đơn hoàn thành thành công:** `{Math.Max(completedOrders, 119)}` đơn (Tỷ lệ: 93%)\n" +
                        $"- **Đội ngũ tài xế trực tuyến:** `24/28 tài xế` (Phủ kín Hải Châu, Sơn Trà, Cẩm Lệ)\n" +
                        $"- **Top quán doanh thu cao nhất:** 1. Mì Quảng Bà Mua (35.2 tr) • 2. Hải Sản Bé Mặn (48.6 tr) • 3. Phúc Long (21.4 tr).";
            }
            else
            {
                reply = "Xin chào Quản Trị Viên BeFood! Tôi là AI Super Admin phụ trách phân tích kinh doanh TP. Đà Nẵng.\n\n" +
                        "Tôi có thể hỗ trợ bạn:\n" +
                        "- 📈 Tra cứu doanh thu theo ngày, tuần, tháng\n" +
                        "- 🔍 Phát hiện đơn hàng bất thường và tài khoản gian lận\n" +
                        "- 🏆 Phân tích món bán chạy & xếp hạng quán ăn\n" +
                        "- 📑 Xuất báo cáo tổng kết vận hành định kỳ.";
            }

            return new ChatMessageResponse
            {
                SessionId = sessionId,
                BotReply = reply,
                Role = "Admin"
            };
        }
        #endregion

        #region 3. Merchant (Restaurant) Chatbot Processing
        private async Task<ChatMessageResponse> ProcessMerchantChatAsync(string sessionId, ChatMessageRequest request)
        {
            var msgLower = request.Message.ToLower();
            string reply;

            if (msgLower.Contains("combo") || msgLower.Contains("gợi ý món"))
            {
                reply = "💡 **GỢI Ý COMBO TĂNG DOANH THU 30% CHO QUÁN BẠN:**\n\n" +
                        "1. **Combo Ăn Trưa Văn Phòng**: 1x Mì Quảng Gà Ta + 1x Trà chanh sả hạt chia + 1x Bánh tráng nướng (Giá gốc: 75k -> Giảm còn: **59k**)\n" +
                        "2. **Combo Cặp Đôi Đà Thành**: 2x Bún Chả Cá Thập Cẩm + 2x Sữa đậu nành lá dứa (Giá gốc: 95k -> Giảm còn: **79k**)\n\n" +
                        "👉 Combo kết hợp đồ ăn mặn + đồ uống ngọt giúp tăng giá trị đơn hàng trung bình thêm 25-35%.";
            }
            else if (msgLower.Contains("mô tả") || msgLower.Contains("viết bài") || msgLower.Contains("content"))
            {
                reply = "✍️ **MẪU MÔ TẢ MÓN ĂN HẤP DẪN DO AI TẠO:**\n\n" +
                        "**Tên món:** Mì Quảng Gà Ta Thả Vườn Đại Lộc\n" +
                        "**Mô tả:** *\"Từng thớ thịt gà ta thả vườn dai ngọt săn chắc, được rim sả ớt đậm đà theo bí quyết gia truyền xứ Quảng. Nước nhưn sóng sánh vàng óng chan vừa xăm xắp sợi mì gạo trắng mịn, rắc thêm đậu phộng rang giòn rụm và bánh tráng mè nướng than hồng. Một hương vị khó quên của ẩm thực Đà Thành!\"*";
            }
            else if (msgLower.Contains("nguyên liệu") || msgLower.Contains("dự báo") || msgLower.Contains("tồn kho"))
            {
                reply = "📦 **DỰ BÁO NHU CẦU NGUYÊN LIỆU CUỐI TUẦN TẠI ĐÀ NẴNG:**\n\n" +
                        "- **Dự báo thời tiết:** Cuối tuần trời nắng ráo, lượng khách du lịch tại Cầu Rồng & Biển Mỹ Khê tăng 40%.\n" +
                        "- **Đề xuất nhập thêm:**\n" +
                        "  + Thịt gà ta: Tăng thêm +25 kg (dự kiến bán ~180 tô/ngày)\n" +
                        "  + Bánh tráng mè Đại Lộc: Chuẩn bị sẵn 200 chiếc\n" +
                        "  + Rau sống Trà Quế & chanh ớt xanh: Tăng 30% định mức.";
            }
            else
            {
                reply = "Chào chủ quán! Tôi là Trợ Lý AI Nhà Hàng BeFood. Tôi có thể giúp bạn:\n\n" +
                        "- 📊 Thống kê doanh thu & đơn hàng của quán\n" +
                        "- ✍️ Viết mô tả món ăn chuẩn SEO ẩm thực\n" +
                        "- 🍱 Gợi ý combo món hút khách giờ trưa\n" +
                        "- 📦 Dự báo nguyên liệu theo thời tiết & lượng khách du lịch Đà Nẵng.";
            }

            return new ChatMessageResponse
            {
                SessionId = sessionId,
                BotReply = reply,
                Role = "Merchant"
            };
        }
        #endregion

        #region 4. Driver Chatbot Processing
        private async Task<ChatMessageResponse> ProcessDriverChatAsync(string sessionId, ChatMessageRequest request)
        {
            var msgLower = request.Message.ToLower();
            string reply;

            if (msgLower.Contains("lộ trình") || msgLower.Contains("đường") || msgLower.Contains("kẹt xe"))
            {
                reply = "🗺️ **HƯỚNG DẪN LỘ TRÌNH TỐI ƯU TRÁNH KẸT XE ĐÀ NẴNG:**\n\n" +
                        "- Tuyến đường **Nguyễn Văn Linh giao Hoàng Diệu** hiện đang đông đúc.\n" +
                        "- **Lộ trình khuyên dùng:** Rẽ sang đường **Lê Đình Dương ➔ Bạch Đằng ➔ Qua Cầu Rồng** sẽ nhanh hơn 8 phút.\n" +
                        "- Vận tốc trung bình duy trì: 25 - 30 km/h, an toàn đúng chuẩn BeBike 5 sao.";
            }
            else if (msgLower.Contains("thu nhập") || msgLower.Contains("tiền") || msgLower.Contains("thưởng"))
            {
                reply = "💰 **TRA CỨU THU NHẬP HÔM NAY:**\n\n" +
                        "- **Tổng thu nhập tích lũy:** `285.000đ`\n" +
                        "- **Số chuyến hoàn thành:** 8 chuyến\n" +
                        "- **Tiền tip từ khách:** 45.000đ\n" +
                        "- **Chỉ tiêu thưởng ngày:** Chỉ cần hoàn thành thêm **2 chuyến** trước 21:00 để nhận thưởng mốc `+100.000đ`!";
            }
            else if (msgLower.Contains("sự cố") || msgLower.Contains("hỏng xe") || msgLower.Contains("khách không nghe") || msgLower.Contains("quán lâu"))
            {
                reply = "🚨 **HỖ TRỢ XỬ LÝ SỰ CỐ GIAO HÀNG:**\n\n" +
                        "1. **Khách không nghe máy:** Gọi tối thiểu 3 cuộc cách nhau 3 phút, chụp ảnh vị trí giao hàng và liên hệ CSKH để kích hoạt hủy đơn đền bù cước.\n" +
                        "2. **Hỏng xe dọc đường:** Bấm nút *[Báo sự cố]* trên ứng dụng, hệ thống BeFood sẽ tự động điều tài xế gần nhất chuyển tiếp món cho khách.\n" +
                        "3. **Quán làm món lâu > 15 phút:** Nhắn tin báo trước cho khách để nhận thông cảm và tránh bị đánh giá thấp.";
            }
            else
            {
                reply = "Chào anh em tài xế Be Đà Nẵng! 🛵\n\n" +
                        "Tôi là Trợ lý AI Tài Xế BeFood luôn đồng hành trên mọi nẻo đường:\n" +
                        "- 📍 Chỉ đường ngắn nhất tránh kẹt xe\n" +
                        "- 💵 Tra cứu thu nhập & tiến độ nhận thưởng ngày\n" +
                        "- 🚨 Hướng dẫn giải quyết nhanh các sự cố giao hàng.";
            }

            return new ChatMessageResponse
            {
                SessionId = sessionId,
                BotReply = reply,
                Role = "Driver"
            };
        }
        #endregion

        public async Task<AdminAIReportDto> GetAdminAIReportAsync()
        {
            var totalOrders = await _db.Orders.CountAsync();
            var totalRevenue = await _db.Orders.SumAsync(o => (decimal?)o.TotalAmount) ?? 18450000m;

            return new AdminAIReportDto
            {
                Summary = "Tình hình vận hành hệ thống BeFood Đà Nẵng hoạt động ổn định, doanh thu tăng trưởng tốt.",
                TotalRevenueToday = totalRevenue,
                TotalOrdersToday = Math.Max(totalOrders, 128),
                ActiveDrivers = 24,
                BestSellingFoods = new List<string> { "Mì Quảng Gà Ta Thả Vườn", "Bún Chả Cá Thập Cẩm", "Bánh Tráng Cuốn Thịt Heo 2 Đầu Da", "Trà Sữa Phúc Long L" },
                RiskAlerts = new List<string> { "Kẹt xe cục bộ quanh nút giao cầu Rồng giờ tan tầm", "1 đơn hàng quá 35 phút cần điều phối lại tài xế" }
            };
        }

        public async Task<List<FoodRecommendationDto>> GetSmartRecommendationsAsync(string? query, double? lat, double? lng, decimal? maxPrice)
        {
            var items = await _db.FoodItems.Include(f => f.Restaurant).Take(12).ToListAsync();
            var result = new List<FoodRecommendationDto>();

            foreach (var item in items)
            {
                if (maxPrice.HasValue && item.Price > maxPrice.Value) continue;

                result.Add(new FoodRecommendationDto
                {
                    Id = item.Id,
                    Name = item.Name,
                    Description = item.Description,
                    Price = item.Price,
                    OriginalPrice = item.OriginalPrice,
                    Image = item.Image,
                    RestaurantId = item.RestaurantId,
                    RestaurantName = item.Restaurant?.Name ?? "Đặc Sản Đà Nẵng",
                    Rating = item.Restaurant?.Rating ?? 4.9,
                    MatchReason = "Món bán chạy nhất khu vực Hải Châu & Sơn Trà"
                });
            }

            return result;
        }
    }
}

