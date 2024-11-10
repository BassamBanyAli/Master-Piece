using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.DTOs;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserPayments : ControllerBase
    {
        private readonly MyDbContext _db;

        public UserPayments(MyDbContext db)
        {
            _db = db;
        }

        [HttpPost]
        public IActionResult CreateUserPayment([FromBody] UserPaymentDto userPaymentDto)
        {
            // Check if DTO is valid
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Create a new UserPayment record
            var userPayment = new UserPayment
            {
                UserId = userPaymentDto.UserId,
                CourseId = userPaymentDto.CourseId,
                Amount = userPaymentDto.Amount,
                PaymentDate = DateTime.Now,
                PaymentStatus = "Completed",   // Default value
                PaymentType = "PayPal"         // Default value
            };

            // Add to the database
            _db.UserPayments.Add(userPayment);
            _db.SaveChanges();

            return Ok(userPayment);
        }


        [HttpGet("GetOrdersByUser/{id}")]
        public IActionResult GetOrdersByUser(int id)
        {
            // Fetch orders for the specific user, projecting only needed properties
            var userPayments = _db.UserPayments
                .Where(up => up.UserId == id)
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

            if (userPayments == null || userPayments.Count == 0)
            {
                return NotFound($"No orders found for user with ID {id}.");
            }

            return Ok(userPayments);
        }



    }
}
