using System.ComponentModel.DataAnnotations;

namespace Harvest.Models
{
    public class User
    {
        [Required(ErrorMessage = "Campo obrigatório!", AllowEmptyStrings = false)]
        [StringLength(100, MinimumLength = 4, ErrorMessage ="O nome deve conter pelo menos 4 caracteres!")]
        [Display(Name = "Nome")]
        public string nome { get; set; }

        [Required(ErrorMessage = "Campo obrigatório!", AllowEmptyStrings = false)]
        [Display(Name = "E-mail")]
        public string email { get; set; }

        [Required(ErrorMessage = "Campo obrigatório!", AllowEmptyStrings = false)]
        [StringLength(15, MinimumLength = 14, ErrorMessage = "Formato de telefone inválido!")]
        [Display(Name = "Telefone")]
        public string tel { get; set; }

        [Required(ErrorMessage = "Campo obrigatório!", AllowEmptyStrings = false)]
        [StringLength(15, MinimumLength = 12, ErrorMessage = "Formato de CPF inválido!")]
        [Display(Name = "CPF")]
        public string cpf { get; set; }

        [Required(ErrorMessage = "Campo obrigatório!", AllowEmptyStrings = false)]
        [DisplayFormat(DataFormatString = "dd/mm/yyyy")]
        [Display(Name = "Data de nascimento")]
        public string data { get; set; }

        [Required(ErrorMessage = "Campo obrigatório!", AllowEmptyStrings = false)]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "A senha deve conter pelo menos 6 digitos!")]
        [DataType(DataType.Password)]
        [Display(Name = "Senha")]
        public string senha { get; set; }

        [Required(ErrorMessage = "Campo obrigatório!", AllowEmptyStrings = false)]
        [Compare("senha", ErrorMessage ="As senhas não coincidem!")]
        [DataType(DataType.Password)]
        [Display(Name = "Confirmar senha")]
        public string csenha { get; set; }

        public string codfunc { get; set; }
    }
}