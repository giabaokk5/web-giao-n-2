using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BeFood.Api.Models
{
    public class User
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
        public string Role { get; set; } = "Customer"; // Customer, Merchant, Driver, Admin, Support
        public decimal WalletBalance { get; set; } = 250000m;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Restaurant
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [Required]
        public string Name { get; set; } = string.Empty;
        public string Tagline { get; set; } = string.Empty;
        public string Logo { get; set; } = string.Empty;
        public string CoverImage { get; set; } = string.Empty;
        public string Categories { get; set; } = string.Empty; // Comma-separated or JSON
        public double Rating { get; set; } = 4.8;
        public int TotalReviews { get; set; } = 1200;
        public double DistanceKm { get; set; } = 1.0;
        public int DeliveryTimeMin { get; set; } = 20;
        public decimal MinOrderPrice { get; set; } = 30000m;
        public string Address { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string City { get; set; } = "TP. Đà Nẵng";
        public double Latitude { get; set; } = 16.0544;
        public double Longitude { get; set; } = 108.2022;
        public string? Landmark { get; set; } // CAU_RONG, MY_KHE, AIRPORT, UNIVERSITIES
        public bool IsOpen { get; set; } = true;
        public string OpenHours { get; set; } = "07:00 - 22:30";
        public bool IsVerified { get; set; } = true;
        public string? FeaturedPromo { get; set; }
        public bool HasFreeShip { get; set; } = true;
        public decimal CommissionRate { get; set; } = 0.18m; // 18%

        public List<FoodItem> Menu { get; set; } = new();
    }

    public class FoodItem
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [Required]
        public string RestaurantId { get; set; } = string.Empty;
        [ForeignKey("RestaurantId")]
        public Restaurant? Restaurant { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public string Image { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public bool IsBestSeller { get; set; } = false;
        public bool IsAvailable { get; set; } = true;
        public int SoldCount { get; set; } = 0;
        public int LikesCount { get; set; } = 0;
    }

    public class Order
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [Required]
        public string OrderCode { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string UserPhone { get; set; } = string.Empty;

        public string RestaurantId { get; set; } = string.Empty;
        public string RestaurantName { get; set; } = string.Empty;
        public string DeliveryAddress { get; set; } = string.Empty;

        public decimal Subtotal { get; set; }
        public decimal DeliveryFee { get; set; }
        public decimal DiscountAmount { get; set; }
        public string? VoucherCode { get; set; }
        public decimal DriverTip { get; set; }
        public decimal TotalAmount { get; set; }

        public string PaymentMethod { get; set; } = "BEPAY";
        public string PaymentStatus { get; set; } = "PAID";
        public string OrderStatus { get; set; } = "PENDING"; // PENDING, CONFIRMED, PREPARING, DRIVER_ASSIGNED, DELIVERING, COMPLETED, CANCELLED

        public string? DriverId { get; set; }
        public string? DriverName { get; set; }
        public string? DriverPhone { get; set; }
        public string? CustomerNote { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Voucher
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [Required]
        public string Code { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string DiscountType { get; set; } = "FIXED"; // FIXED, FREESHIP, PERCENT
        public decimal DiscountValue { get; set; }
        public decimal MinOrderValue { get; set; }
        public decimal? MaxDiscount { get; set; }
        public DateTime ExpireDate { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class SupportTicket
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string TicketCode { get; set; } = string.Empty;
        public string CustomerId { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public string? OrderCode { get; set; }
        public string Topic { get; set; } = string.Empty;
        public string Priority { get; set; } = "MEDIUM";
        public string Status { get; set; } = "OPEN"; // OPEN, IN_PROGRESS, RESOLVED
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    // ==========================================
    // CHATBOT AI ENTITIES (Module 7: Database)
    // ==========================================

    public class ChatSession
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = "Khách Hàng";
        public string Role { get; set; } = "Customer"; // Customer, Admin, Merchant, Driver
        public string Title { get; set; } = "Hội thoại mới";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
        public List<ChatMessage> Messages { get; set; } = new();
    }

    public class ChatMessage
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [Required]
        public string SessionId { get; set; } = string.Empty;
        [ForeignKey("SessionId")]
        public ChatSession? Session { get; set; }
        [Required]
        public string Sender { get; set; } = "user"; // user, bot, system
        [Required]
        public string Content { get; set; } = string.Empty;
        public string Role { get; set; } = "Customer"; // Customer, Admin, Merchant, Driver
        public string? MetadataJson { get; set; } // JSON of food recommendations, charts, or actions
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class ChatbotFAQ
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [Required]
        public string Category { get; set; } = "General"; // Order, Delivery, Payment, Voucher, General
        [Required]
        public string Question { get; set; } = string.Empty;
        [Required]
        public string Answer { get; set; } = string.Empty;
        public string Keywords { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class ChatbotFeedback
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [Required]
        public string MessageId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public int Rating { get; set; } = 1; // 1: Like, -1: Dislike, or 1-5 scale
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class ChatbotConfiguration
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [Required]
        public string Key { get; set; } = string.Empty; // e.g. ModelName, SystemPrompt, Temperature
        [Required]
        public string Value { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class AIRecommendation
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string? UserId { get; set; }
        [Required]
        public string FoodItemId { get; set; } = string.Empty;
        [Required]
        public string FoodName { get; set; } = string.Empty;
        public double Score { get; set; } = 0.95;
        public string Reason { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class AIUsageLog
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string? UserId { get; set; }
        public string Role { get; set; } = "Customer";
        public int PromptTokens { get; set; } = 0;
        public int ResponseTokens { get; set; } = 0;
        public string Model { get; set; } = "gemini-2.0-flash";
        public string Action { get; set; } = "chat";
        public string Status { get; set; } = "SUCCESS";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class SupportEscalation
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string SessionId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string UserPhone { get; set; } = string.Empty;
        public string? OrderCode { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Priority { get; set; } = "MEDIUM"; // LOW, MEDIUM, HIGH, URGENT
        public string Status { get; set; } = "PENDING"; // PENDING, ASSIGNED, RESOLVED
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class CustomerReview
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [Required]
        public string RestaurantId { get; set; } = string.Empty;
        public string RestaurantName { get; set; } = string.Empty;
        public string? FoodId { get; set; }
        public string? FoodName { get; set; }
        [Required]
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string UserAvatar { get; set; } = string.Empty;
        public int Rating { get; set; } = 5; // 1 to 5
        [Required]
        public string Comment { get; set; } = string.Empty;
        public string? TagsJson { get; set; }
        public string? ImagesJson { get; set; }
        public string? OrderCode { get; set; }
        public int Likes { get; set; } = 0;
        public string? ReplyAuthor { get; set; }
        public string? ReplyContent { get; set; }
        public DateTime? ReplyDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

