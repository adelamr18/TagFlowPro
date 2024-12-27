using Microsoft.EntityFrameworkCore;
using TagFlowApi.Dtos;
using TagFlowApi.Infrastructure;

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

        public async Task<bool> UpdateRoleNameAsync(int roleId, string newRoleName)
        {
            if (string.IsNullOrWhiteSpace(newRoleName))
            {
                throw new ArgumentException("Role name cannot be empty or null.", nameof(newRoleName));
            }

            var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleId == roleId) ?? throw new Exception($"Role with ID {roleId} not found.");
            role.RoleName = newRoleName;

            try
            {
                _context.Roles.Update(role);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating role name: {ex.Message}");
                return false;
            }
        }

        public async Task<IEnumerable<TagDto>> GetAllTagsWithDetailsAsync()
        {
            var tags = await _context.Tags
                .Include(t => t.TagValues)
                .Include(t => t.UserTagPermissions)
                    .ThenInclude(tu => tu.User)
                .Include(t => t.CreatedByAdmin)
                .AsSplitQuery()
                .Select(t => new TagDto
                {
                    TagId = t.TagId,
                    TagName = t.TagName,
                    TagValues = t.TagValues.Select(tv => tv.Value).ToList(),
                    AssignedUsers = t.UserTagPermissions.Select(tu => tu.User.Username).ToList(),
                    CreatedByEmail = t.CreatedByAdmin != null ? t.CreatedByAdmin.Email : "",
                    CreatedByUserName = t.CreatedByAdmin != null ? t.CreatedByAdmin.Username : "",
                })
                .ToListAsync();

            return tags;
        }
    }
}