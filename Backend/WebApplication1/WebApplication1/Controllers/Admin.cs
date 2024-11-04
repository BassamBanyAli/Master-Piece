using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTOs;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Admin : ControllerBase
    {
        private readonly MyDbContext _db;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly TokenGenerator _tokenGenerator;
        private readonly EmailService _emailService;
         public Admin(MyDbContext db, TokenGenerator tokenGenerator, PasswordHasher<User> passwordHasher, EmailService emailService)
        {
            _tokenGenerator = tokenGenerator;
            _db = db;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public ActionResult Register([FromForm] RegisterDTOs model)
        {
            // Hash the password
            byte[] passwordHash, passwordSalt;
            PasswordHasher.CreatePasswordHash(model.password, out passwordHash, out passwordSalt);

            var user = new User
            {
                FullName = model.fullName,
                Password = model.password,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                Email = model.email,
                RoleId = model.roleId,
                Debartement = "",
                About = "",
            };

            _db.Users.Add(user);
            _db.SaveChanges();

            return Ok(user);
        }

        [HttpPost("login")]
        public IActionResult Login([FromForm] loginDTOs model)
        {

            var user = _db.Users.FirstOrDefault(x => x.Email == model.email && x.RoleId==2);
            if (user == null || !PasswordHasher.VerifyPasswordHash(model.password, user.PasswordHash, user.PasswordSalt))
            {
                return Unauthorized("Invalid username or password.");
            }

            var roles = _db.Roles.Where(x => x.RoleId == user.RoleId).Select(ur => ur.RoleName).ToList();
            var token = _tokenGenerator.GenerateToken(user.FullName, roles);

            return Ok(new { Token = token, userIdAdmin = user.UserId });
        }
        [HttpPut("setting")]
        public IActionResult Setting([FromForm] EditProfileDTOs request, int id)
        {
            var user = _db.Users.Find(id);

            if (user == null)
            {
                return NotFound("User not found");
            }

            // Update only non-null and non-empty values
            if (!string.IsNullOrEmpty(request.fullName))
            {
                user.FullName = request.fullName; // Update if provided
            }

           

           
            // Update password only if old password is correct and new password is provided
            if (!string.IsNullOrEmpty(request.oldPassword) && !string.IsNullOrEmpty(request.password))
            {
                // Validate the old password
                if (!PasswordHasher.VerifyPasswordHash(request.oldPassword, user.PasswordHash, user.PasswordSalt))
                {
                    return BadRequest("Old password is incorrect.");
                }

                // Hash and set the new password
                byte[] passwordHash, passwordSalt;
                PasswordHasher.CreatePasswordHash(request.password, out passwordHash, out passwordSalt);
                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
                user.Password = request.password; // Update password if provided
            }

            // Save changes to the database
            _db.SaveChanges();
            return Ok(user); // Return updated user information
        }
    }
}
