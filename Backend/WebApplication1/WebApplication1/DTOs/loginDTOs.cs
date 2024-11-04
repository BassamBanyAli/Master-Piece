using System.ComponentModel.DataAnnotations;

namespace WebApplication1.DTOs
{
    public class loginDTOs
    {
        [EmailAddress]
        public string email {  get; set; }
        public string password { get; set; }
    }
}
