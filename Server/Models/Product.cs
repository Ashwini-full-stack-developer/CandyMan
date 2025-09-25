namespace Server.Models
{
    public class Product
    {
        public string ProductName { get; set; }
        public string ProductCost { get; set; }
        public IFormFile ProductImage { get; set; }
        public Boolean IsAvailable { get; set; }
    }
}
