using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.DTOs;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstructorPayment : ControllerBase
    {
        private readonly MyDbContext _db;
        public InstructorPayment(MyDbContext db)
        {
            _db = db;
        }


        // POST: api/InstructorPayments/CreateUserPayment
        [HttpPost]
        public IActionResult CreateInstructorPayment([FromBody] InstructorPaymentDto instructorPaymentDto)
        {
            // Check if the DTO is valid
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Create a new InstructorPayment record
            var instructorPayment = new Models.InstructorPayment
            {
                InstructorId = instructorPaymentDto.instructorId,
                CourseId = instructorPaymentDto.CourseId,
                Amount = instructorPaymentDto.Amount,
                PaymentDate = DateTime.Now,
                PaymentStatus = "Completed",   // Default value
                PaymentType = "PayPal"         // Default value
            };

            // Add to the database
            _db.InstructorPayments.Add(instructorPayment);
            _db.SaveChanges();

            return Ok(instructorPayment);
        }






        [HttpGet("GetOrdersByInstructor/{id}")]
        public IActionResult GetOrdersByInstructor(int id)
        {
            // Fetch orders for the specific user, projecting only needed properties
            var instructorPayments = _db.InstructorPayments
                .Where(up => up.InstructorId == id)
                .Include(up => up.Course)
                .Select(up => new UserOrderDto
                {
                    PaymentId = up.PaymentId,
                    Amount = up.Amount,
                    PaymentDate = up.PaymentDate,
                    PaymentStatus = up.PaymentStatus,
                    PaymentType = up.PaymentType,
                    CourseName = up.Course.CourseName // Only retrieve CourseName from Course
                })
                .ToList();

            if (instructorPayments == null || instructorPayments.Count == 0)
            {
                return NotFound($"No orders found for user with ID {id}.");
            }

            return Ok(instructorPayments);
        }

    }
}
