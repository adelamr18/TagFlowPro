using System;
using System.Security.Cryptography;
using System.Text;

namespace TagFlowApi.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; } = "";
        public string Email { get; set; } = "";
        public string PasswordHash { get; set; } = "";
        public DateTime CreatedAt { get; set; }

        // Foreign key to Role table
        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;  // Role must be assigned, hence 'null!' indicates it is required.

        // Foreign key to Admin table (creator of the user)
        public int CreatedBy { get; set; }
        public Admin? CreatedByAdmin { get; set; }

        // Many-to-many relationship with tags through UserTagPermissions
        public ICollection<UserTagPermission> UserTagPermissions { get; set; } = new List<UserTagPermission>();

        // Many-to-one relationship with files
        public ICollection<File> Files { get; set; } = new List<File>();

        // Hash a password using native .NET libraries
        public static string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        // Check a password against the stored hash
        public bool CheckPassword(string password)
        {
            var hashedPassword = HashPassword(password);
            return hashedPassword == PasswordHash;
        }

    }
}
