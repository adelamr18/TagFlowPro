using Microsoft.AspNetCore.Mvc;
using TagFlowApi.Dtos;
using TagFlowApi.Repositories;

namespace TagFlowApi.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly AdminRepository _adminRepository;

        public AdminController(AdminRepository adminRepository)
        {
            _adminRepository = adminRepository;
        }

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
    }
}
