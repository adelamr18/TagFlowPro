using Microsoft.EntityFrameworkCore;
using TagFlowApi.Dtos;
using TagFlowApi.Infrastructure;
using TagFlowApi.Models;

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

            var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleId == roleId) 
                ?? throw new Exception($"Role with ID {roleId} not found.");
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

        public async Task<bool> UpdateTagAsync(TagUpdateDto tagUpdateDto)
        {
            var tag = await _context.Tags
                .Include(t => t.TagValues)
                .FirstOrDefaultAsync(t => t.TagId == tagUpdateDto.TagId);

            if (tag == null)
            {
                throw new Exception($"Tag with ID {tagUpdateDto.TagId} not found.");
            }

            tag.TagName = tagUpdateDto.TagName;
            tag.Description = tagUpdateDto.Description ?? tag.Description;

            if (tagUpdateDto.TagValues != null && tagUpdateDto.TagValues.Any())
            {
                var valuesToRemove = tag.TagValues
                    .Where(tv => !tagUpdateDto.TagValues.Contains(tv.Value))
                    .ToList();
                _context.TagValues.RemoveRange(valuesToRemove);

                var existingValues = tag.TagValues.Select(tv => tv.Value).ToHashSet();
                var valuesToAdd = tagUpdateDto.TagValues
                    .Where(v => !existingValues.Contains(v))
                    .Select(v => new TagValue
                    {
                        Value = v,
                        TagId = tag.TagId,
                        CreatedAt = DateTime.UtcNow,
                        CreatedBy = tag.CreatedBy
                    })
                    .ToList();

                _context.TagValues.AddRange(valuesToAdd);
            }

            try
            {
                _context.Tags.Update(tag);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating tag: {ex.Message}");
                return false;
            }
        }
    }
}
