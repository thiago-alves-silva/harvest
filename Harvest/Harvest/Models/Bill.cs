using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Harvest.Models
{
    public class Bill
    {
        [Display(Name = "Nome do cliente")]
        public string cliente { get; set; }

        [Required(ErrorMessage = "Campo obrigatório!", AllowEmptyStrings = false)]
        [Display(Name = "Nome da conta")]
        public string nome { get; set; }

        [Required(ErrorMessage = "Campo obrigatório!", AllowEmptyStrings = false)]
        [Display(Name = "Valor")]
        public string valor { get; set; }

        [Required(ErrorMessage = "Campo obrigatório!", AllowEmptyStrings = false)]
        [Display(Name = "Data de vencimento")]
        public string datav { get; set; }
        
        public string tipo { get; set; }

        public string codfunc { get; set; }

        public string codconta { get; set; }
    }
}