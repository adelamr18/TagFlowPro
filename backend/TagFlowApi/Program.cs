using Microsoft.EntityFrameworkCore;
using TagFlowApi.Infrastructure;
using TagFlowApi.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register repositories and other services
builder.Services.AddScoped<UserRepository>();
builder.Services.AddSingleton<JwtService>();

// Add controllers and other necessary services
builder.Services.AddControllers();

// Add Swagger services
builder.Services.AddEndpointsApiExplorer(); // Required for Swagger to discover endpoints
builder.Services.AddSwaggerGen();  // Enable Swagger generation

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/", () => Results.Redirect("/swagger"));

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
