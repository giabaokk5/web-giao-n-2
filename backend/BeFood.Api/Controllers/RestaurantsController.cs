using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BeFood.Api.Data;
using BeFood.Api.Models;

namespace BeFood.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RestaurantsController : ControllerBase
    {
        private readonly BeFoodDbContext _context;

        public RestaurantsController(BeFoodDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetRestaurants(
            [FromQuery] string? category,
            [FromQuery] string? q,
            [FromQuery] string? sort,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 6)
        {
            var query = _context.Restaurants.Include(r => r.Menu).AsQueryable();

            if (!string.IsNullOrWhiteSpace(q))
            {
                var lowerQ = q.ToLower();
                query = query.Where(r =>
                    r.Name.ToLower().Contains(lowerQ) ||
                    r.Address.ToLower().Contains(lowerQ) ||
                    r.Tagline.ToLower().Contains(lowerQ) ||
                    r.Categories.ToLower().Contains(lowerQ));
            }

            if (!string.IsNullOrWhiteSpace(category) && category != "cat-all")
            {
                query = query.Where(r => r.Categories.Contains(category));
            }

            if (sort == "distance")
            {
                query = query.OrderBy(r => r.DistanceKm);
            }
            else if (sort == "rating")
            {
                query = query.OrderByDescending(r => r.Rating);
            }

            var total = await query.CountAsync();
            var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return Ok(new
            {
                success = true,
                data = items,
                total,
                page,
                pageSize
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var restaurant = await _context.Restaurants
                .Include(r => r.Menu)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (restaurant == null)
                return NotFound(new { success = false, message = "Nhà hàng không tồn tại." });

            return Ok(new { success = true, data = restaurant });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Restaurant restaurant)
        {
            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = restaurant.Id }, new { success = true, data = restaurant });
        }
    }
}

