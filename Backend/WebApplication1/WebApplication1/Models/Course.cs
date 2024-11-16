using System;
using System.Collections.Generic;

namespace WebApplication1.Models;

public partial class Course
{
    public int CourseId { get; set; }

    public string? CourseName { get; set; }

    public string? CourseDescription { get; set; }

    public string? Department { get; set; }

    public string? CourseTitle { get; set; }

    public string? Image { get; set; }

    public decimal? Price { get; set; }

    public string? CourseAuthor { get; set; }

    public string? TutorialVideo { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? InstructorId { get; set; }

    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    public virtual ICollection<CourseSection> CourseSections { get; set; } = new List<CourseSection>();

    public virtual Instructor? Instructor { get; set; }

    public virtual ICollection<InstructorPayment> InstructorPayments { get; set; } = new List<InstructorPayment>();

    public virtual ICollection<RevenueDetail> RevenueDetails { get; set; } = new List<RevenueDetail>();

    public virtual ICollection<StudentCourse> StudentCourses { get; set; } = new List<StudentCourse>();

    public virtual ICollection<Student> Students { get; set; } = new List<Student>();

    public virtual ICollection<UserPayment> UserPayments { get; set; } = new List<UserPayment>();
}
