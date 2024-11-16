using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.DTOs;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RevenueController : ControllerBase
    {
        private readonly RevenueService _revenueService;
        private readonly MyDbContext _db;

        public RevenueController(RevenueService revenueService,MyDbContext db)
        {
            _db = db;
            _revenueService = revenueService;
        }

        [HttpPost("update-revenue")]
        public async Task<IActionResult> UpdateRevenue(int instructorId)
        {
            try
            {
                // Call the service to update revenue details
                await _revenueService.UpdateRevenueAsync(instructorId);

                // Return success response
                return Ok(new { message = "Revenue details updated successfully." });
            }
            catch (ArgumentException ex)
            {
                // Return a 404 Not Found error for invalid inputs
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                // Return a 500 Internal Server Error for unexpected issues
                return StatusCode(500, new { error = "An unexpected error occurred.", details = ex.Message });
            }
        }
        [HttpGet("total-students/{instructorId}")]
        public IActionResult GetTotalStudents(int instructorId)
        {
            try
            {
                // Get all courses for the instructor
                var courses = _db.Courses
                                 .Where(c => c.InstructorId == instructorId)
                                 .ToList();

                if (!courses.Any())
                    return NotFound(new { error = "No courses found for the given instructor." });

                // Calculate the total number of students across all courses
                var totalStudents = _db.StudentCourses
                                       .Where(sc => courses.Select(c => c.CourseId).Contains(sc.CourseId))
                                       .Count();

                return Ok(new { InstructorId = instructorId, TotalStudents = totalStudents });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
        [HttpGet("total-students-all")]
        public IActionResult GetTotalStudentsAll()
        {
            try
            {
                // Get the total number of students across the website
                var totalStudents = _db.StudentCourses.Count();  // Assuming StudentCourses is the relationship table between students and courses

                // Optionally, you can return additional data, like new students if you have that information
                var response = new
                {
                    TotalStudents = totalStudents,
                    // NewStudents = someLogicForNewStudents // Add your logic here if needed
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("total-courses")]
        public IActionResult GetTotalCourses()
        {
            try
            {
                // Get the total number of courses from the Courses table
                var totalCourses = _db.Courses.Count();

                return Ok(new { TotalCourses = totalCourses });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
        [HttpGet("total-instructors")]
        public async Task<IActionResult> GetTotalInstructors()
        {
            try
            {
                // Get the count of instructors
                int totalInstructors = await _db.Instructors.CountAsync();

                // Return the result as a response
                return Ok(new { totalInstructors });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
        [HttpGet("total-sales")]
        public async Task<IActionResult> GetTotalSales()
        {
            try
            {
                // Calculate the total sales by summing up the 'TotalAmount' for all records in the RevenueDetail table
                var totalSales = await _db.RevenueDetails
                    .SumAsync(rd => rd.TotalAmount);

                // Return the total sales as JSON
                return Ok(new { totalSales });
            }
            catch (Exception ex)
            {
                // Handle any errors that may occur
                return StatusCode(500, new { message = ex.Message });
            }
        }



        [HttpGet("total-profit")]
        public IActionResult GetTotalProfit()
        {
            try
            {
                // Fetch all revenue details
                var revenueDetails = _db.RevenueDetails.ToList();

                // Calculate total earnings for admin and instructors
                decimal totalAdminEarnings = 0;
                decimal totalInstructorEarnings = 0;

                foreach (var revenue in revenueDetails)
                {
                    // Calculate 30% for the admin and 70% for the instructor
                    totalAdminEarnings += revenue.TotalAmount * 0.30m;  // Admin earns 30%
                    totalInstructorEarnings += revenue.TotalAmount * 0.70m;  // Instructor earns 70%
                }

                // Return the results as a JSON object
                var result = new
                {
                    TotalAdminEarnings = totalAdminEarnings,
                    TotalInstructorEarnings = totalInstructorEarnings
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "An error occurred while calculating the total profit.", details = ex.Message });
            }
        }
          [HttpGet("course-revenue-details")]
        public async Task<ActionResult<IEnumerable<RevenueDetailDto>>> GetRevenueDetails()
        {
            var revenueDetails = await _db.RevenueDetails
                .Include(r => r.Course)           // Include the course details
                .Include(r => r.Instructor)       // Include the instructor details
                .Select(r => new RevenueDetailDto
                {
                    CourseName = r.Course.CourseName,
                    InstructorName = r.Instructor.FullName,
                    TotalAmount = r.TotalAmount,
                    InstructorEarnings = r.InstructorEarnings,
                    AdminEarnings = r.AdminEarnings,
                    NumberOfStudents = r.NumberOfStudents,
                    PaymentDate = r.PaymentDate
                })
                .ToListAsync();

            if (revenueDetails == null || !revenueDetails.Any())
            {
                return NotFound("No revenue details found.");
            }

            return Ok(revenueDetails);
        }
        [HttpGet("getCoursesForInstructor")]
        public IActionResult GetCoursesForInstructor(int instructorId)
        {
            try
            {
                // Check if the instructor exists
                var instructorExists = _db.Instructors.AsNoTracking().Any(i => i.InstructorId == instructorId);

                if (!instructorExists)
                {
                    return NotFound(new { message = $"Instructor with ID {instructorId} not found." });
                }

                // Count the courses associated with the instructor
                var totalCourses = _db.Courses
                    .AsNoTracking()
                    .Count(c => c.InstructorId == instructorId);

                return Ok(totalCourses);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("total-sales-for-instructor")]
        public async Task<IActionResult> GetTotalSalesForInstructor(int instructorId)
        {
            try
            {
                // Check if the instructor exists
                var instructorExists = await _db.Instructors
                    .AsNoTracking()
                    .AnyAsync(i => i.InstructorId == instructorId);

                if (!instructorExists)
                {
                    return NotFound(new { message = $"Instructor with ID {instructorId} not found." });
                }

                // Calculate the total sales for the specified instructor
                var totalSales = await _db.RevenueDetails
                    .Where(rd => rd.InstructorId == instructorId)
                    .SumAsync(rd => rd.TotalAmount);

                // Return the total sales as JSON
                return Ok(new { totalSales });
            }
            catch (Exception ex)
            {
                // Handle any errors that may occur
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("total-profits-for-instructor")]
        public async Task<IActionResult> GetTotalProfitsForInstructor(int instructorId)
        {
            try
            {
                // Check if the instructor exists
                var instructorExists = await _db.Instructors
                    .AsNoTracking()
                    .AnyAsync(i => i.InstructorId == instructorId);

                if (!instructorExists)
                {
                    return NotFound(new { message = $"Instructor with ID {instructorId} not found." });
                }

                // Calculate the total profits for the specified instructor
                var totalProfits = await _db.RevenueDetails
                    .Where(rd => rd.InstructorId == instructorId)
                    .SumAsync(rd => rd.InstructorEarnings);

                // Return the total profits as JSON
                return Ok(new { totalProfits });
            }
            catch (Exception ex)
            {
                // Handle any errors that may occur
                return StatusCode(500, new { message = ex.Message });
            }
        }




    }
}
