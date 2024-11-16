using System;
using System.Collections.Generic;

namespace WebApplication1.Models;

public partial class RevenueDetail
{
    public int RevenueId { get; set; }

    public int CourseId { get; set; }

    public int InstructorId { get; set; }

    public decimal TotalAmount { get; set; }

    public decimal InstructorEarnings { get; set; }

    public int NumberOfStudents { get; set; }

    public decimal AdminEarnings { get; set; }

    public DateTime? PaymentDate { get; set; }

    public virtual Course Course { get; set; } = null!;

    public virtual Instructor Instructor { get; set; } = null!;
}
