using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using System.Data;
using Server.Models;
using Server.Data;

namespace Server.Controllers
{

    public class ProductsList
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductCost { get; set; }
        public string? ProductImage { get; set; }
        public Boolean IsAvailable { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {

        string sqlconnectionstring = "Server=LAPTOP-8HB43P71\\SQLEXPRESS;Database=SweetsDB;Trusted_Connection=True;TrustServerCertificate=true;";


        #region get All Products
       
        [HttpGet]
        [Route("getAllProducts")]
        public ActionResult<List<ProductsList>> GetAllProducts()
        {
            List<ProductsList> ProductList = new List<ProductsList>();
            try
            {
                using (SqlConnection sqlconnection = new SqlConnection(sqlconnectionstring))
                {
                    sqlconnection.Open();
                    string storedprocedure = "getAllProducts";
                    using (SqlCommand sqlcommand = new SqlCommand(storedprocedure, sqlconnection))
                    {
                        sqlcommand.CommandType = CommandType.StoredProcedure;
                        using (SqlDataReader reader = sqlcommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                ProductList.Add(new ProductsList
                                {
                                    ProductId = reader.GetInt32(0),
                                    ProductName = reader.IsDBNull(1) ? "" : reader.GetString(1),
                                    ProductCost = reader.IsDBNull(2) ? "" : reader.GetString(2),
                                    ProductImage = reader.IsDBNull(3) ? null : Convert.ToBase64String((byte[])reader[3]),
                                    IsAvailable = reader.GetBoolean(4)
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

        #region post Product information

        [HttpPost]
        [Route("InsertProductInformation")]
        public IActionResult InsertProductInformation([FromForm] Product Prod)
        {
            try
            {
                string ToBase64 = null;
                if (Prod.ProductImage != null && Prod.ProductImage.Length > 0)
                {
                    // Convert image to byte array
                    using (var memoryStream = new MemoryStream())
                    {
                        Prod.ProductImage.CopyTo(memoryStream);
                        ToBase64 = Convert.ToBase64String(memoryStream.ToArray());
                    }
                }

                using (SqlConnection sqlconnection = new SqlConnection(sqlconnectionstring))
                {
                    sqlconnection.Open();
                    string storedprocedure = "InsertProduct";
                    using (SqlCommand sqlcommand = new SqlCommand(storedprocedure, sqlconnection))
                    {
                        sqlcommand.CommandType = CommandType.StoredProcedure;
                        sqlcommand.Parameters.AddWithValue("@ProductName", Prod.ProductName);
                        sqlcommand.Parameters.AddWithValue("@ProductCost", Prod.ProductCost);
                        sqlcommand.Parameters.Add("@ProductImage", SqlDbType.VarBinary).Value = string.IsNullOrEmpty(ToBase64) ? (object)DBNull.Value : Convert.FromBase64String(ToBase64);
                        sqlcommand.Parameters.AddWithValue("@IsAvailable", Prod.IsAvailable);
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

        #region Delete The Product

        [HttpDelete]
        [Route("DeleteSurvice")]
        public ActionResult RemovepProductInformation([FromQuery] string ProductID)
        {
            try
            {
                string quare = "DELETE FROM[dbo].[ProductTb] where ProductID='" + ProductID + "'";
                int count = ProductDataLayer.DeleteSurviceInformation(quare);
                if (count > 0)
                {
                    return Ok("Deleted successfully");
                }
                else
                {
                    return BadRequest("Labour is not Deleted");
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Some error occured : " + ex.Message);
            }
        }
        #endregion

        #region Update Product

        [HttpPut]
        [Route("UpdateSurvice")]
        public IActionResult updateTheSurvices([FromQuery] string ProductID, [FromForm] Product prodList)
        {
            string sqlconnectionstring = "Server=LAPTOP-8HB43P71\\SQLEXPRESS;Database=FinalYearAcadamicProject;Trusted_Connection=True;TrustServerCertificate=true;";
            try
            {
                using (SqlConnection sqlconnecton = new SqlConnection(sqlconnectionstring))
                {
                    sqlconnecton.Open();

                    string quare = "UPDATE [dbo].[ProductTb] " +
                                   "SET [ProductName] = '" + prodList.ProductName + "', " +
                                   "[ProductCost] = '" + prodList.ProductCost + "', " +
                                   "[ProductImage] = '" + prodList.ProductImage + "', " +
                                   "[IsAvailable] = '" + prodList.IsAvailable + "' " +
                                   "WHERE ServiceID = '" + prodList + "'";

                    using (SqlCommand sqlcommand = new SqlCommand(quare, sqlconnecton))
                    {
                        sqlcommand.CommandType = System.Data.CommandType.Text;

                        int count = sqlcommand.ExecuteNonQuery();
                        if (count > 0)
                        {
                            return Ok("Updated successfully");
                        }
                        else
                        {
                            return BadRequest("Something went wrong");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Some error occurred: " + ex.Message);
            }
        }
        #endregion


        #region get Admin information

        [HttpGet]
        [Route("getProductByID")]
        public ActionResult<List<ProductsList>> GetAdmin([FromQuery] int ProductID)
        {
            List<ProductsList> Product = new List<ProductsList>();
            try
            {
                using (SqlConnection sqlconnection = new SqlConnection(sqlconnectionstring))
                {
                    sqlconnection.Open();
                    string storedprocedure = " select ProductID,ProductName,ProductCost,ProductImage,IsAvailable from ProductTb where ProductID= @ProductId";
                    using (SqlCommand sqlcommand = new SqlCommand(storedprocedure, sqlconnection))
                    {
                        sqlcommand.Parameters.AddWithValue("@ProductId", ProductID);
                        sqlcommand.CommandType = CommandType.Text;
                        using (SqlDataReader reader = sqlcommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Product.Add(new ProductsList
                                {
                                    ProductId = reader.GetInt32(0),
                                    ProductName = reader.IsDBNull(1) ? "" : reader.GetString(1),
                                    ProductCost = reader.IsDBNull(2) ? "" : reader.GetString(2),
                                    ProductImage = reader.IsDBNull(3) ? null : Convert.ToBase64String((byte[])reader[3]),
                                    IsAvailable = reader.GetBoolean(4)
                                });

                            }
                        }
                    }
                }
                return Ok(Product);
            }
            catch (Exception ex)
            {
                return BadRequest("Some error occured : " + ex.Message);
            }
        }

        #endregion

    }
}
