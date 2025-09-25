using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Mono.TextTemplating;
using System.IO;
using System.Threading.Tasks;

namespace Server.Models
{
    public class Order
    {



		public int OrderId { get; set; }
		public int ProductID { get; set; }
		public string UserName { get; set; }
        public string State { get; set; }
        public string District { get; set; }
        public string Taluk { get; set; }
        public string Vilage { get; set; }
        public string Street { get; set; }
        public string HousNumber { get; set; }

    }
}
