using TagFlowApi.Models;
using TagFlowApi.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace TagFlowApi.Repositories
{
    public class UserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            _context = context;
        }

        // Get user by email and refresh entity to get fresh data.
        public User? GetUserByEmail(string email)
        {
           return _context.Users.SingleOrDefault(user => user.Email == email);
        }

        // Update the PasswordHash of a user.
        public void UpdatePasswordHash(int userId, string newPasswordHash)
        {
            var user = _context.Users.SingleOrDefault(u => u.UserId == userId);
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            user.PasswordHash = newPasswordHash;

            // Save the updated password hash to the database
            _context.SaveChanges();

            // Reload the user to ensure we have the latest data
            _context.Entry(user).Reload();
        }
    }
}
