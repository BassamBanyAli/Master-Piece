namespace WebApplication1.DTOs
{
    public class CreateCourseDTOs
    {
        public int InstructorId { get; set; }
        public string CourseName { get; set; }
        public string CourseDescription { get; set; }
        public string CourseTitle { get; set; }
        public string Debartment { get; set; }
        public IFormFile Image { get; set; }
        public decimal Price { get; set; }

        // Use a string to represent sections as JSON
        public string Sections { get; set; }
    }
}
