using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.Data.SqlClient;
using Mono.TextTemplating;
using Server.Models;
using System.Data;
using System.IO;
using System.Threading.Tasks;

namespace Server.Controllers
{
    public class UserProfile
    {
        public int BioId { get; set; }
        public string BioName { get; set; }
        public string? BioImage { get; set; }
        public string BioDesignation { get; set; }
    }
    [Authorize(Roles = "User")]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {


        string sqlconnectionstring = "Server=LAPTOP-8HB43P71\\SQLEXPRESS;Database=SweetsDB;Trusted_Connection=True;TrustServerCertificate=true;";



        [HttpGet]
        public IActionResult Get()
        {
            return Ok("You have accessed the User Controller");
        }


        #region post Order information

        [HttpPost]
        [Route("InsertOrderInformation")]
        public IActionResult InsertProductInformation([FromBody] Order order)
        {
            try
            {
               
                using (SqlConnection sqlconnection = new SqlConnection(sqlconnectionstring))
                {
                    sqlconnection.Open();
                    string storedprocedure = "InsertOrders";
                    using (SqlCommand sqlcommand = new SqlCommand(storedprocedure, sqlconnection))
                    {
                        sqlcommand.CommandType = CommandType.StoredProcedure;
                        sqlcommand.Parameters.AddWithValue("@ProductID", order.ProductID);
                        sqlcommand.Parameters.AddWithValue("@UserName", order.UserName);
                        sqlcommand.Parameters.AddWithValue("@State", order.State);
                        sqlcommand.Parameters.AddWithValue("@District", order.District);
                        sqlcommand.Parameters.AddWithValue("@Taluk", order.Taluk);
                        sqlcommand.Parameters.AddWithValue("@Vilage", order.Vilage);
                        sqlcommand.Parameters.AddWithValue("@Street", order.Street);
                        sqlcommand.Parameters.AddWithValue("@HousNumber", order.HousNumber);
                        int count = sqlcommand.ExecuteNonQuery();
                        if (count > 0)
                        {
                            return Ok("Data inserted successfully");
                        }
                        else
                        {
                            return BadRequest("Data NOt inserted");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest("some error : " + ex.Message);
            }
        }

        #endregion



        #region get User information

        [HttpGet]
        [Route("getUserInfo")]
        public ActionResult<List<UserProfile>> GetAdmin([FromQuery] string UserName)
        {
            List<UserProfile> userInfo = new List<UserProfile>();
            try
            {
                using (SqlConnection sqlconnection = new SqlConnection(sqlconnectionstring))
                {
                    sqlconnection.Open();
                    string storedprocedure = " select BioData.BDID,BioData.UserName,BioData.ImageData,BioData.Designation from BioData where BioData.UserName= @UserName";
                    using (SqlCommand sqlcommand = new SqlCommand(storedprocedure, sqlconnection))
                    {
                        sqlcommand.Parameters.AddWithValue("@UserName", UserName);
                        sqlcommand.CommandType = CommandType.Text;
                        using (SqlDataReader reader = sqlcommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                userInfo.Add(new UserProfile
                                {
                                    BioId = reader.GetInt32(0),
                                    BioName = reader.IsDBNull(1) ? "" : reader.GetString(1),
                                    BioImage = reader.IsDBNull(2) ? null : Convert.ToBase64String((byte[])reader[2]),
                                    BioDesignation = reader.IsDBNull(3) ? "" : reader.GetString(3)
                                });

                            }
                        }
                    }
                }
                return Ok(userInfo);
            }
            catch (Exception ex)
            {
                return BadRequest("Some error occured : " + ex.Message);
            }
        }

        #endregion
    }
}
