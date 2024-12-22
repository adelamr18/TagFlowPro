using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace TagFlowApi.Infrastructure
{
    public class JwtService
    {
        private readonly string _secret;
        private readonly int _expirationHours;

        public JwtService(IConfiguration configuration)
        {
            _secret = configuration["Jwt:Secret"];
            _expirationHours = int.Parse(configuration["Jwt:ExpirationHours"]);

            // Ensure the secret is at least 256 bits (32 bytes) long
            if (_secret.Length < 32)
            {
                throw new InvalidOperationException("JWT secret key must be at least 256 bits (32 bytes) long.");
            }
        }

        public string GenerateToken(int userId)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            // Ensure the key is encoded to byte[] with at least 256 bits (32 bytes)
            var key = Encoding.ASCII.GetBytes(_secret);

            // Check the length of the key for validation (should be at least 32 bytes for HMACSHA256)
            if (key.Length < 32)
            {
                throw new InvalidOperationException("JWT secret key must be at least 256 bits (32 bytes) long.");
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, userId.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(_expirationHours),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
