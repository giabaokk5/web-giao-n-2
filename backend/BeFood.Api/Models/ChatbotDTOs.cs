using System;
using System.Collections.Generic;

namespace BeFood.Api.Models
{
    public class ChatMessageRequest
    {
        public string? SessionId { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Role { get; set; } = "Customer"; // Customer, Admin, Merchant, Driver
        public string? UserId { get; set; } = "usr-guest";
        public string? UserName { get; set; } = "Khách Hàng";
        public double? Latitude { get; set; } = 16.0615;
        public double? Longitude { get; set; } = 108.2045;
        public string? RestaurantId { get; set; }
        public string? OrderCode { get; set; }
    }

    public class ChatMessageResponse
    {
        public string SessionId { get; set; } = string.Empty;
        public string MessageId { get; set; } = string.Empty;
        public string BotReply { get; set; } = string.Empty;
        public string Role { get; set; } = "Customer";
        public List<FoodRecommendationDto> Recommendations { get; set; } = new();
        public object? ActionPayload { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class FoodRecommendationDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? OriginalPrice { get; set; }
        public string Image { get; set; } = string.Empty;
        public string RestaurantId { get; set; } = string.Empty;
        public string RestaurantName { get; set; } = string.Empty;
        public double Rating { get; set; } = 4.9;
        public string MatchReason { get; set; } = string.Empty;
    }

    public class ChatbotFeedbackRequest
    {
        public string MessageId { get; set; } = string.Empty;
        public string? UserId { get; set; }
        public int Rating { get; set; } // 1: Like, -1: Dislike
        public string? Comment { get; set; }
    }

    public class SupportEscalationRequest
    {
        public string SessionId { get; set; } = string.Empty;
        public string? UserId { get; set; }
        public string UserName { get; set; } = "Khách Hàng";
        public string UserPhone { get; set; } = string.Empty;
        public string? OrderCode { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Priority { get; set; } = "MEDIUM";
    }

    public class AdminAIReportDto
    {
        public string Summary { get; set; } = string.Empty;
        public decimal TotalRevenueToday { get; set; }
        public int TotalOrdersToday { get; set; }
        public int ActiveDrivers { get; set; }
        public List<string> BestSellingFoods { get; set; } = new();
        public List<string> RiskAlerts { get; set; } = new();
    }
}

