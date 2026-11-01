using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace BeFood.Api.Hubs
{
    public class OrderHub : Hub
    {
        public async Task JoinOrder(string orderId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Order_{orderId}");
        }

        public async Task LeaveOrder(string orderId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Order_{orderId}");
        }

        public async Task SendOrderStatusUpdate(string orderId, string status, string note)
        {
            await Clients.Group($"Order_{orderId}").SendAsync("OrderStatusChanged", new
            {
                OrderId = orderId,
                Status = status,
                Note = note,
                Timestamp = DateTime.UtcNow
            });
        }

        public async Task SendDriverLocation(string orderId, double lat, double lng)
        {
            await Clients.Group($"Order_{orderId}").SendAsync("DriverLocationUpdated", new
            {
                OrderId = orderId,
                Latitude = lat,
                Longitude = lng,
                Timestamp = DateTime.UtcNow
            });
        }
    }
}

