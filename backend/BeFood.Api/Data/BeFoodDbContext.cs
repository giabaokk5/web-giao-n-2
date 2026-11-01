using Microsoft.EntityFrameworkCore;
using BeFood.Api.Models;

namespace BeFood.Api.Data
{
    public class BeFoodDbContext : DbContext
    {
        public BeFoodDbContext(DbContextOptions<BeFoodDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Restaurant> Restaurants => Set<Restaurant>();
        public DbSet<FoodItem> FoodItems => Set<FoodItem>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<Voucher> Vouchers => Set<Voucher>();
        public DbSet<SupportTicket> SupportTickets => Set<SupportTicket>();

        // Chatbot AI Tables
        public DbSet<ChatSession> ChatSessions => Set<ChatSession>();
        public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
        public DbSet<ChatbotFAQ> ChatbotFAQs => Set<ChatbotFAQ>();
        public DbSet<ChatbotFeedback> ChatbotFeedbacks => Set<ChatbotFeedback>();
        public DbSet<ChatbotConfiguration> ChatbotConfigurations => Set<ChatbotConfiguration>();
        public DbSet<AIRecommendation> AIRecommendations => Set<AIRecommendation>();
        public DbSet<AIUsageLog> AIUsageLogs => Set<AIUsageLog>();
        public DbSet<SupportEscalation> SupportEscalations => Set<SupportEscalation>();
        public DbSet<CustomerReview> CustomerReviews => Set<CustomerReview>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Restaurant>()
                .HasMany(r => r.Menu)
                .WithOne(f => f.Restaurant)
                .HasForeignKey(f => f.RestaurantId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ChatSession>()
                .HasMany(s => s.Messages)
                .WithOne(m => m.Session)
                .HasForeignKey(m => m.SessionId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

