using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using BeFood.Api.Data;
using BeFood.Api.Hubs;
using BeFood.Api.Models;
using BeFood.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add Controllers & SignalR
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddOpenApi();
builder.Services.AddHttpClient();

// Register Chatbot & AI Services
builder.Services.AddScoped<IGeminiService, GeminiService>();
builder.Services.AddScoped<IChatbotRepository, ChatbotRepository>();
builder.Services.AddScoped<IChatbotService, ChatbotService>();

// Database: SQL Server with fallback to InMemory
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (!string.IsNullOrEmpty(connectionString))
{
    builder.Services.AddDbContext<BeFoodDbContext>(options =>
        options.UseSqlServer(connectionString));
}
else
{
    builder.Services.AddDbContext<BeFoodDbContext>(options =>
        options.UseInMemoryDatabase("BeFoodDb"));
}

// CORS Policy for Vite Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowViteApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Seed initial restaurants if database is empty
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<BeFoodDbContext>();
    if (!db.Restaurants.Any())
    {
        var bamua = new Restaurant
        {
            Id = "res-bamuamiquang",
            Name = "Mì Quảng Bà Mua - Đặc Sản Đà Nẵng",
            Tagline = "Mì Quảng trứ danh xứ Quảng - Sợi mì mềm dai, nước nhưn đậm đà truyền thống",
            Logo = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80",
            CoverImage = "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&auto=format&fit=crop&q=80",
            Categories = "Đặc Sản Đà Nẵng, Mì Quảng & Bún Chả Cá",
            Rating = 4.96,
            TotalReviews = 5420,
            DistanceKm = 0.8,
            DeliveryTimeMin = 18,
            MinOrderPrice = 35000m,
            Address = "95A Nguyễn Tri Phương, Phường Thạc Gián, Quận Thanh Khê",
            District = "Thanh Khê",
            City = "TP. Đà Nẵng",
            Latitude = 16.0615,
            Longitude = 108.2045,
            Landmark = "CAU_RONG",
            IsOpen = true,
            OpenHours = "06:30 - 22:00",
            IsVerified = true,
            FeaturedPromo = "Tặng bánh tráng mè nướng cho đơn từ 80k",
            HasFreeShip = true
        };
        bamua.Menu.Add(new FoodItem
        {
            Id = "f-bamua-1",
            RestaurantId = "res-bamuamiquang",
            Name = "Mì Quảng Gà Ta Thả Vườn (Đặc Sản)",
            Description = "Thịt gà ta thả vườn dai ngọt xào sả ớt rim đậm vị, ăn kèm đậu phộng rang giòn và bánh tráng nướng mè Đại Lộc.",
            Price = 45000m,
            OriginalPrice = 55000m,
            Image = "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop&q=80",
            Category = "Mì Quảng",
            IsBestSeller = true,
            IsAvailable = true,
            SoldCount = 3840
        });

        db.Restaurants.Add(bamua);

        var phuclong = new Restaurant
        {
            Id = "res-phuclong-danang",
            Name = "Phúc Long Coffee & Tea - Nguyễn Văn Linh",
            Tagline = "Trà và cà phê hảo hạng tại trục phố tài chính Đà Nẵng",
            Logo = "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=200&auto=format&fit=crop&q=80",
            CoverImage = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&auto=format&fit=crop&q=80",
            Categories = "Trà Sữa & Cà Phê Muối",
            Rating = 4.96,
            TotalReviews = 7600,
            DistanceKm = 0.5,
            DeliveryTimeMin = 12,
            MinOrderPrice = 35000m,
            Address = "61 Nguyễn Văn Linh, Phường Phước Ninh, Quận Hải Châu",
            District = "Hải Châu",
            City = "TP. Đà Nẵng",
            Latitude = 16.0608,
            Longitude = 108.2188,
            Landmark = "CAU_RONG",
            IsOpen = true,
            OpenHours = "07:00 - 22:30",
            IsVerified = true,
            FeaturedPromo = "Freeship 0Đ cho đơn từ 2 ly",
            HasFreeShip = true
        };
        phuclong.Menu.Add(new FoodItem
        {
            Id = "f-pl-1",
            RestaurantId = "res-phuclong-danang",
            Name = "Trà Sữa Phúc Long Truyền Thống (Size L)",
            Description = "Trà đen hảo hạng pha chế cùng sữa tươi thanh trùng theo công thức độc quyền.",
            Price = 55000m,
            OriginalPrice = 65000m,
            Image = "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=400&auto=format&fit=crop&q=80",
            Category = "Trà Sữa",
            IsBestSeller = true,
            IsAvailable = true,
            SoldCount = 9200
        });

        db.Restaurants.Add(phuclong);

        // Seed sample support ticket in Da Nang
        db.SupportTickets.Add(new SupportTicket
        {
            TicketCode = "TK-DN-881",
            CustomerId = "usr-101",
            CustomerName = "Trần Minh Quang",
            CustomerPhone = "0908 123 456",
            OrderCode = "BE-DN-9941",
            Topic = "Quán quên gửi kèm bánh tráng mè nướng theo đơn",
            Priority = "MEDIUM",
            Status = "OPEN"
        });

        // Seed Chatbot FAQs for Da Nang
        if (!db.ChatbotFAQs.Any())
        {
            db.ChatbotFAQs.AddRange(
                new ChatbotFAQ
                {
                    Category = "Order",
                    Question = "Làm sao để đặt món BeFood giao nhanh tại Đà Nẵng?",
                    Answer = "Bạn chỉ cần chọn món yêu thích, kiểm tra địa chỉ tại các quận Hải Châu, Sơn Trà, Thanh Khê... và bấm 'Đặt món ngay'. Tài xế BeBike sẽ giao đến bạn trong 15-20 phút.",
                    Keywords = "đặt món, giao nhanh, đà nẵng"
                },
                new ChatbotFAQ
                {
                    Category = "Voucher",
                    Question = "Làm sao để áp dụng mã giảm giá BEFOOD50?",
                    Answer = "Tại bước thanh toán, nhập mã 'BEFOOD50' vào ô Voucher để được giảm ngay 50.000đ cho đơn từ 120.000đ.",
                    Keywords = "voucher, giảm giá, mã khuyến mãi"
                },
                new ChatbotFAQ
                {
                    Category = "Payment",
                    Question = "BeFood hỗ trợ những phương thức thanh toán nào?",
                    Answer = "BeFood hỗ trợ: Chuyển khoản VietQR 24/7 (tự động xác nhận), Ví điện tử bePay, MoMo, thẻ ATM/Visa nội địa, và Tiền mặt khi nhận hàng (COD).",
                    Keywords = "thanh toán, vietqr, momo, bepay, cod"
                }
            );
        }

        // Seed initial customer reviews for Da Nang restaurants
        if (!db.CustomerReviews.Any())
        {
            db.CustomerReviews.AddRange(
                new CustomerReview
                {
                    RestaurantId = "res-bamuamiquang",
                    RestaurantName = "Mì Quảng Bà Mua - Đặc Sản Đà Nẵng",
                    FoodName = "Mì Quảng Gà Ta Thả Vườn",
                    UserId = "usr-101",
                    UserName = "Trần Minh Quang",
                    UserAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
                    Rating = 5,
                    Comment = "Mì Quảng Bà Mua đúng chuẩn gốc Quảng Nam - Đà Nẵng! Sợi mì mềm dai, nước nhưn gà ta rim sả ớt thơm lừng, thịt gà săn chắc ngọt thịt. Bánh tráng mè nướng giòn rụm bẻ vụn vào ăn cực đã.",
                    OrderCode = "BE-DN-9941",
                    Likes = 24,
                    ReplyAuthor = "Chủ Quán Mì Quảng Bà Mua",
                    ReplyContent = "Cảm ơn quý khách đã tin tưởng và ủng hộ quán ạ! Chúc quý khách ngon miệng.",
                    ReplyDate = DateTime.UtcNow
                },
                new CustomerReview
                {
                    RestaurantId = "res-phuclong-danang",
                    RestaurantName = "Phúc Long Coffee & Tea - Nguyễn Văn Linh",
                    FoodName = "Trà Sữa Phúc Long Truyền Thống",
                    UserId = "usr-102",
                    UserName = "Lê Hoàng Yến",
                    UserAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                    Rating = 5,
                    Comment = "Trà đậm vị, sữa béo thanh không bị ngấy ngọt. BeBike giao nhanh đến Cầu Rồng ly trà vẫn còn nguyên vẹn đá lạnh.",
                    OrderCode = "BE-DN-8812",
                    Likes = 15
                }
            );
        }

        db.SaveChanges();
    }
}

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "BeFood API v1");
    c.RoutePrefix = "swagger";
});

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseRouting();
app.UseCors("AllowViteApp");

app.MapControllers();
app.MapHub<OrderHub>("/hubs/order");

app.Run();
