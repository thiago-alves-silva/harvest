using Harvest.Models;
using MySql.Data.MySqlClient;
using System.Web.Mvc;

namespace Harvest.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Home()
        {
            return View();
        }

        public ActionResult Login()
        {
            return View();
        }

        public ActionResult Register()
        {
            return View();
        }

        public ActionResult KnowMore()
        {
            return View();
        }

        public ActionResult Dashboard()
        {
            try
            {
                if (Session["username"].ToString() != "") return View();
                else return RedirectToAction("Index");
            }
            catch
            {
                return RedirectToAction("Index");
            }

        }

        public ActionResult CustomersPage()
        {
            return View();
        }

        public ActionResult BillsPage()
        {
            return View();
        }

        public ActionResult NewBill()
        {
            return View();
        }

        public ActionResult NewCustomer()
        {
            return View();
        }

        public ActionResult True()
        {
            return View();
        }

        public ActionResult False()
        {
            return View();
        }

        DataConnection database = new DataConnection();
        [HttpPost]
        public ActionResult Register(User user)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    MySqlCommand command = new MySqlCommand("call InsereFunc(@name, @cpf, @phone, DATE_FORMAT(STR_TO_DATE(@dateBirth, '%d/%m/%Y'), '%Y-%m-%d'), @email, @password)", database.Conectar());
                    command.Parameters.Add("@name", MySqlDbType.VarChar).Value = user.nome;
                    command.Parameters.Add("@cpf", MySqlDbType.VarChar).Value = user.cpf;
                    command.Parameters.Add("@phone", MySqlDbType.VarChar).Value = user.tel;
                    command.Parameters.Add("@dateBirth", MySqlDbType.VarChar).Value = user.data;
                    command.Parameters.Add("@email", MySqlDbType.VarChar).Value = user.email;
                    command.Parameters.Add("@password", MySqlDbType.VarChar).Value = user.senha;

                    string reader = command.ExecuteScalar().ToString();
                    if (reader == "Deu bom") return RedirectToAction("True");
                    else return RedirectToAction("False");
                }
                else return View(user);
            } catch
            {
                return View(user);
            }
            finally
            {
                database.Desconectar();
            }
        }

        [HttpGet]
        public string getRegister(string cod)
        {
            MySqlCommand command = new MySqlCommand("select * from Funcionario where cod_func=@cod", database.Conectar());
            command.Parameters.Add("@cod", MySqlDbType.VarChar).Value = cod;

            MySqlDataReader reader = command.ExecuteReader();
            if (reader.HasRows)
            {
                string json = "";
                while (reader.Read())
                {
                    json += "{" + string.Format(@"""cod"":{0}, ""nome"":""{1}"", ""cpf"":""{2}"", ""telefone"":""{3}"", ""datan"":""{4}"", ""email"":""{5}""", reader["cod_func"], reader["nome_fun"], reader["cpf_fun"], reader["telefone_fun"], reader["dt_nasc"], reader["email_fun"]) + "}";
                }
                return json;
            }
            else return "false";
        }

        [HttpPost]
        public ActionResult editRegister(User user)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    MySqlCommand command = new MySqlCommand("update Funcionario set nome_fun=@name, cpf_fun=@cpf, telefone_fun=@phone, dt_nasc=DATE_FORMAT(STR_TO_DATE(@dateBirth, '%d/%m/%Y'), '%Y-%m-%d'), email_fun=@email, senha_fun=@password where cod_func=@cod)", database.Conectar());
                    command.Parameters.Add("@name", MySqlDbType.VarChar).Value = user.nome;
                    command.Parameters.Add("@cpf", MySqlDbType.VarChar).Value = user.cpf;
                    command.Parameters.Add("@phone", MySqlDbType.VarChar).Value = user.tel;
                    command.Parameters.Add("@dateBirth", MySqlDbType.VarChar).Value = user.data;
                    command.Parameters.Add("@email", MySqlDbType.VarChar).Value = user.email;
                    command.Parameters.Add("@password", MySqlDbType.VarChar).Value = user.senha;
                    command.Parameters.Add("@cod", MySqlDbType.VarChar).Value = user.codfunc;
                    command.ExecuteNonQuery();
                    return RedirectToAction("True");
                }
                else return View(user);
            }
            catch
            {
                return View(user);
            }
            finally
            {
                database.Desconectar();
            }
        }

        [HttpGet]
        public string LoginUser(string email, string senha)
        {
            try
            {
                MySqlCommand command = new MySqlCommand("select * from Funcionario where email_fun = @email and senha_fun = @senha", database.Conectar());
                command.Parameters.Add("@email", MySqlDbType.VarChar).Value = email;
                command.Parameters.Add("@senha", MySqlDbType.VarChar).Value = senha;

                MySqlDataReader reader = command.ExecuteReader();
                if(reader.HasRows)
                {
                    while(reader.Read())
                    {
                        Session["username"] = reader["nome_fun"].ToString();
                        Session["cod"] = reader["cod_func"].ToString();
                    }

                    string jsonUser = "{" + string.Format(@"""cod"":""{0}"", ""user"":""{1}""", Session["cod"], Session["username"]) + "}";
                    return jsonUser;
                }
                else return "Usuário não encontrado!";
            }
            catch
            {
                return "Falha na verificação com o banco de dados!";
            }
            finally
            {
                database.Desconectar();
            }
        }

        public bool Logout()
        {
            Session.Clear();
            return true;
        }

        [HttpGet]
        public string Bills(string cod)
        {
            MySqlCommand command = new MySqlCommand("select cl.cod_cli, cl.nome_cli, cl.cpf_cli, c.cod_conta,c.data_venc,c.desc_con,c.valor_con,c.tipo_con from Conta c inner join Cliente cl on c.cod_cli=cl.cod_cli where c.cod_func=@cod order by data_venc asc;", database.Conectar());
            command.Parameters.Add("@cod", MySqlDbType.VarChar).Value = cod;

            MySqlDataReader reader = command.ExecuteReader();
            if (reader.HasRows)
            {
                string json = "[";
                while (reader.Read())
                {
                    json += ", {" + string.Format(@"""codigo"":{0}, ""cliente"":""{1}"", ""identificacao"":""{2}"", ""titulo"":""{3}"", ""datav"":""{4}"",""valor"":""{5}"",""tipo"":""{6}""", reader["cod_conta"], reader["nome_cli"], reader["cpf_cli"], reader["desc_con"], reader["data_venc"], reader["valor_con"], reader["tipo_con"]) + "}";
                }
                return json + "]";
            }
            else return "false";
        }

        [HttpGet]
        public string getBill(string cod)
        {
            MySqlCommand command = new MySqlCommand("select cl.cod_cli, c.data_venc, c.desc_con, c.valor_con, c.tipo_con from Conta c inner join Cliente cl on c.cod_cli=cl.cod_cli where c.cod_conta=@codConta", database.Conectar());
            command.Parameters.Add("@codConta", MySqlDbType.VarChar).Value = cod;

            MySqlDataReader reader = command.ExecuteReader();
            if (reader.HasRows)
            {
                string json = "";
                while (reader.Read())
                {
                    json += "{" + string.Format(@"""codcli"":{0}, ""nome"":""{1}"", ""valor"":""{2}"", ""datav"":""{3}"", ""tipo"":""{4}""", reader["cod_cli"], reader["desc_con"], reader["valor_con"], reader["data_venc"], reader["tipo_con"]) + "}";
                }
                return json;
            }
            else return "false";
        }

        [HttpPost]
        public ActionResult NewBill(Bill bill)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    MySqlCommand command = new MySqlCommand("insert into Conta values(default, @codfunc, @codcli, DATE_FORMAT(STR_TO_DATE(@datav, '%d/%m/%Y'), '%Y-%m-%d'), @nome, @valor, @tipo)", database.Conectar());
                    command.Parameters.Add("@codfunc", MySqlDbType.VarChar).Value = bill.codfunc;
                    command.Parameters.Add("@codcli", MySqlDbType.VarChar).Value = bill.cliente;
                    command.Parameters.Add("@datav", MySqlDbType.VarChar).Value = bill.datav;
                    command.Parameters.Add("@nome", MySqlDbType.VarChar).Value = bill.nome;
                    command.Parameters.Add("@valor", MySqlDbType.VarChar).Value = bill.valor.Replace(',', '.');
                    command.Parameters.Add("@tipo", MySqlDbType.VarChar).Value = bill.tipo;
                    command.ExecuteNonQuery();
                    return RedirectToAction("True");
                }
                else return View(bill);
            }
            catch
            {
                return View(bill);
            }
            finally
            {
                database.Desconectar();
            }
        }

        public bool deleteBill(string cod)
        {
            try
            {
                MySqlCommand command = new MySqlCommand("delete from Conta where cod_conta=@cod", database.Conectar());
                command.Parameters.Add("@cod", MySqlDbType.VarChar).Value = cod;
                command.ExecuteNonQuery();
                return true;
            } catch
            {
                return false;
            }
        }

        [HttpPost]
        public ActionResult editBill(Bill bill)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    MySqlCommand command = new MySqlCommand("update Conta set cod_cli=@codcli, data_venc=DATE_FORMAT(STR_TO_DATE(@datav, '%d/%m/%Y'), '%Y-%m-%d'), desc_con=@nome, valor_con=@valor, tipo_con=@tipo where cod_conta=@codconta", database.Conectar());
                    command.Parameters.Add("@codcli", MySqlDbType.VarChar).Value = bill.cliente;
                    command.Parameters.Add("@codconta", MySqlDbType.VarChar).Value = bill.codconta;
                    command.Parameters.Add("@datav", MySqlDbType.VarChar).Value = bill.datav;
                    command.Parameters.Add("@nome", MySqlDbType.VarChar).Value = bill.nome;
                    command.Parameters.Add("@valor", MySqlDbType.VarChar).Value = bill.valor.Replace(',', '.');
                    command.Parameters.Add("@tipo", MySqlDbType.VarChar).Value = bill.tipo;
                    command.ExecuteNonQuery();
                    return RedirectToAction("True");
                }
                else return View("NewBill", bill);
            }
            catch
            {
                return View("NewBill", bill);
            }
            finally
            {
                database.Desconectar();
            }
        }

        public string Customers(string cod)
        {
            MySqlCommand command = new MySqlCommand("select cod_cli, nome_cli, cpf_cli from Cliente where cod_func=@cod order by nome_cli asc", database.Conectar());
            command.Parameters.Add("@cod", MySqlDbType.VarChar).Value = cod;

            MySqlDataReader reader = command.ExecuteReader();
            if (reader.HasRows)
            {
                string json = "[";
                while (reader.Read())
                {
                    json += ", {" + string.Format(@"""codigo"":{0}, ""nome"":""{1}"", ""cpf"":""{2}""", reader["cod_cli"], reader["nome_cli"], reader["cpf_cli"]) + "}";
                }
                return json + "]";
            }
            else return "false";
        }

        public string getCustomers(string cod)
        {
            MySqlCommand command = new MySqlCommand("select cod_cli, nome_cli from Cliente where cod_func=@cod order by nome_cli asc", database.Conectar());
            command.Parameters.Add("@cod", MySqlDbType.VarChar).Value = cod;
            MySqlDataReader reader = command.ExecuteReader();
            if (reader.HasRows)
            {
                string json = "[";
                while (reader.Read())
                {
                    json += ", {" + string.Format(@"""codigo"":{0}, ""nome"":""{1}""", reader["cod_cli"], reader["nome_cli"]) + "}";
                }
                return json + "]";
            }
            else return "false";
        }

        [HttpPost]
        public ActionResult NewCustomer(Customer customer)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    MySqlCommand command = new MySqlCommand("call InsereCli(@codfunc, @nome, DATE_FORMAT(STR_TO_DATE(@datan, '%d/%m/%Y'), '%Y-%m-%d'), @cpf, @email, @endereco)", database.Conectar());
                    command.Parameters.Add("@codfunc", MySqlDbType.VarChar).Value = customer.codfunc;
                    command.Parameters.Add("@nome", MySqlDbType.VarChar).Value = customer.nome;
                    command.Parameters.Add("@datan", MySqlDbType.VarChar).Value = customer.data;
                    command.Parameters.Add("@cpf", MySqlDbType.VarChar).Value = customer.cpf;
                    command.Parameters.Add("@email", MySqlDbType.VarChar).Value = customer.email;
                    command.Parameters.Add("@endereco", MySqlDbType.VarChar).Value = customer.endereco;

                    string reader = command.ExecuteScalar().ToString();
                    if(reader == "Deu bom") return RedirectToAction("True");
                    else return RedirectToAction("False");
                }
                else return View(customer);
            }
            catch
            {
                return View(customer);
            }
            finally
            {
                database.Desconectar();
            }
        }

        public bool deleteCustomer(string cod)
        {
            try
            {
                MySqlCommand command = new MySqlCommand("delete from Cliente where cod_cli=@cod", database.Conectar());
                command.Parameters.Add("@cod", MySqlDbType.VarChar).Value = cod;
                command.ExecuteNonQuery();
                return true;
            }
            catch
            {
                return false;
            }
        }

        [HttpPost]
        public ActionResult editCustomer(Customer customer)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    MySqlCommand command = new MySqlCommand("update Cliente set nome_cli=@nome, data_nasc=DATE_FORMAT(STR_TO_DATE(@data, '%d/%m/%Y'), '%Y-%m-%d'), cpf_cli=@cpf, email_cli=@email, endereco_cli=@endereco where cod_cli=@codcli", database.Conectar());
                    command.Parameters.Add("@codcli", MySqlDbType.VarChar).Value = customer.codcli;
                    command.Parameters.Add("@nome", MySqlDbType.VarChar).Value = customer.nome;
                    command.Parameters.Add("@data", MySqlDbType.VarChar).Value = customer.data;
                    command.Parameters.Add("@cpf", MySqlDbType.VarChar).Value = customer.cpf;
                    command.Parameters.Add("@email", MySqlDbType.VarChar).Value = customer.email;
                    command.Parameters.Add("@endereco", MySqlDbType.VarChar).Value = customer.endereco;
                    command.ExecuteNonQuery();
                    return RedirectToAction("True");
                }
                else return View("NewCustomer", customer);
            }
            catch
            {
                return View("NewCustomer", customer);
            }
            finally
            {
                database.Desconectar();
            }
        }

        [HttpGet]
        public string getCustomer(string cod)
        {
            MySqlCommand command = new MySqlCommand("select * from Cliente where cod_cli=@cod", database.Conectar());
            command.Parameters.Add("@cod", MySqlDbType.VarChar).Value = cod;

            MySqlDataReader reader = command.ExecuteReader();
            if (reader.HasRows)
            {
                string json = "";
                while (reader.Read())
                {
                    json += "{" + string.Format(@"""codigo"":{0}, ""nome"":""{1}"", ""data"":""{2}"", ""cpf"":""{3}"", ""email"":""{4}"", ""endereco"":""{5}""", reader["cod_cli"], reader["nome_cli"], reader["data_nasc"], reader["cpf_cli"], reader["email_cli"], reader["endereco_cli"]) + "}";
                }
                return json;
            }
            else return "false";
        }
    }
}