using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using Server.Models;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        private readonly IConfiguration _configuration;

        string sqlconnectionstring = "Server=LAPTOP-8HB43P71\\SQLEXPRESS;Database=SweetsDB;Trusted_Connection=True;TrustServerCertificate=true;";


        public AccountController(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        [HttpPost("Registraction")]
        public async Task<IActionResult> Register([FromBody] Register model)
        {
            var user = new IdentityUser { UserName = model.UserName };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                return Ok(new { message = "user Registered Successfully" });
            }
            return BadRequest(result.Errors);
        }
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] Login model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var UserRoles = await _userManager.GetRolesAsync(user);

                var authClaims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub,user.UserName!),
                    new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
                };

                authClaims.AddRange(UserRoles.Select(role => new Claim(ClaimTypes.Role, role)));

                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    expires: DateTime.Now.AddMinutes(double.Parse(_configuration["Jwt:ExpiryMinutes"]!)),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["jwt:Key"]!)),
                    SecurityAlgorithms.HmacSha256
                    ));
                return Ok(new { Token = new JwtSecurityTokenHandler().WriteToken(token), Roles = UserRoles ,User= user.UserName });

            }
            return Unauthorized();
        }

        [HttpPost("Add-Role")]
        public async Task<IActionResult> AddRole([FromBody] string role)
        {
            if (!await _roleManager.RoleExistsAsync(role))
            {
                var result = await _roleManager.CreateAsync(new IdentityRole(role));
                if (result.Succeeded)
                {
                    return Ok(new { message = "RoleAddedSuccessfully" });
                }
                return BadRequest(result.Errors);
            }
            return BadRequest("Role already Exists");
        }


        [HttpPost("Assign-Role")]
        public async Task<IActionResult> AssignRole([FromBody] UserRole model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user == null)
            {
                return BadRequest("User Not found");
            }
            var result = await _userManager.AddToRoleAsync(user, model.Role);

            if (result.Succeeded)
            {
                return Ok(new { message = "Role assigned successfully" });
            }
            return BadRequest(result.Errors);
        }


        #region post Company information

        [HttpPost]
        [Route("InsertUserInformation")]
        public IActionResult InsertCompanyInformation([FromForm] BioData bioData)
        {
            try
            {
                string base64Image = null;

                if (bioData.ImageData != null && bioData.ImageData.Length > 0)
                {
                    // Convert image to byte array
                    using (var memoryStream = new MemoryStream())
                    {
                        bioData.ImageData.CopyTo(memoryStream);
                        base64Image = Convert.ToBase64String(memoryStream.ToArray());
                    }
                }




                using (SqlConnection sqlconnection = new SqlConnection(sqlconnectionstring))
                {
                    sqlconnection.Open();
                    string storedprocedure = "InsertPersonBioData";
                    using (SqlCommand sqlcommand = new SqlCommand(storedprocedure, sqlconnection))
                    {
                        sqlcommand.CommandType = CommandType.StoredProcedure;
                        sqlcommand.Parameters.AddWithValue("@UserName", bioData.UserName);
                        sqlcommand.Parameters.Add("@ImageData", SqlDbType.VarBinary).Value = string.IsNullOrEmpty(base64Image) ? (object)DBNull.Value : Convert.FromBase64String(base64Image);
                        sqlcommand.Parameters.AddWithValue("@Designation", bioData.Designation);

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


    }
}
