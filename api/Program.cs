using System.Threading.Tasks;
using api.Data;
using api.Handlers;
using api.Hubs;
using api.Mappings;
using api.Services;
using api.Storage;
using Azure.Storage.Blobs;
using IdentityApi;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Minio;
using Swashbuckle.AspNetCore.Filters;

var builder = WebApplication.CreateBuilder(args);

// Load configuration
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();



// Configure services
ConfigureServices(builder.Services, builder.Configuration);

var app = builder.Build();

// Configure middleware and request pipeline
ConfigureMiddleware(app);

app.Run();

/// <summary>
/// Configures services for the application.
/// </summary>
void ConfigureServices(IServiceCollection services, IConfiguration configuration)
{
    // Database context
    services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

    // Blob Storage
    services.AddSingleton(_ => new BlobServiceClient(configuration.GetConnectionString("BlobStorage")));

    // Swagger (API documentation)
    services.AddEndpointsApiExplorer();
    services.AddSwaggerGen(options =>
    {
        options.ExampleFilters();
    });

    services.AddMinio(configureClient => configureClient
            .WithEndpoint(configuration.GetConnectionString("MinioEndpoint"))
            .WithCredentials(configuration.GetConnectionString("MinioAccessKey"), configuration.GetConnectionString("MinioSecretKey"))
            .Build());

    // Dependency injection
    services.AddScoped<IUserService, UserService>();
    services.AddScoped<IChirpsService, ChirpService>();
    services.AddScoped<IFollowerService, FollowerService>();
    services.AddScoped<IFileUpload, FileUpload>();
    services.AddScoped<IMessageService, MessageService>();
    services.AddScoped<IConversationService, ConversationService>();
    services.AddScoped<TokenGenerator>();
    services.AddScoped<IBlobService, BlobService>();
    services.AddScoped<INotificationService, NotificationService>();

    // Utilities
    services.AddHttpContextAccessor();
    services.AddAutoMapper(typeof(MappingProfile), typeof(Program));
    services.AddLogging();

    //Exception Handling
    services.AddExceptionHandler<GlobalExceptionHandler>();

    // CORS policy
    services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend", policy =>
        {
            policy.WithOrigins("http://localhost:5173", builder.Configuration["AppSettings:Frontend"])
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        });
    });

    // SignalR (real-time communication)
    services.AddSignalR();

    // Authentication (Header-Based JWT)
    services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = configuration["Jwt:Issuer"],
                ValidAudience = configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(
                    System.Text.Encoding.UTF8.GetBytes(configuration["Jwt:Key"]))
            };
        });

    // Add controllers
    services.AddControllers();

    // Swagger examples
    services.AddSwaggerExamplesFromAssemblyOf<Program>();
}

/// <summary>
/// Configures middleware and the request pipeline.
/// </summary>
async Task ConfigureMiddleware(WebApplication app)
{
    // Use CORS
    app.UseCors("AllowFrontend");

    // Configure Swagger in development mode
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();

        // Run database migrations
        using var serviceScope = app.Services.CreateScope();
        var dbContext = serviceScope.ServiceProvider.GetRequiredService<AppDbContext>();
        dbContext.Database.Migrate();

        // await DataSeeder.SeedTestData(app.Services, app.Configuration);
    }


    //Exception Handling
    app.UseExceptionHandler(options => { });

    // Authentication and authorization
    app.UseAuthentication();
    app.UseAuthorization();
    app.UseStaticFiles();
    // SignalR Hub
    app.MapHub<ChatHub>("/hub");

    // Map controllers
    app.MapControllers();
}
