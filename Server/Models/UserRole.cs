using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class UserRole
    {

        // Data Anotactions
        [Required]
        public string UserName { get; set; } = string.Empty;
        [Required]
        public string Role { get; set; } = string.Empty;
    }
}
