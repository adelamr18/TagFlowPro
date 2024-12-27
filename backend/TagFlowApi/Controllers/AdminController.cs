using Microsoft.AspNetCore.Mvc;
using TagFlowApi.Dtos;
using TagFlowApi.Repositories;

namespace TagFlowApi.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController(AdminRepository adminRepository) : ControllerBase
    {
        private readonly AdminRepository _adminRepository = adminRepository;

        [HttpGet("get-all-roles")]
        public IActionResult GetAllRoles()
        {
            var roles = _adminRepository.GetAllRolesWithAdminDetails();

            if (!roles.Any())
            {
                return NotFound(new { message = "No roles found." });
            }

            return Ok(new { roles });
        }

        [HttpPut("update-role")]
        public async Task<IActionResult> UpdateRole([FromBody] UpdateRoleNameDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.NewRoleName))
            {
                return BadRequest("Invalid input data");
            }

            var success = await _adminRepository.UpdateRoleNameAsync(dto.RoleId, dto.NewRoleName);

            if (!success)
            {
                return StatusCode(500, "An error occurred while updating the role name.");
            }

            return Ok(new { message = "Role name updated successfully." });
        }

        [HttpGet("get-all-tags")]
        public async Task<IActionResult> GetAllTags()
        {
            var tags = await _adminRepository.GetAllTagsWithDetailsAsync();

            if (!tags.Any())
            {
                return NotFound(new { message = "No tags found." });
            }

            return Ok(new { tags });
        }

        [HttpPut("update-tag")]
        public async Task<IActionResult> UpdateTag([FromBody] TagUpdateDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.TagName))
            {
                return BadRequest("Invalid input data.");
            }

            var success = await _adminRepository.UpdateTagAsync(dto);

            if (!success)
            {
                return StatusCode(500, "An error occurred while updating the tag.");
            }

            return Ok(new { message = "Tag updated successfully." });
        }
    }
}
