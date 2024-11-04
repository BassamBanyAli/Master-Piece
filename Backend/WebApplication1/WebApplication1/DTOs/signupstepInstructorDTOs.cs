namespace WebApplication1.DTOs
{
    public class signupstepInstructorDTOs
    {
        public int Id { get; set; }
        public string Departement { get; set; }
        public string About { get; set; }
        public IFormFile GpaFile { get; set; } // Property to hold the uploaded GPA file
    }
}
