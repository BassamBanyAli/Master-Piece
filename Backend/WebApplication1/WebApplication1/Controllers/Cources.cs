using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using WebApplication1.DTOs;
using WebApplication1.Models;
using Microsoft.EntityFrameworkCore;
using static WebApplication1.DTOs.SaveImage;
using System.Linq;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly MyDbContext _db;

        public CoursesController(MyDbContext db)
        {
            _db = db;
        }

        [HttpGet("getallcourses")]
        public IActionResult GetAllCourses()
        {
            var courses = _db.Courses.ToList();
            return Ok(courses);
        }

        [HttpGet("getCoursesPaid")]
        public IActionResult GetCoursesPaid(int id)
        {
            var courseIds = _db.StudentCourses
                .Where(sc => sc.Student.UserId == id)
                .Select(sc => sc.CourseId)
                .ToList();

            if (!courseIds.Any())
            {
                return NotFound(new { Message = "No courses found for this student." });
            }

            var courses = _db.Courses
                .Where(c => courseIds.Contains(c.CourseId))
                .ToList();

            return Ok(courses);
        }
        [HttpGet("checkIsMyCourse")]
        public IActionResult check(int courseId,int id)
        {

            var courseIds = _db.StudentCourses
                .Where(sc => sc.Student.UserId == id && sc.CourseId == courseId)
                .FirstOrDefault();
            if (courseIds==null)
            {
                return NotFound(new { Message = "No course found for this student." });
            }
            return Ok(courseIds);

        }

        [HttpPost("createCourse")]
        public IActionResult CreateCourse([FromForm] CreateCourseDTOs model)
        {
            if (model == null)
            {
                return BadRequest("Invalid course data.");
            }

            // Deserialize sections JSON to a List<SectionDTO>
            List<SectionDTO> sections;
            try
            {
                sections = JsonConvert.DeserializeObject<List<SectionDTO>>(model.Sections);
            }
            catch (Exception ex)
            {
                return BadRequest("Invalid sections format.");
            }

            // Continue with the rest of your logic...
            string imageFileName = null;
            if (model.Image != null)
            {
                imageFileName = SaveImage1(model.Image);
            }

            var course = new Course
            {
                CourseName = model.CourseName,
                CourseDescription = model.CourseDescription,
                CourseTitle = model.CourseTitle,
                Image = imageFileName,
                Department = model.Debartment,
                Price = model.Price,
                CreatedAt = DateTime.UtcNow
            };

            _db.Courses.Add(course);
            _db.SaveChanges();

            if (sections != null && sections.Count > 0)
            {
                foreach (var section in sections)
                {
                    if (!string.IsNullOrWhiteSpace(section.SectionTitle))
                    {
                        var newSection = new CourseSection
                        {
                            SectionTitle = section.SectionTitle,
                            VimeoLink = section.VimeoLink,
                            CourseId = course.CourseId,
                            CreatedAt = DateTime.UtcNow
                        };

                        _db.CourseSections.Add(newSection);
                    }
                }
                _db.SaveChanges();
            }

            return Ok("Course and sections created successfully.");
        }




        [HttpGet("getCourse")]
        public IActionResult GetCourse(int id)
        {
            var course = _db.Courses.SingleOrDefault(x => x.CourseId == id);
            if (course == null)
            {
                return NotFound($"Course with ID {id} not found.");
            }
            return Ok(course);
        }

        [HttpGet("getSections")]
        public IActionResult GetSections(int id)
        {
            var sections = _db.CourseSections
                .Where(cs => cs.CourseId == id)
                .Select(cs => new
                {
                    SectionId = cs.SectionId,
                    SectionTitle = cs.SectionTitle,
                    VideoLink = cs.VimeoLink
                })
                .ToList();

            if (!sections.Any())
            {
                return NotFound($"No sections found for course with ID {id}");
            }

            return Ok(sections);
        }










        [HttpGet("search")]
        public IActionResult Search(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Search query cannot be empty.");
            }

            var results = _db.Courses
                .Where(c => c.CourseName.Contains(query) ||
                            c.CourseDescription.Contains(query) ||
                            c.CourseTitle.Contains(query))
                .ToList();

            if (results == null || !results.Any())
            {
                return NotFound("No courses found matching your search criteria.");
            }

            return Ok(results); // Return the list of courses
        }


        [HttpGet("GetCoursesByDepartment")]
        public IActionResult GetCoursesByDepartment(string department)
        {
            if (string.IsNullOrWhiteSpace(department))
            {
                return BadRequest("Department parameter is required.");
            }

            // Use ToLower() to perform a case-insensitive comparison
            var courses = _db.Courses
                .Where(c => c.Department.ToLower() == department.ToLower())
                .ToList();

            if (!courses.Any())
            {
                return NotFound("No courses found for the specified department.");
            }

            return Ok(courses);
        }


    }
}
