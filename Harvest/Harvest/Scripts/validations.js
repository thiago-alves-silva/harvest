export function validarInput(input){ // VERIFICA AS INFORMAÇÕES CONTIDAS NAS INPUTS
  if(!input.value.trim().length) return 'Campo obrigatório!'
  else if(input.id == 'email' || input.id == 'login') return validarEmail(input.value)
  else if(input.id == 'cpf') {
    if(!validarCPF(input.value)) return 'CPF Inválido!'
  }
  else if(input.id == 'nome') {
    if(/[0-9]/.test(input.value)) return 'Nome Inválido!'
  }
  else if(input.id == 'senha') {
    if(input.value.length < 6) return 'A senha deve conter no mínimo 6 digitos!'
  }
  else if(input.id == 'csenha') {
    if(input.value != document.querySelector('#senha').value) return 'As senhas não coincídem!'
    else if(input.value.length < 6) return 'A senha deve conter no mínimo 6 digitos!'
  }
  else if(input.id == 'tel') {
    //tirar parenteses e hífens da máscara do jQuery
    if(isNaN(input.value)) return "Telefone Inválido!"
    else if(input.value.length > 11 || input.value.length < 10) return  "O telefone deve conter entre 10 ou 11 dígitos"
  }
  return true
}

export function validarCPF(cpf) { // FÓRMULA MATEMÁTICA PARA COMPROVAR A VERACIDADE DO CPF
  cpf = cpf.replace(/[^\d]+/g,'');
  if(cpf == '' || cpf.length != 11 || cpf == "00000000000" || cpf == "11111111111" || cpf == "22222222222" || cpf == "33333333333" || cpf == "44444444444" || cpf == "55555555555" || cpf == "66666666666" || cpf == "77777777777" || cpf == "88888888888" || cpf == "99999999999") return false;	// Elimina CPFs invalidos conhecidos
  let add = 0; // Valida 1º digito
  for (let i=0; i < 9; i ++) add += parseInt(cpf.charAt(i)) * (10 - i);	
  let rev = 11 - (add % 11);	
  if (rev == 10 || rev == 11)	rev = 0;	
  if (rev != parseInt(cpf.charAt(9)))	return false;		
  add = 0; // Valida 2º digito
  for (let i = 0; i < 10; i ++) add += parseInt(cpf.charAt(i)) * (11 - i);	
  rev = 11 - (add % 11);	
  if (rev == 10 || rev == 11)	rev = 0;	
  if (rev != parseInt(cpf.charAt(10))) return false;		
  return true;   
}

export function validarEmail(email) { // VERIFICA SE O TEXTO INSERIDO CONTÉM OS REQUISITOS DE UM E-MAIL
  const user = email.substring(0, email.indexOf("@"));
  const domain = email.substring(email.indexOf("@")+ 1, email.length);
  if (!((user.length >=1) && (domain.length >=3) && (user.search("@")==-1) && (domain.search("@")==-1) && (user.search(" ")==-1) && (domain.search(" ")==-1) && (domain.search(".")!=-1) && (domain.indexOf(".") >=1) && (user.indexOf(".") != 0) && (domain.lastIndexOf(".") < domain.length - 1))) return 'E-mail Inválido!'
  else return true
}

export function msgAlert(txt, e) { // FUNÇÃO QUE INSERE A MENSAGEM DE ERRO ABAIXO DAS INPUTS
  const span = e.parentNode.querySelector('.alerta')
  if(txt===true) {
      if(span) span.remove()
  }
  else {
      if(!span) {
          const alertP = document.createElement('span')
          alertP.classList.add('alerta')
          alertP.innerText = txt
          e.parentNode.insertBefore(alertP, e.nextElementSibling)
      }
      else span.innerHTML = txt
  }
}