using TagFlowApi.Models;
using TagFlowApi.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace TagFlowApi.Repositories
{
    public class UserRepository
    {
        private readonly DataContext _context;
        private static readonly int ADMIN_ROLE_ID = 1;
        
        public UserRepository(DataContext context)
        {
            _context = context;
        }

        public User? GetUserByEmail(string email)
        {
            return _context.Users.SingleOrDefault(user => user.Email == email);
        }

        public bool UpdatePasswordHash(string email, string newPasswordHash)
        {
            var user = _context.Users.SingleOrDefault(u => u.Email == email);

            if (user is not null)
            {
                user.PasswordHash = newPasswordHash ?? "";
                int rowsAffected = _context.SaveChanges();

                if (rowsAffected > 0)
                {
                    _context.Entry(user).Reload();

                    if (user.RoleId == ADMIN_ROLE_ID)
                    {
                        var admin = _context.Admins.SingleOrDefault(a => a.Email == email);
                        
                        if (admin is not null)
                        {
                            admin.PasswordHash = newPasswordHash ?? "";
                            _context.SaveChanges();
                            _context.Entry(admin).Reload(); 
                        }
                    }

                    return true; 
                }
            }

            return false;
        }
    }
}
