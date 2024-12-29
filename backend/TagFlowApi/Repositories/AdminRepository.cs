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

        public async Task<List<User>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
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
                .Include(t => t.UserTagPermissions)
                    .ThenInclude(tu => tu.User)
                .AsSplitQuery()
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

            if (tagUpdateDto.AssignedUsers != null)
            {
                var currentUsernames = tag.UserTagPermissions
                    .Where(utp => utp.User != null)
                    .Select(utp => utp.User.Username)
                    .ToHashSet();

                var usersToAdd = tagUpdateDto.AssignedUsers.Except(currentUsernames).ToList();
                var usersToRemove = currentUsernames.Except(tagUpdateDto.AssignedUsers).ToList();

                var userTagPermissionsToRemove = tag.UserTagPermissions
                    .Where(utp => utp.User != null && usersToRemove.Contains(utp.User.Username))
                    .ToList();
                _context.UserTagPermissions.RemoveRange(userTagPermissionsToRemove);

                foreach (var username in usersToAdd)
                {
                    var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
                    if (user != null)
                    {
                        tag.UserTagPermissions.Add(new UserTagPermission
                        {
                            TagId = tag.TagId,
                            UserId = user.UserId,
                        });
                    }
                }
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

        public async Task<bool> DeleteTagAsync(int tagId)
        {
            var tag = await _context.Tags
                .Include(t => t.TagValues)
                .Include(t => t.UserTagPermissions)
                .AsSplitQuery()
                .FirstOrDefaultAsync(t => t.TagId == tagId);

            if (tag == null)
            {
                throw new Exception($"Tag with ID {tagId} not found.");
            }

            _context.TagValues.RemoveRange(tag.TagValues);

            _context.UserTagPermissions.RemoveRange(tag.UserTagPermissions);

            _context.Tags.Remove(tag);

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting tag: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> CreateTagAsync(TagCreateDto tagCreateDto, string createdByAdminUsername)
        {
            var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Username == createdByAdminUsername);
            if (admin == null)
            {
                throw new Exception("Admin not found.");
            }

            var newTag = new Tag
            {
                TagName = tagCreateDto.TagName,
                CreatedBy = admin.AdminId,
                CreatedAt = DateTime.UtcNow
            };

            if (tagCreateDto.TagValues != null && tagCreateDto.TagValues.Any())
            {
                newTag.TagValues = tagCreateDto.TagValues.Select(value => new TagValue
                {
                    Value = value,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = admin.AdminId
                }).ToList();
            }

            if (tagCreateDto.AssignedUsers != null && tagCreateDto.AssignedUsers.Any())
            {
                newTag.UserTagPermissions = new List<UserTagPermission>();

                foreach (var username in tagCreateDto.AssignedUsers)
                {
                    var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
                    if (user != null)
                    {
                        newTag.UserTagPermissions.Add(new UserTagPermission
                        {
                            UserId = user.UserId
                        });
                    }
                }
            }

            try
            {
                await _context.Tags.AddAsync(newTag);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating tag: {ex.Message}");
                return false;
            }
        }
    }
}
