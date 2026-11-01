using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BeFood.Api.Data;
using BeFood.Api.Models;

namespace BeFood.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SupportController : ControllerBase
    {
        private readonly BeFoodDbContext _context;

        public SupportController(BeFoodDbContext context)
        {
            _context = context;
        }

        [HttpGet("tickets")]
        public async Task<IActionResult> GetTickets()
        {
            var tickets = await _context.SupportTickets.OrderByDescending(t => t.CreatedAt).ToListAsync();
            return Ok(new { success = true, data = tickets });
        }

        [HttpPost("tickets")]
        public async Task<IActionResult> CreateTicket([FromBody] SupportTicket ticket)
        {
            if (string.IsNullOrEmpty(ticket.TicketCode))
            {
                ticket.TicketCode = $"SUP-{new Random().Next(1000, 9999)}";
            }
            _context.SupportTickets.Add(ticket);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, data = ticket });
        }

        [HttpPut("tickets/{id}/status")]
        public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateTicketStatusDto dto)
        {
            var ticket = await _context.SupportTickets.FindAsync(id);
            if (ticket == null) return NotFound(new { success = false, message = "Không tìm thấy ticket." });

            ticket.Status = dto.Status;
            await _context.SaveChangesAsync();
            return Ok(new { success = true, data = ticket });
        }
    }

    public class UpdateTicketStatusDto
    {
        public string Status { get; set; } = string.Empty;
    }
}

