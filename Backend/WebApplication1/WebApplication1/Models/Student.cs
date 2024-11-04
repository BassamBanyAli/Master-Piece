using System;
using System.Collections.Generic;

namespace WebApplication1.Models;

public partial class Student
{
    public int StudentId { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Department { get; set; }

    public DateTime? EnrolledDate { get; set; }

    public int? CourseId { get; set; }

    public int? UserId { get; set; }

    public virtual Course? Course { get; set; }

    public virtual ICollection<StudentCourse> StudentCourses { get; set; } = new List<StudentCourse>();

    public virtual User? User { get; set; }
}
