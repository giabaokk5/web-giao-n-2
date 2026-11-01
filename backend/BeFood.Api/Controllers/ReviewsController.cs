using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BeFood.Api.Data;
using BeFood.Api.Models;

namespace BeFood.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly BeFoodDbContext _db;

        public ReviewsController(BeFoodDbContext db)
        {
            _db = db;
        }

        // GET: api/reviews?restaurantId=...
        [HttpGet]
        public async Task<ActionResult<List<CustomerReview>>> GetReviews([FromQuery] string? restaurantId)
        {
            var query = _db.CustomerReviews.AsQueryable();
            if (!string.IsNullOrEmpty(restaurantId))
            {
                query = query.Where(r => r.RestaurantId == restaurantId);
            }
            var list = await query.OrderByDescending(r => r.CreatedAt).ToListAsync();
            return Ok(list);
        }

        // POST: api/reviews
        [HttpPost]
        public async Task<ActionResult<CustomerReview>> CreateReview([FromBody] CustomerReview review)
        {
            if (review == null || string.IsNullOrWhiteSpace(review.Comment))
            {
                return BadRequest(new { message = "Nội dung đánh giá không được để trống" });
            }

            review.Id = Guid.NewGuid().ToString();
            review.CreatedAt = DateTime.UtcNow;
            review.Likes = 0;

            _db.CustomerReviews.Add(review);

            // Update restaurant average rating if restaurant exists
            var res = await _db.Restaurants.FirstOrDefaultAsync(r => r.Id == review.RestaurantId);
            if (res != null)
            {
                res.TotalReviews += 1;
                // Running average
                res.Rating = Math.Round(((res.Rating * (res.TotalReviews - 1)) + review.Rating) / res.TotalReviews, 2);
            }

            await _db.SaveChangesAsync();
            return Ok(review);
        }

        // POST: api/reviews/{id}/like
        [HttpPost("{id}/like")]
        public async Task<IActionResult> LikeReview(string id)
        {
            var rev = await _db.CustomerReviews.FindAsync(id);
            if (rev == null) return NotFound(new { message = "Không tìm thấy đánh giá" });

            rev.Likes += 1;
            await _db.SaveChangesAsync();
            return Ok(new { success = true, likes = rev.Likes });
        }

        // POST: api/reviews/{id}/reply
        [HttpPost("{id}/reply")]
        public async Task<IActionResult> ReplyReview(string id, [FromBody] ReviewReplyRequest request)
        {
            var rev = await _db.CustomerReviews.FindAsync(id);
            if (rev == null) return NotFound(new { message = "Không tìm thấy đánh giá" });

            rev.ReplyAuthor = request.Author ?? "Ban Quản Trị BeFood";
            rev.ReplyContent = request.Content;
            rev.ReplyDate = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok(new { success = true, message = "Đã gửi phản hồi đánh giá thành công" });
        }

        // DELETE: api/reviews/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(string id)
        {
            var rev = await _db.CustomerReviews.FindAsync(id);
            if (rev == null) return NotFound(new { message = "Không tìm thấy đánh giá" });

            _db.CustomerReviews.Remove(rev);
            await _db.SaveChangesAsync();
            return Ok(new { success = true, message = "Đã xóa đánh giá thành công" });
        }
    }

    public class ReviewReplyRequest
    {
        public string? Author { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}

