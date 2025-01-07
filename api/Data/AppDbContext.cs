using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Models.Chirps;
using api.Models.Likes;
using api.Models.Message;
using api.Models.Conversations;

namespace api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public required DbSet<User> Users { get; set; }
        public required DbSet<Chirp> Chirps { get; set; }
        public required DbSet<Follower> Followers { get; set; }
        public required DbSet<Rechirp> Rechirps { get; set; }
        public required DbSet<Like> Likes { get; set; }
        public required DbSet<Message> Messages { get; set; }
        public required DbSet<Conversation> Conversations { get; set; }

        // Main configuration
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            ConfigureUser(modelBuilder);
            ConfigureChirp(modelBuilder);
            ConfigureFollower(modelBuilder);
            ConfigureRechirp(modelBuilder);
            ConfigureLike(modelBuilder);
            ConfigureMessage(modelBuilder);
            ConfigureConversation(modelBuilder);
        }

        private void ConfigureUser(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .Property(b => b.createdAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        }

        private void ConfigureChirp(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Chirp>()
                .Property(b => b.createdAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            modelBuilder.Entity<Chirp>()
                .HasOne(c => c.user)
                .WithMany(u => u.Chirps)
                .HasForeignKey(c => c.user_id)
                .OnDelete(DeleteBehavior.Cascade);
        }

        private void ConfigureFollower(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Follower>()
                .HasKey(f => new { f.followerId, f.followedId });

            modelBuilder.Entity<Follower>()
                .Property(b => b.createdAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            modelBuilder.Entity<Follower>()
                .HasOne(f => f.followerUser)
                .WithMany(u => u.Following)
                .HasForeignKey(f => f.followerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Follower>()
                .HasOne(f => f.followedUser)
                .WithMany(u => u.Followers)
                .HasForeignKey(f => f.followedId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        private void ConfigureRechirp(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Rechirp>()
                .HasKey(c => new { c.chirp_id, c.user_id });

            modelBuilder.Entity<Rechirp>()
                .Property(b => b.createdAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            modelBuilder.Entity<Rechirp>()
                .HasOne(f => f.user)
                .WithMany(u => u.Rechirps)
                .HasForeignKey(f => f.user_id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Rechirp>()
                .HasOne(f => f.chirp)
                .WithMany(u => u.Rechirps)
                .HasForeignKey(f => f.chirp_id)
                .OnDelete(DeleteBehavior.Restrict);
        }

        private void ConfigureLike(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Like>()
                .HasKey(l => new { l.chirp_id, l.user_id });

            modelBuilder.Entity<Like>()
                .Property(b => b.createdAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            modelBuilder.Entity<Like>()
                .HasOne(f => f.user)
                .WithMany(u => u.Likes)
                .HasForeignKey(f => f.user_id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Like>()
                .HasOne(f => f.chirp)
                .WithMany(u => u.Likes)
                .HasForeignKey(f => f.chirp_id)
                .OnDelete(DeleteBehavior.Cascade);
        }

        private void ConfigureMessage(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Message>()
                .Property(b => b.created_at)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            modelBuilder.Entity<Message>()
                .HasOne(m => m.conversation)
                .WithMany()
                .HasForeignKey(m => m.conversation_id)
                .OnDelete(DeleteBehavior.Cascade);
        }

        private void ConfigureConversation(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Conversation>()
                .HasKey(c => c.id);

            modelBuilder.Entity<Conversation>()
                .HasOne(c => c.user_one)
                .WithMany()
                .HasForeignKey(c => c.user_one_id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Conversation>()
                .HasOne(c => c.user_two)
                .WithMany()
                .HasForeignKey(c => c.user_two_id)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}