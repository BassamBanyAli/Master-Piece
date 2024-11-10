namespace WebApplication1.DTOs
{
    public class UserOrderDto
    {
        public int PaymentId { get; set; }
        public decimal Amount { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string? PaymentStatus { get; set; }
        public string? PaymentType { get; set; }
        public string? CourseName { get; set; } // Only CourseName
    }
}
