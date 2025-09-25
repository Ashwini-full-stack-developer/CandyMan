using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using System.Data;
using Server.Models;
using Microsoft.IdentityModel.Tokens;

namespace Server.Controllers
{

    public class AdminProfile
    {
        public int BioId { get; set; }
        public string BioName { get; set; }
        public string? BioImage { get; set; }
        public string BioDesignation { get; set; }
        public string UserID { get; set; }
    }
    public class UserInfo
    {
        public int ID { get; set; }
        public string UserName { get; set; }
        public string? ImageData { get; set; }
        public string Designation { get; set; }
    }

    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {


        string sqlconnectionstring = "Server=LAPTOP-8HB43P71\\SQLEXPRESS;Database=SweetsDB;Trusted_Connection=True;TrustServerCertificate=true;";

        #region get Admin information

        [HttpGet]
        [Route("getAdminInfo")]
        public ActionResult<List<AdminProfile>> GetAdmin([FromQuery] string RoleId)
        {
            List<AdminProfile> ProductList = new List<AdminProfile>();
            try
            {
                using (SqlConnection sqlconnection = new SqlConnection(sqlconnectionstring))
                {
                    sqlconnection.Open();
                    string storedprocedure = " select BioData.BDID,BioData.UserName,BioData.ImageData,BioData.Designation,AspNetUsers.Id from BioData inner join AspNetUsers on BioData.UserName=AspNetUsers.UserName where AspNetUsers.Id= @RoleId";
                    using (SqlCommand sqlcommand = new SqlCommand(storedprocedure, sqlconnection))
                    {
                        sqlcommand.Parameters.AddWithValue("@RoleId", RoleId);
                        sqlcommand.CommandType = CommandType.Text;
                        using (SqlDataReader reader = sqlcommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                ProductList.Add(new AdminProfile
                                {
                                    BioId = reader.GetInt32(0),
                                    BioName = reader.IsDBNull(1) ? "" : reader.GetString(1),
                                    BioImage = reader.IsDBNull(2) ? null : Convert.ToBase64String((byte[])reader[2]),
                                    BioDesignation = reader.IsDBNull(3) ? "" : reader.GetString(3),
                                    UserID = reader.IsDBNull(4) ? "" : reader.GetString(4)
                                });

                            }
                        }
                    }
                }
                return Ok(ProductList);
            }
            catch (Exception ex)
            {
                return BadRequest("Some error occured : " + ex.Message);
            }
        }

        #endregion

        #region Get User Information

        [HttpGet]
        [Route("getUserInfo")]
        public ActionResult<List<UserInfo>> GetAllUser()
        {
            List<UserInfo> UserList = new List<UserInfo>();
            try
            {
                using (SqlConnection sqlconnection = new SqlConnection(sqlconnectionstring))
                {
                    sqlconnection.Open();
                    string storedprocedure = "select BDID,UserName,ImageData,Designation from BioData";
                    using (SqlCommand sqlcommand = new SqlCommand(storedprocedure, sqlconnection))
                    {
                        sqlcommand.CommandType = CommandType.Text;
                        using (SqlDataReader reader = sqlcommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                UserList.Add(new UserInfo
                                {
                                    ID = reader.GetInt32(0),
                                    UserName = reader.IsDBNull(1) ? "" : reader.GetString(1),
                                    ImageData = reader.IsDBNull(2) ? null : Convert.ToBase64String((byte[])reader[2]),
                                    Designation = reader.IsDBNull(3) ? "" : reader.GetString(3),
                                });

                            }
                        }
                    }
                }
                return Ok(UserList);
            }
            catch (Exception ex)
            {
                return BadRequest("Some error occured : " + ex.Message);
            }
        }

        #endregion


        #region get All Orders

        [HttpGet]
        [Route("getAllOrders")]
        public ActionResult<List<Order>> GetAllOrders()
        {
            List<Order> OrdersList = new List<Order>();
            try
            {
                using (SqlConnection sqlconnection = new SqlConnection(sqlconnectionstring))
                {
                    sqlconnection.Open();
                    string quare = "select OrderId,ProductID,UserName,State,District,Taluk,Vilage,Street,HousNumber from OrderList";
                    using (SqlCommand sqlcommand = new SqlCommand(quare, sqlconnection))
                    {
                        sqlcommand.CommandType = CommandType.Text;
                        using (SqlDataReader reader = sqlcommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                OrdersList.Add(new Order
                                {
                                    OrderId = reader.GetInt32(0),
                                    ProductID = reader.GetInt32(1),
                                    UserName = reader.IsDBNull(2) ? "" : reader.GetString(2),
                                    State = reader.IsDBNull(3) ? "" : reader.GetString(3),
                                    District = reader.IsDBNull(4) ? "" : reader.GetString(4),
                                    Taluk = reader.IsDBNull(5) ? "" : reader.GetString(5),
                                    Vilage = reader.IsDBNull(6) ? "" : reader.GetString(6),
                                    Street = reader.IsDBNull(7) ? "" : reader.GetString(7),
                                    HousNumber = reader.IsDBNull(8) ? "" : reader.GetString(8),

                                });

                            }
                        }
                    }
                }
                return Ok(OrdersList);
            }
            catch (Exception ex)
            {
                return BadRequest("Some error occured : " + ex.Message);
            }
        }
        #endregion


    }
}
