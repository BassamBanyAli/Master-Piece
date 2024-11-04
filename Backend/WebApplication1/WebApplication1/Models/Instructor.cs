using System;
using System.Collections.Generic;

namespace WebApplication1.Models;

public partial class Instructor
{
    public int InstructorId { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public byte[]? PasswordHash { get; set; }

    public byte[]? PasswordSalt { get; set; }

    public string? Department { get; set; }

    public string? Qualifications { get; set; }

    public DateTime? HireDate { get; set; }

    public string? About { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? Image { get; set; }

    public virtual ICollection<Course> Courses { get; set; } = new List<Course>();

    public virtual ICollection<InstructorPayment> InstructorPayments { get; set; } = new List<InstructorPayment>();
}
