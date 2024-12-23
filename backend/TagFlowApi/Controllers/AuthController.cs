using Microsoft.AspNetCore.Mvc;
using TagFlowApi.Dtos;
using TagFlowApi.Repositories;
using TagFlowApi.Infrastructure;
using TagFlowApi.Utils;

namespace TagFlowApi.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserRepository _userRepository;
        private readonly JwtService _jwtService;

        public AuthController(UserRepository userRepository, JwtService jwtService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequestDto request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { message = "Email and password are required" });
            }
            
            var user = _userRepository.GetUserByEmail(request.Email);

            if (user == null || !user.CheckPassword(request.Password))
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            var token = _jwtService.GenerateToken(user.UserId);

            return Ok(new { message = "Login successful", token });
        }

        [HttpPost("forget-password")]
        public IActionResult ForgetPassword([FromBody] ForgetPasswordDto request)
        {
            string email = request.Email;
            
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.NewPassword)) {
                return BadRequest(new { message = "Email and new password are required" });
            }
            
            var user = _userRepository.GetUserByEmail(request.Email);

            if (user == null) {
                return Unauthorized(new { message = "Email cant be found. Please check your email address and try again." });
            }
            
            string hashedPassword = Helpers.HashPassword(request.NewPassword);
            bool updateSuccessful = _userRepository.UpdatePasswordHash(request.Email, hashedPassword);

            if(!updateSuccessful) {
                 return StatusCode(500, new { message = "An error occurred while updating the password." });
            }

           return Ok(new { message = "Password updated successfully. Please use your new password to log in." });
        }
    }
}
