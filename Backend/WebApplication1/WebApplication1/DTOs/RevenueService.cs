using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1.DTOs
{
    public class RevenueService
    {
        private readonly MyDbContext _db;

        public RevenueService(MyDbContext db)
        {
            _db = db;
        }

        public async Task UpdateRevenueAsync(int instructorId)
        {
            // Get all courses for the instructor
            var courses = await _db.Courses.Where(x => x.InstructorId == instructorId).ToListAsync();

            if (!courses.Any())
            {
                throw new ArgumentException("No courses found for the given instructor.");
            }

            // Process each course
            foreach (var course in courses)
            {
                decimal price = (decimal)course.Price;
                var courseId = course.CourseId;

                // Get the number of students enrolled in the course
                var numberOfStudents = await _db.StudentCourses
                                                .CountAsync(x => x.CourseId == courseId);

                decimal totalAmount = price * numberOfStudents;

                // Retrieve existing revenue record or create a new one
                var revenueDetail = await _db.RevenueDetails
                                             .FirstOrDefaultAsync(rd => rd.CourseId == courseId);

                decimal instructorEarnings = totalAmount * 0.7m; // 70% for the instructor
                decimal adminEarnings = totalAmount - instructorEarnings; // Admin earnings (30%)

                if (revenueDetail == null)
                {
                    // Create new revenue record
                    revenueDetail = new RevenueDetail
                    {
                        CourseId = courseId,
                        InstructorId = (int)course.InstructorId, // Correct property reference
                        TotalAmount = totalAmount, // Correct variable name
                        InstructorEarnings = instructorEarnings,
                        AdminEarnings = adminEarnings,
                        NumberOfStudents=numberOfStudents,
                        PaymentDate = DateTime.UtcNow // Track when the record was updated
                    };

                    _db.RevenueDetails.Add(revenueDetail);
                }
                else
                {
                    // Update existing revenue record
                    revenueDetail.TotalAmount = totalAmount; // Correct variable name
                    revenueDetail.InstructorEarnings = instructorEarnings;
                    revenueDetail.AdminEarnings = adminEarnings;
                    revenueDetail.PaymentDate = DateTime.UtcNow; // Update timestamp
                    revenueDetail.NumberOfStudents = numberOfStudents;

                    _db.RevenueDetails.Update(revenueDetail);
                }
            }

            // Save changes to the database
            await _db.SaveChangesAsync();
        }
    }
}
