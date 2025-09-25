using Microsoft.Data.SqlClient;
using System.Data;

namespace Server.Data
{
    public class ProductDataLayer
    {
        public static string sqlconnectionstring = "Server=LAPTOP-8HB43P71\\SQLEXPRESS;Database=SweetsDB;Trusted_Connection=True;TrustServerCertificate=true;";


        #region Delete survices
        public static int DeleteSurviceInformation(string quare)
        {
            using (SqlConnection sqlConnection = new SqlConnection(sqlconnectionstring))
            {
                sqlConnection.Open();
                using (SqlCommand sqlCommand = new SqlCommand(quare, sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.Text;
                    int count = sqlCommand.ExecuteNonQuery();
                    return count;
                }
            }
        }
        #endregion
    }
}
