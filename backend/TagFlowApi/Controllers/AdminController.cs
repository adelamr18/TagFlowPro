using Microsoft.AspNetCore.Mvc;
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
    }
}
