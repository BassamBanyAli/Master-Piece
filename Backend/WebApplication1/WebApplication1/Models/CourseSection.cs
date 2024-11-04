using System;
using System.Collections.Generic;

namespace WebApplication1.Models;

public partial class CourseSection
{
    public int SectionId { get; set; }

    public int? CourseId { get; set; }

    public string SectionTitle { get; set; } = null!;

    public string VimeoLink { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public virtual Course? Course { get; set; }
}
