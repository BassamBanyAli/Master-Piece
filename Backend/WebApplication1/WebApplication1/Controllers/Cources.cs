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

            string imageFileName = null;
            if (model.Image != null)
            {
                imageFileName = SaveImage1(model.Image);
            }

            var course = new Course
            {
                InstructorId = model.InstructorId,
                CourseName = model.CourseName,
                CourseDescription = model.CourseDescription,
                CourseTitle = model.CourseTitle,
                Image = imageFileName,
                Department = model.Debartment,
                Price = model.Price,
                CourseAuthor = "toCart",
                CreatedAt = DateTime.UtcNow
            };

            _db.Courses.Add(course);
            _db.SaveChanges();

            // Create course sections if any
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

            // Retrieve the created course along with its sections if needed
            var createdCourse = new
            {
                CourseId = course.CourseId,
                Image = course.Image,
                Description = course.CourseDescription,
                Name = course.CourseName,
                Title = course.CourseTitle,
                Price = course.Price,
                Sections = sections // Include sections if they are part of the response
            };

            return Ok(createdCourse); // Return course data as JSON for JavaScript to access
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



        [HttpPut("updateCourseAuthor/{courseId}")]
        public IActionResult UpdateCourseAuthor(int courseId)
        {
            // Retrieve the course by its ID
            var course = _db.Courses.FirstOrDefault(c => c.CourseId == courseId);

            // Check if course exists
            if (course == null)
            {
                return NotFound("Course not found.");
            }

            // Update the CourseAuthor to "pending"
            course.CourseAuthor = "pending";

            // Save changes to the database
            _db.SaveChanges();

            return Ok(new
            {
                Message = "Course author updated successfully.",
                CourseId = course.CourseId,
                UpdatedAuthorStatus = course.CourseAuthor
            });
        }



        [HttpGet("pending/{id}")]
        public IActionResult GetCoursesByAuthorAndInstructor(int id)
        {
            // Fetch courses where CourseAuthor is "pending" and InstructorId matches the provided ID
            var courses = _db.Courses
                                  .Where(c => c.CourseAuthor == "pending" && c.InstructorId == id)
                                  .ToList();

            if (courses == null || !courses.Any())
            {
                return NotFound(new { message = "No courses found with 'pending' author and the specified instructor ID." });
            }

            return Ok(courses);
        }


        [HttpGet("GetPendingCourses")]
        public IActionResult GetPendingCourses()
        {
            // Retrieve all courses with CourseAuthor = "pending" and include instructor name
            var pendingCourses = _db.Courses
                .Where(course => course.CourseAuthor == "pending")
                .Include(course => course.Instructor) // Include related instructor
                .Select(course => new
                {
                    course.CourseId,
                    course.CourseName,
                    course.CourseDescription,
                    course.Department,
                    course.Price,
                    course.CreatedAt,
                    InstructorName = course.Instructor != null ? course.Instructor.FullName : "N/A" // Instructor name
                })
                .ToList();

            if (!pendingCourses.Any())
            {
                return NotFound(new { message = "No courses with CourseAuthor 'pending' found." });
            }

            return Ok(pendingCourses);
        }

        [HttpPut("acceptedCourse/{courseId}")]
        public IActionResult acceptedCourse(int courseId)
        {
            // Find the course by ID and check if its CourseAuthor is "pending"
            var course = _db.Courses.FirstOrDefault(c => c.CourseId == courseId && c.CourseAuthor == "pending");

            if (course == null)
            {
                return NotFound(new { message = $"No course with ID {courseId} and CourseAuthor 'pending' found." });
            }

            // Retrieve the related instructor using InstructorId
            var instructor = _db.Instructors.FirstOrDefault(i => i.InstructorId == course.InstructorId);

            if (instructor == null)
            {
                return NotFound(new { message = $"No instructor found for the course with ID {courseId}." });
            }

            // Update the CourseAuthor to the instructor's full name
            course.CourseAuthor = instructor.FullName;

            // Save changes to the database
            _db.SaveChanges();

            return Ok(new { message = $"CourseAuthor for course ID {courseId} updated to '{instructor.FullName}'." });
        }


        [HttpPut("RejectCourse/{courseId}")]
        public IActionResult RejectCourse(int courseId)
        {
            // Find the course by ID and check if its CourseAuthor is "pending"
            var course = _db.Courses.FirstOrDefault(c => c.CourseId == courseId && c.CourseAuthor == "pending");

            if (course == null)
            {
                return NotFound(new { message = $"No course with ID {courseId} and CourseAuthor 'pending' found." });
            }

            // Update the CourseAuthor to "rejected"
            course.CourseAuthor = "rejected";

            // Save changes to the database
            _db.SaveChanges();

            return Ok(new { message = $"Course ID {courseId} has been rejected." });
        }


        [HttpGet("getCourseForInstructor")]
        public IActionResult GetCourseForInstructor(int id)
        {
            var instructor = _db.Instructors.AsNoTracking().FirstOrDefault(i => i.InstructorId == id);

            if (instructor == null)
            {
                return NotFound(new { message = $"Instructor with ID {id} not found." });
            }

            var courses = _db.Courses
                .AsNoTracking() // Avoid EF Core tracking and loading full relations
                .Where(c => c.InstructorId == id && c.CourseAuthor == instructor.FullName)
                .ToList();

            if (!courses.Any())
            {
                return NotFound(new { message = $"No courses found for Instructor with ID {id} and matching CourseAuthor." });
            }

            return Ok(courses); // Cycles avoided due to no EF tracking.
        }









    }





}
