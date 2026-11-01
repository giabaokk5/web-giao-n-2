using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using BeFood.Api.Data;
using BeFood.Api.Models;
using BeFood.Api.Services;

namespace BeFood.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatbotController : ControllerBase
    {
        private readonly IChatbotService _chatbotService;
        private readonly IChatbotRepository _chatbotRepo;

        public ChatbotController(IChatbotService chatbotService, IChatbotRepository chatbotRepo)
        {
            _chatbotService = chatbotService;
            _chatbotRepo = chatbotRepo;
        }

        [HttpPost("message")]
        public async Task<ActionResult<ChatMessageResponse>> SendMessage([FromBody] ChatMessageRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new { message = "Tin nhắn không được để trống" });
            }

            var response = await _chatbotService.ProcessMessageAsync(request);
            return Ok(response);
        }

        [HttpGet("sessions/{sessionId}/messages")]
        public async Task<ActionResult<List<ChatMessage>>> GetSessionMessages(string sessionId)
        {
            var messages = await _chatbotRepo.GetSessionHistoryAsync(sessionId);
            return Ok(messages);
        }

        [HttpGet("recommendations")]
        public async Task<ActionResult<List<FoodRecommendationDto>>> GetRecommendations(
            [FromQuery] string? query,
            [FromQuery] double? lat,
            [FromQuery] double? lng,
            [FromQuery] decimal? maxPrice)
        {
            var results = await _chatbotService.GetSmartRecommendationsAsync(query, lat, lng, maxPrice);
            return Ok(results);
        }

        [HttpPost("feedback")]
        public async Task<IActionResult> SubmitFeedback([FromBody] ChatbotFeedbackRequest request)
        {
            if (string.IsNullOrEmpty(request.MessageId))
            {
                return BadRequest(new { message = "MessageId là bắt buộc" });
            }

            var feedback = new ChatbotFeedback
            {
                MessageId = request.MessageId,
                UserId = request.UserId ?? "usr-guest",
                Rating = request.Rating,
                Comment = request.Comment,
                CreatedAt = DateTime.UtcNow
            };

            await _chatbotRepo.SaveFeedbackAsync(feedback);
            return Ok(new { success = true, message = "Cảm ơn bạn đã gửi đánh giá cho Trợ lý AI BeFood!" });
        }

        [HttpPost("escalate")]
        public async Task<IActionResult> EscalateSupport([FromBody] SupportEscalationRequest request)
        {
            var escalation = new SupportEscalation
            {
                SessionId = request.SessionId,
                UserId = request.UserId ?? "usr-guest",
                UserName = request.UserName,
                UserPhone = request.UserPhone,
                OrderCode = request.OrderCode,
                Reason = request.Reason,
                Priority = string.IsNullOrEmpty(request.Priority) ? "HIGH" : request.Priority,
                Status = "PENDING",
                CreatedAt = DateTime.UtcNow
            };

            var created = await _chatbotRepo.CreateEscalationAsync(escalation);
            return Ok(new
            {
                success = true,
                message = "Đã chuyển tiếp thành công tới chuyên viên CSKH BeFood Đà Nẵng",
                ticketId = created.Id
            });
        }

        [HttpGet("admin-report")]
        public async Task<ActionResult<AdminAIReportDto>> GetAdminReport()
        {
            var report = await _chatbotService.GetAdminAIReportAsync();
            return Ok(report);
        }

        [HttpGet("faqs")]
        public async Task<ActionResult<List<ChatbotFAQ>>> GetFaqs([FromQuery] string? category, [FromQuery] string? query)
        {
            var faqs = await _chatbotRepo.GetFAQsAsync(category, query);
            return Ok(faqs);
        }
    }
}

