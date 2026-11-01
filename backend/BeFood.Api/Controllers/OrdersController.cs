using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using BeFood.Api.Data;
using BeFood.Api.Models;
using BeFood.Api.Hubs;

namespace BeFood.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly BeFoodDbContext _context;
        private readonly IHubContext<OrderHub> _hubContext;

        public OrdersController(BeFoodDbContext context, IHubContext<OrderHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetOrders([FromQuery] string? userId)
        {
            var query = _context.Orders.AsQueryable();
            if (!string.IsNullOrEmpty(userId))
            {
                query = query.Where(o => o.UserId == userId);
            }
            var orders = await query.OrderByDescending(o => o.CreatedAt).ToListAsync();
            return Ok(new { success = true, data = orders });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound(new { success = false, message = "Không tìm thấy đơn hàng." });
            return Ok(new { success = true, data = order });
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            if (string.IsNullOrEmpty(order.OrderCode))
            {
                order.OrderCode = $"BE-{new Random().Next(100000, 999999)}";
            }
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Broadcast new order to merchant
            await _hubContext.Clients.All.SendAsync("NewOrderPlaced", order);

            return CreatedAtAction(nameof(GetById), new { id = order.Id }, new { success = true, data = order });
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateStatusDto dto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound(new { success = false, message = "Không tìm thấy đơn hàng." });

            order.OrderStatus = dto.Status;
            await _context.SaveChangesAsync();

            // Realtime notification via SignalR
            await _hubContext.Clients.Group($"Order_{id}").SendAsync("OrderStatusChanged", new
            {
                OrderId = id,
                Status = dto.Status,
                Note = dto.Note,
                Timestamp = DateTime.UtcNow
            });

            return Ok(new { success = true, message = "Cập nhật trạng thái thành công.", data = order });
        }
    }

    public class UpdateStatusDto
    {
        public string Status { get; set; } = string.Empty;
        public string? Note { get; set; }
    }
}

