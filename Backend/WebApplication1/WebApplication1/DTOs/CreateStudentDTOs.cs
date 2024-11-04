namespace WebApplication1.DTOs
{
    public class CreateStudentDTOs
    {
        public string FullName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string? Department { get; set; }

        public DateTime? EnrolledDate { get; set; }
    }
}
