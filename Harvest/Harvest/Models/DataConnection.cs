using MySql.Data.MySqlClient;

namespace Harvest.Models
{
    public class DataConnection
    {
        MySqlConnection connection = new MySqlConnection("Server=localhost; DataBase=dbcontas; User=root; pwd=1234567");
        
        public MySqlConnection Conectar()
        {
            connection.Open();
            return connection;
        }
        public MySqlConnection Desconectar()
        {
            connection.Close();
            return connection;
        }
    }
}