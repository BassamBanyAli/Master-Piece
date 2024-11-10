using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Instructors : ControllerBase
    {
        private readonly MyDbContext _db;

        public Instructors(MyDbContext db)  // Corrected the constructor
        {
            _db = db;
        }

        [HttpGet("AllInstructors")]
        public IActionResult GetInstructors()
        {
            var students = _db.Instructors.ToList();
            return Ok(students);
        }
        [HttpGet("AllPendingInstructors")]
        public IActionResult GetPendingInstructors()
        {
            var instructors = _db.Users.Where(x=>x.RoleId==3).ToList();
            return Ok(instructors);
        }
        [HttpGet("getSpeceficInstructor")]
        public IActionResult getSpeceficInstructor(int id)
        {
            var instructor = _db.Instructors.Where(x => x.InstructorId==id).FirstOrDefault();
            return Ok(instructor);
        }


        [HttpPost("AcceptInstructor/{id}")]
        public IActionResult AcceptInstructor(int id)
        {
            // Retrieve the user to be promoted to an instructor
            var user = _db.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            // Map the user information to a new Instructor object
            var instructor = new Instructor
            {
                FullName = user.FullName ?? "N/A",
                Email = user.Email ?? "N/A",
                PasswordHash = user.PasswordHash,
                PasswordSalt = user.PasswordSalt,
                Department = user.Debartement,
                About = user.About,
                CreatedAt = user.CreatedAt ?? DateTime.Now,
                Image = user.Image
                // Additional fields, like HireDate, can be set if needed
            };

            // Add the new instructor to the database
            _db.Instructors.Add(instructor);
            user.RoleId = 4;
            _db.SaveChanges();

            return Ok();
        }


        [HttpPost("RejectInstructor/{id}")]
        public IActionResult RejectInstructor(int id)
        {
            // Logic to reject the instructor
            var instructor = _db.Users.Find(id);
            if (instructor == null)
            {
                return NotFound();
            }

            instructor.RoleId = 5;
            _db.SaveChanges();

            return Ok();
        }

        [HttpGet("coursesPublishByInstructor")]
        public IActionResult coursesPublishByInstructor(int id)
        {
            var courses = _db.Courses.Where(x=>x.InstructorId == id).ToList();
            return Ok(courses);
        }
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Instructor>>> Search(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Query cannot be empty.");
            }

            // Normalize the query for searching
            var normalizedQuery = query.ToLower();

            // Fetch instructors whose name or department contains the search query
            var instructors = await _db.Instructors
                .Where(i => i.FullName.ToLower().Contains(normalizedQuery) ||
                             (i.Department != null && i.Department.ToLower().Contains(normalizedQuery)))
                .ToListAsync();

            return Ok(instructors);
        }










        [HttpGet("getInstructorIdByEmail")]
        public IActionResult GetInstructorIdByEmail(string email)
        {
            // Query the database to find the instructor by email
            var instructor = _db.Instructors.FirstOrDefault(i => i.Email == email);

            // Check if the instructor exists
            if (instructor == null)
            {
                return NotFound("Instructor not found with the provided email.");
            }

            // Return the InstructorId
            return Ok(new { InstructorId = instructor.InstructorId });
        }


    }
}
