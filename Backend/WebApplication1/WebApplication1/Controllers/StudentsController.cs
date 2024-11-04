using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTOs;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase  // Renamed the controller
    {
        private readonly MyDbContext _db;

        public StudentsController(MyDbContext db)  // Corrected the constructor
        {
            _db = db;
        }

        // GET: api/Students/AllStudents
        [HttpGet("AllStudents")]
        public IActionResult GetStudents()
        {
            var students = _db.Students.ToList();
            return Ok(students);
        }

        [HttpPost("createStudents")]
        public IActionResult Post(int id)
        {
            try
            {
                var user = _db.Users.Find(id);

                if (user == null)
                {
                    return NotFound(new { Message = "User not found." });
                }

                // Check if the student already exists (using email)
                var existingStudent = _db.Students.FirstOrDefault(s => s.Email == user.Email);
                Student student;

                if (existingStudent == null)
                {
                    // Create a new student if one doesn't exist
                    student = new Student
                    {
                        UserId = id,
                        FullName = user.FullName,
                        Email = user.Email,
                        Department = user.Debartement,
                        EnrolledDate = DateTime.Now
                    };

                    _db.Students.Add(student);
                    _db.SaveChanges(); // Save new student to generate StudentId
                }
                else
                {
                    // Use the existing student
                    student = existingStudent;
                }

                // Retrieve all CartItems for the user
                var cartItems = _db.CartItems.Where(c => c.UserId == user.UserId).ToList();

                if (!cartItems.Any())
                {
                    return BadRequest(new { Message = "No courses found in the user's cart." });
                }

                var studentCoursesToAdd = new List<StudentCourse>();

                // For each CartItem, create a corresponding StudentCourse entry if it doesn't already exist
                foreach (var cartItem in cartItems)
                {
                    var course = _db.Courses.Find(cartItem.CourseId);
                    if (course == null)
                    {
                        return BadRequest(new { Message = $"Course with ID {cartItem.CourseId} not found." });
                    }

                    var existingCourse = _db.StudentCourses
                        .Any(sc => sc.StudentId == student.StudentId && sc.CourseId == cartItem.CourseId);

                    if (!existingCourse)
                    {
                        studentCoursesToAdd.Add(new StudentCourse
                        {
                            StudentId = student.StudentId,
                            CourseId = cartItem.CourseId,
                            EnrolledDate = DateTime.Now
                        });
                    }
                }

                // Add new StudentCourse records to database
                if (studentCoursesToAdd.Any())
                {
                    _db.StudentCourses.AddRange(studentCoursesToAdd);
                }

                // Remove all CartItems for the user
                _db.CartItems.RemoveRange(cartItems);

                // Save all changes in one transaction
                _db.SaveChanges();

                // Return only the StudentId
                return Ok(new { StudentId = student.StudentId });
            }
            catch (Exception ex)
            {
                // Log the error (for production, log to a file or monitoring service)
                return StatusCode(500, new { Message = $"An error occurred: {ex.Message}" });
            }
        }






    }
}
