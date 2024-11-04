using System;
using System.Collections.Generic;

namespace WebApplication1.Models;

public partial class InstructorPayment
{
    public int PaymentId { get; set; }

    public int InstructorId { get; set; }

    public int CourseId { get; set; }

    public decimal Amount { get; set; }

    public DateTime? PaymentDate { get; set; }

    public string? PaymentStatus { get; set; }

    public string? PaymentType { get; set; }

    public virtual Course Course { get; set; } = null!;

    public virtual Instructor Instructor { get; set; } = null!;
}
