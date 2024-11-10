using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace WebApplication1.Models;

public partial class UserPayment
{
    public int PaymentId { get; set; }

    public int UserId { get; set; }

    public int CourseId { get; set; }

    public decimal Amount { get; set; }

    public DateTime? PaymentDate { get; set; }

    public string? PaymentStatus { get; set; }

    public string? PaymentType { get; set; }
    [JsonIgnore]
    public virtual Course Course { get; set; } = null!;

    [JsonIgnore]
    public virtual User User { get; set; } = null!;
}
