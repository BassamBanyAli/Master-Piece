using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using WebApplication1.DTOs;
using static WebApplication1.DTOs.SaveImage;
using WebApplication1.Models;
using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Users : ControllerBase
    {
        private readonly MyDbContext _db;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly TokenGenerator _tokenGenerator;
        private readonly EmailService _emailService;
        public Users(MyDbContext db, TokenGenerator tokenGenerator, PasswordHasher<User> passwordHasher, EmailService emailService)
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
            // Regular email/password login
            var user = _db.Users.FirstOrDefault(x => x.Email == model.email);
            if (user == null || !PasswordHasher.VerifyPasswordHash(model.password, user.PasswordHash, user.PasswordSalt))
            {
                return Unauthorized("Invalid username or password.");
            }

            // Retrieve roles and generate JWT token
            var roles = _db.Roles.Where(x => x.RoleId == user.RoleId).Select(ur => ur.RoleName).ToList();
            var token = _tokenGenerator.GenerateToken(user.FullName, roles);

            // Check the user's RoleId to determine access level
            string accessMessage;
            switch (user.RoleId)
            {
                case 1:
                    accessMessage = "Logged in successfully.";
                    break;
                case 2:
                    accessMessage = "Super Admin access granted. Can access as an ordinary user.";
                    break;
                case 3:
                    accessMessage = "Instructor access pending approval.";
                    break;
                case 4:
                    accessMessage = "Accepted Instructor access granted.";
                    break;
                case 5:
                    accessMessage = "Instructor access rejected.";
                    break;
                default:
                    accessMessage = "Unknown role.";
                    break;
            }

            // Return token and role-related information
            return Ok(new { Token = token, userId = user.UserId, message = accessMessage,email=user.Email });
        }



        [HttpPost("Google")]
        public IActionResult RegisterationFromGoogle([FromForm] LoginGoogleDTOs model)
        {
            var userfetch = _db.Users.Where(x => x.Email == model.email).FirstOrDefault();

            if (userfetch == null)
            {
                var user = new User
                {
                    FullName = model.displayName,
                    Email = model.email,
                    Image = model.photoURL,
                    RoleId = 1,
                };
                _db.Users.Add(user);
                _db.SaveChanges();
                return Ok(user);
            }
            else
            {

                var user = _db.Users.FirstOrDefault(x => x.Email == model.email);
                if (user == null || !PasswordHasher.VerifyPasswordHash(user.Password, user.PasswordHash, user.PasswordSalt))
                {
                    return Unauthorized("Invalid username or password.");
                }

                // Retrieve roles and generate JWT token
                var roles = _db.Roles.Where(x => x.RoleId == user.RoleId).Select(ur => ur.RoleName).ToList();
                var token = _tokenGenerator.GenerateToken(user.FullName, roles);

                return Ok(new { Token = token, userID = user.UserId });
            }

        }

        [HttpPost("CreatePassword")]
        public IActionResult CreatePassword([FromForm] string displayName, [FromForm] string Password)
        {
            byte[] passwordHash, passwordSalt;
            PasswordHasher.CreatePasswordHash(Password, out passwordHash, out passwordSalt);

            var User = _db.Users.Where(x => x.FullName == displayName).FirstOrDefault();
            User.PasswordHash = passwordHash;
            User.PasswordSalt = passwordSalt;
            User.Password = Password;


            _db.Users.Update(User);
            _db.SaveChanges();
            return Ok(User.UserId);
        }
        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromForm] EmailRequestDTOs request)
        {
            // Validate the request and email field
            if (request == null || string.IsNullOrWhiteSpace(request.ToEmail))
            {
                return BadRequest("Invalid request: Email cannot be null or empty.");
            }

            // Generate OTP
            var otp = OtpGenerator.GenerateOtp();

            // Find the user based on the provided email
            var user = _db.Users.FirstOrDefault(x => x.Email == request.ToEmail);

            // Check if the user is null and return a suitable response
            if (user == null)
            {
                return NotFound("User not found with the provided email address.");
            }

            // Update the user's password with the OTP
            user.Password = otp;
            _db.SaveChanges();

            // Create email body including the OTP
            var emailBody = $"<p>Hello,</p><p>Your OTP code is: <strong>{otp}</strong></p><p>Thank you.</p>";
            var subject = "Send OTP";

            try
            {
                // Send email with OTP
                await _emailService.SendEmailAsync(request.ToEmail, subject, emailBody);
                return Ok(new { message = "Email sent successfully.", otp, user.UserId }); // Optionally return the OTP for testing
            }
            catch (Exception ex)
            {
                // Log the exception and return an error response
                Console.WriteLine($"Error sending email: {ex.Message}");
                return StatusCode(500, "An error occurred while sending the email.");
            }
        }

        [HttpPost("GetOTP")]
        public IActionResult GetOTP([FromForm] OtpDTOs request, int id)
        {
            var user = _db.Users.Find(id);
            if (user.Password == request.OTP)
            {

                return Ok();


            }
            return BadRequest();
        }

        [HttpPut("editPassword")]
        public IActionResult EditPassword([FromForm] EditPasswordDTOs request, int id)
        {
            var user = _db.Users.Find(id);
            byte[] passwordHash, passwordSalt;
            PasswordHasher.CreatePasswordHash(request.Password, out passwordHash, out passwordSalt);
            user.Password = request.Password;
            user.PasswordSalt = passwordSalt;
            user.PasswordHash = passwordHash;
            _db.SaveChanges();
            return Ok(user);

        }

        [HttpPut("setting")]
        public IActionResult Setting([FromForm] EditProfileDTOs request, int id)
        {
            var user = _db.Users.Find(id);

            if (user == null)
            {
                return NotFound("User not found");
            }

            // Update image only if a new one is provided; treat empty string as null
            if (request.Image != null && request.Image.Length > 0)
            {
                string imageFileName = SaveImage1(request.Image);
                user.Image = imageFileName;
            }

            // Update only non-null and non-empty values for other fields
            if (!string.IsNullOrEmpty(request.fullName))
            {
                user.FullName = request.fullName;
            }

            if (!string.IsNullOrEmpty(request.Debartement))
            {
                user.Debartement = request.Debartement;
            }

            if (!string.IsNullOrEmpty(request.About))
            {
                user.About = request.About;
            }

            // Update password only if old password is correct and new password is provided
            if (!string.IsNullOrEmpty(request.oldPassword) && !string.IsNullOrEmpty(request.password))
            {
                if (!PasswordHasher.VerifyPasswordHash(request.oldPassword, user.PasswordHash, user.PasswordSalt))
                {
                    return BadRequest("Old password is incorrect.");
                }

                PasswordHasher.CreatePasswordHash(request.password, out byte[] passwordHash, out byte[] passwordSalt);
                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
                user.Password = request.password;
            }

            // Save changes to the database
            _db.SaveChanges();
            return Ok(user); // Return updated user information
        }






        [HttpPost("sign_up_step")] // Ensure the endpoint matches the URL used in JavaScript
        public IActionResult sign_up_step([FromForm] signupstepDTOs model)
        {
            var User = _db.Users.FirstOrDefault(x => x.UserId == model.Id);

            if (User == null)
            {
                return NotFound(new { Message = "User not found." }); // Handle case if user is not found
            }

            User.Debartement = model.Departement; // Ensure this matches your DTO's property name
            User.About = model.About; // Ensure this matches your DTO's property name

            _db.SaveChanges();
            return Ok(User);
        }


        [HttpPost("sign_up_step_Instructor")] // Ensure the endpoint matches the URL used in JavaScript
        public IActionResult sign_up_step_Instructor([FromForm] signupstepInstructorDTOs model)
        {
            // Check if the user exists
            var user = _db.Users.FirstOrDefault(x => x.UserId == model.Id);

            if (user == null)
            {
                return NotFound(new { Message = "User not found." }); // Handle case if user is not found
            }

            // Initialize the image file name
            string imageFileName = null;

            // Save the image if it is provided
            if (model.GpaFile != null) // Ensure the property name matches your DTO
            {
                imageFileName = SaveImage1(model.GpaFile); // Assuming SaveImage1 saves the file and returns the file name
            }

            // Update user properties
            user.Debartement = model.Departement; // Ensure this matches your DTO's property name
            user.About = model.About; // Ensure this matches your DTO's property name
            user.RoleId = 3; // Set the role (Instructor)
            user.Image = imageFileName; // Set the uploaded image file name

            // Save changes to the database
            _db.SaveChanges();

            return Ok(user); // Return the updated user object
        }









        [HttpGet("getProfile")]
        public IActionResult getProfile(int userId)
        {
            var User = _db.Users.Where(x => x.UserId == userId).FirstOrDefault();

            return Ok(User);

        }







        [HttpPost("contactUS")]
        public async Task<IActionResult> ContactUs([FromForm] ContactUsDTOs request)
        {
            // Validate the request and email field
            if (request == null || string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest("Invalid request: Email cannot be null or empty.");
            }

            // Construct the email body
            var emailBody = $@"
        <p>Hello,</p>
        <p>You have received a new message from the contact form:</p>
        <p><strong>Full Name:</strong> {request.FullName}</p>
        <p><strong>Email:</strong> {request.Email}</p>
        <p><strong>Phone:</strong> {request.Phone}</p>
        <p><strong>Subject:</strong> {request.Subject}</p>
        <p><strong>Message:</p>
        <p>{request.Message}</p>
        <p>Thank you.</p>";

            var subject = $"New Contact Us Message: {request.Subject}";

            // Create a new ContactMessage object
            var contactMessage = new ContactMessage
            {
                FullName = request.FullName,
                Email = request.Email,
                Phone = request.Phone,
                Subject = request.Subject,
                Message = request.Message,
                CreatedAt = DateTime.Now
            };

            try
            {
                // Save the contact message to the database
                _db.ContactMessages.Add(contactMessage);
                await _db.SaveChangesAsync();

                // Send email with the message details
                await _emailService.SendEmailAsync("bassambanyali@gmail.com", subject, emailBody);

                return Ok(new { message = "Email sent and data saved successfully." });
            }
            catch (Exception ex)
            {
                // Log the exception and return an error response
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, "An error occurred while processing the request.");
            }
        }

        [HttpGet("allMessages")]
            public IActionResult GetAllContactMessages()
            {
                try
                {
                    var messages = _db.ContactMessages
                        .OrderByDescending(m => m.CreatedAt)
                        .ToList();

                    return Ok(messages);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error fetching contact messages: {ex.Message}");
                    return StatusCode(500, "An error occurred while fetching contact messages.");
                }
       





        }





    }

}
