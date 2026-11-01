using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using BeFood.Api.Models;

namespace BeFood.Api.Data
{
    public interface IChatbotRepository
    {
        Task<ChatSession> GetOrCreateSessionAsync(string? sessionId, string userId, string userName, string role);
        Task<ChatMessage> SaveMessageAsync(ChatMessage message);
        Task<List<ChatMessage>> GetSessionHistoryAsync(string sessionId, int limit = 50);
        Task<List<ChatSession>> GetUserSessionsAsync(string userId, string role);
        Task SaveFeedbackAsync(ChatbotFeedback feedback);
        Task<SupportEscalation> CreateEscalationAsync(SupportEscalation escalation);
        Task LogAIUsageAsync(AIUsageLog log);
        Task<List<ChatbotFAQ>> GetFAQsAsync(string? category, string? query);
        Task SaveRecommendationsAsync(List<AIRecommendation> recommendations);
        Task<List<AIRecommendation>> GetRecentRecommendationsAsync(string? userId, int limit = 6);
    }

    public class ChatbotRepository : IChatbotRepository
    {
        private readonly BeFoodDbContext _db;

        public ChatbotRepository(BeFoodDbContext db)
        {
            _db = db;
        }

        public async Task<ChatSession> GetOrCreateSessionAsync(string? sessionId, string userId, string userName, string role)
        {
            if (!string.IsNullOrEmpty(sessionId))
            {
                var existing = await _db.ChatSessions
                    .Include(s => s.Messages)
                    .FirstOrDefaultAsync(s => s.Id == sessionId);
                if (existing != null)
                {
                    existing.UpdatedAt = DateTime.UtcNow;
                    await _db.SaveChangesAsync();
                    return existing;
                }
            }

            var session = new ChatSession
            {
                UserId = string.IsNullOrWhiteSpace(userId) ? "usr-guest" : userId,
                UserName = string.IsNullOrWhiteSpace(userName) ? "Khách Hàng" : userName,
                Role = role,
                Title = $"Hội thoại {role} - {DateTime.Now:dd/MM HH:mm}",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _db.ChatSessions.Add(session);
            await _db.SaveChangesAsync();
            return session;
        }

        public async Task<ChatMessage> SaveMessageAsync(ChatMessage message)
        {
            _db.ChatMessages.Add(message);
            await _db.SaveChangesAsync();
            return message;
        }

        public async Task<List<ChatMessage>> GetSessionHistoryAsync(string sessionId, int limit = 50)
        {
            return await _db.ChatMessages
                .Where(m => m.SessionId == sessionId)
                .OrderBy(m => m.CreatedAt)
                .Take(limit)
                .ToListAsync();
        }

        public async Task<List<ChatSession>> GetUserSessionsAsync(string userId, string role)
        {
            return await _db.ChatSessions
                .Where(s => s.UserId == userId && s.Role == role)
                .OrderByDescending(s => s.UpdatedAt)
                .Take(20)
                .ToListAsync();
        }

        public async Task SaveFeedbackAsync(ChatbotFeedback feedback)
        {
            _db.ChatbotFeedbacks.Add(feedback);
            await _db.SaveChangesAsync();
        }

        public async Task<SupportEscalation> CreateEscalationAsync(SupportEscalation escalation)
        {
            _db.SupportEscalations.Add(escalation);
            
            // Also create a SupportTicket in core system so human agents can see it immediately
            _db.SupportTickets.Add(new SupportTicket
            {
                TicketCode = $"TK-AI-{new Random().Next(1000, 9999)}",
                CustomerId = escalation.UserId,
                CustomerName = escalation.UserName,
                CustomerPhone = escalation.UserPhone,
                OrderCode = escalation.OrderCode,
                Topic = $"[Chuyển từ Chatbot AI] {escalation.Reason}",
                Priority = escalation.Priority,
                Status = "OPEN",
                CreatedAt = DateTime.UtcNow
            });

            await _db.SaveChangesAsync();
            return escalation;
        }

        public async Task LogAIUsageAsync(AIUsageLog log)
        {
            _db.AIUsageLogs.Add(log);
            await _db.SaveChangesAsync();
        }

        public async Task<List<ChatbotFAQ>> GetFAQsAsync(string? category, string? query)
        {
            var q = _db.ChatbotFAQs.Where(f => f.IsActive);
            if (!string.IsNullOrEmpty(category))
            {
                q = q.Where(f => f.Category.ToLower() == category.ToLower());
            }
            if (!string.IsNullOrEmpty(query))
            {
                var queryLower = query.ToLower();
                q = q.Where(f => f.Question.ToLower().Contains(queryLower) || f.Keywords.ToLower().Contains(queryLower));
            }
            return await q.Take(10).ToListAsync();
        }

        public async Task SaveRecommendationsAsync(List<AIRecommendation> recommendations)
        {
            if (recommendations == null || !recommendations.Any()) return;
            _db.AIRecommendations.AddRange(recommendations);
            await _db.SaveChangesAsync();
        }

        public async Task<List<AIRecommendation>> GetRecentRecommendationsAsync(string? userId, int limit = 6)
        {
            var query = _db.AIRecommendations.AsQueryable();
            if (!string.IsNullOrEmpty(userId))
            {
                query = query.Where(r => r.UserId == userId);
            }
            return await query.OrderByDescending(r => r.CreatedAt).Take(limit).ToListAsync();
        }
    }
}

