using TagFlowApi.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace TagFlowApi.Repositories
{
    public class AdminRepository(DataContext context)
    {
        private readonly DataContext _context = context;

        public IEnumerable<object> GetAllRolesWithAdminDetails()
        {
            var rolesWithAdmins = _context.Roles
                .Include(r => r.CreatedByAdmin)
                .Select(r => new 
                {
                    RoleId = r.RoleId,
                    RoleName = r.RoleName,
                    CreatedAt = r.CreatedAt,
                    CreatedBy = r.CreatedByAdmin != null ? r.CreatedByAdmin.Username : null
                })
                .ToList();

            return rolesWithAdmins;
        }
    }
}
