namespace WebApplication1.DTOs
{
    public class RevenueDetailDto
    {
        public string CourseName { get; set; }
        public string InstructorName { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal InstructorEarnings { get; set; }
        public decimal AdminEarnings { get; set; }
        public int NumberOfStudents { get; set; }
        public DateTime? PaymentDate { get; set; }
    }
}
