using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.DTOs;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartItemsController : ControllerBase
    {
        private readonly MyDbContext _db;

        // Constructor with the 'public' access modifier
        public CartItemsController(MyDbContext db)
        {
            _db = db;
        }

        // API to get all cart items
        [HttpGet("AllItems")]
        public IActionResult GetCartItems()
        {
            var items = _db.CartItems.ToList(); // Retrieving cart items from the database
            return Ok(items);
        }
        [HttpGet("cartItems")]
        public IActionResult GetItems(int id)
        {
            var items = _db.CartItems.Where(x=>x.UserId==id).ToList(); // Retrieving cart items from the database
            return Ok(items);
        }


        // API to add multiple items to the cart
        [HttpPost("AddToCart")]
        public IActionResult AddToCart(List<AddToCartDTOs> request)
        {
            foreach (var item in request)
            {
                // Check if the cart already contains the item for this user
                var existingCartItem = _db.CartItems
                    .FirstOrDefault(c => c.UserId == item.UserId && c.CourseId == item.CourseId);

                // If the item doesn't exist, add it to the cart
                if (existingCartItem == null)
                {
                    var cartItem = new CartItem
                    {
                        UserId = item.UserId,
                        CourseId = item.CourseId,
                        CreatedAt = DateTime.Now // Set the creation time
                    };

                    // Add the cart item to the database
                    _db.CartItems.Add(cartItem);
                }
            }

            // Save the changes after adding all items
            _db.SaveChanges();

            return Ok(new { message = "Items were added to the cart successfully if they weren't already present." });
        }

    }
}
