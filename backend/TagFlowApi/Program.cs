using Microsoft.EntityFrameworkCore;
using TagFlowApi.Infrastructure;
using TagFlowApi.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register repositories and other services
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<AdminRepository>();
builder.Services.AddSingleton<JwtService>();

// Add controllers and other necessary services
builder.Services.AddControllers();

// Add Swagger services
builder.Services.AddEndpointsApiExplorer(); // Required for Swagger to discover endpoints
builder.Services.AddSwaggerGen();  // Enable Swagger generation

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.MapGet("/", () => Results.Redirect("/swagger"));
app.MapControllers();

app.Run();
