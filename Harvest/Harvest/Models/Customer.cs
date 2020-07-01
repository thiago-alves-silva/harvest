using System.ComponentModel.DataAnnotations;

namespace Harvest.Models
{
    public class Customer
    {
        [Required(ErrorMessage = "Campo obrigatório!", AllowEmptyStrings = false)]
        [StringLength(100, MinimumLength = 4, ErrorMessage = "O nome deve conter pelo menos 4 caracteres!")]
        [Display(Name = "Nome")]
        public string nome { get; set; }

        [Required(ErrorMessage = "Campo obrigatório!", AllowEmptyStrings = false)]
        [Display(Name = "E-mail")]
        public string email { get; set; }

        [Required(ErrorMessage = "Campo obrigatório!", AllowEmptyStrings = false)]
        [StringLength(15, MinimumLength = 12, ErrorMessage = "Formato de CPF inválido!")]
        [Display(Name = "CPF")]
        public string cpf { get; set; }

        [Required(ErrorMessage = "Campo obrigatório!", AllowEmptyStrings = false)]
        [DisplayFormat(DataFormatString = "dd/mm/yyyy")]
        [Display(Name = "Data de nascimento")]
        public string data { get; set; }

        [Required(ErrorMessage = "Campo obrigatório!", AllowEmptyStrings = false)]
        [Display(Name = "Endereço")]
        public string endereco { get; set; }

        public string codfunc { get; set; }

        public string codcli { get; set; }
    }
}