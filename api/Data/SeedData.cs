using Bogus;
using Microsoft.EntityFrameworkCore;

using api.Models;
using api.Models.Likes;
namespace api.Data
{
    public static class DataSeeder
    {
        public static async Task SeedTestData(IServiceProvider services, IConfiguration config)
        {
            using var scope = services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

            try
            {
                logger.LogInformation("Starting test data seeding...");

                // Check if UseTestData is true in appsettings.json
                if (!config.GetValue<bool>("UseTestData", defaultValue: false))
                {
                    logger.LogInformation("Test data seeding skipped (UseTestData is false)");
                    return;
                }

                context.Database.Migrate();

                await ClearDatabase(context);

                // Generate in sequence to maintain relationships
                var users = await GenerateUsers(context, config);
                var followers = await GenerateFollowers(context, users);
                var chirps = await GenerateChirps(context, users);
                var likes = await GenerateLikes(context, users, chirps);

                logger.LogInformation($"Seeded: {users.Count} users, {followers.Count} followers, {chirps.Count} chirps, {likes.Count} likes");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while seeding test data");
                throw;
            }
        }

        private static async Task<List<User>> GenerateUsers(AppDbContext context, IConfiguration config)
        {
            var userFaker = new Faker<User>()
                .RuleFor(u => u.first_name, f => f.Name.FirstName())
                .RuleFor(u => u.last_name, f => f.Name.LastName())
                .RuleFor(u => u.username, f => f.Internet.UserName())
                .RuleFor(u => u.email, (f, u) => f.Internet.Email(u.username))
                .RuleFor(u => u.password, f => BCrypt.Net.BCrypt.HashPassword("123"))
                .RuleFor(u => u.profile_picture_url, f => f.Internet.Avatar())
                .RuleFor(u => u.bio, f => f.Internet.Random.Words())
                .RuleFor(u => u.createdAt, f => f.Date.Past(2).ToUniversalTime());

            var users = userFaker.Generate(config.GetSection("TestDataSettings").GetValue("UserCount", defaultValue: 1));
            await context.Users.AddRangeAsync(users);
            await context.SaveChangesAsync();
            return users;
        }

        private static async Task<List<Follower>> GenerateFollowers(AppDbContext context, List<User> users)
        {
            var followers = new List<Follower>();
            var random = new Random();

            foreach (var user in users)
            {
                var followCount = random.Next((int)(users.Count * 0.2), (int)(users.Count * 0.7));
                var potentialFollowees = users
                    .Where(u => u.id != user.id)
                    .OrderBy(x => random.Next())
                    .Take(followCount);

                foreach (var followee in potentialFollowees)
                {
                    followers.Add(new Follower
                    {
                        followerId = user.id,
                        followedId = followee.id,
                        createdAt = DateTime.UtcNow.AddDays(-random.Next(1, 365))
                    });
                }
            }

            await context.Followers.AddRangeAsync(followers);
            await context.SaveChangesAsync();
            return followers;
        }

        private static async Task<List<Chirp>> GenerateChirps(AppDbContext context, List<User> users)
        {
            var chirps = new List<Chirp>();
            var random = new Random();

            var chirpFaker = new Faker<Chirp>()
                .RuleFor(c => c.id, f => f.Random.Long(1, 999999))
                .RuleFor(c => c.content, f => f.Lorem.Sentence())
                .RuleFor(c => c.createdAt, f => f.Date.Past(1).ToUniversalTime());

            foreach (var user in users)
            {
                var userChirpCount = random.Next(1, 20);
                var userChirps = chirpFaker.Generate(userChirpCount);
                foreach (var chirp in userChirps)
                {
                    chirp.user_id = user.id;
                }
                chirps.AddRange(userChirps);
            }

            await context.Chirps.AddRangeAsync(chirps);
            await context.SaveChangesAsync();
            return chirps;
        }

        private static async Task<List<Like>> GenerateLikes(AppDbContext context, List<User> users, List<Chirp> chirps)
        {
            var likes = new List<Like>();
            var random = new Random();

            foreach (var chirp in chirps)
            {
                var likeCount = random.Next(0, (int)(users.Count * 0.7));
                var likeUsers = users
                    .OrderBy(x => random.Next())
                    .Take(likeCount);

                foreach (var user in likeUsers)
                {
                    likes.Add(new Like
                    {
                        user_id = user.id,
                        chirp_id = chirp.id,
                        createdAt = DateTime.UtcNow.AddDays(-random.Next(0, 30))
                    });
                }
            }

            await context.Likes.AddRangeAsync(likes);
            await context.SaveChangesAsync();
            return likes;
        }

        private static async Task ClearDatabase(AppDbContext context)
        {
            context.Likes.RemoveRange(context.Likes);
            context.Chirps.RemoveRange(context.Chirps);
            context.Followers.RemoveRange(context.Followers);
            context.Users.RemoveRange(context.Users);
            await context.SaveChangesAsync();
        }
    }
} 