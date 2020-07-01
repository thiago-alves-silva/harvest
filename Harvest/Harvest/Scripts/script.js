import {validarInput, msgAlert} from "./validations.js";

if(sessionStorage.page) changePage("/Home/Dashboard")
else changePage("/Home/Home")

const element = selector => document.querySelector(selector)
const elements = selector => document.querySelectorAll(selector)
const fetchRequest = async view => await(await fetch(`../Home/${view}`)).text()

const dashboardPageLinks = [
  ['contas', 'BillsPage'],
  ['clientes', 'CustomersPage']
]
const pageFunctions = [
  ['BillsPage', getList, 'Bills'],
  ['CustomersPage', getList, 'Customers']
]
const submitPages = [
  ["register", { route: "Register", method: "POST" }],
  ["login", { route: "LoginUser", method: "GET" }],
  ["customer", { route: "NewCustomer", method: "POST" }],
  ["customerEdit", { route: "editCustomer", method: "POST" }],
  ["bill", { route: "NewBill", method: "POST" }],
  ["billEdit", { route: "editBill", method: "POST" }]
]
const insertionRoutes = [
  ['Register'],
  ['NewBill', getList, 'Bills'],
  ['NewCustomer', getList, 'Customers']
]
const editingRoutes = [
  ['editBill', getList, 'Bills'],
  ['editCustomer', getList, 'Customers'],
  ['config', null, null]
]
const requestedContent = [
  ['login', 'Login'],
  ['register', 'Register'],
  ['join', 'Register'],
  ['know-more', 'KnowMore'],
  ['NewBill', 'NewBill', getCustomerOptions],
  ['editBill', 'NewBill', getCustomerOptions],
  ['NewCustomer', 'NewCustomer'],
  ['editCustomer', 'NewCustomer'],
  ['config', 'Register', getEmployeeData]
]
const dataFormAndSession = [
  ['getBill', setDataFormBill, 'edit_bill'],
  ['getCustomer', setDataFormCustomer, 'edit_customer']
]
let futureBills = "", pastBills = ""

async function changePage(url) {
  const page = document.createElement('div')
  page.innerHTML = await(await fetch(location.origin + url)).text()
  const replaces = [['head','title'], ['body','style'], ['body','section'], ['.header', '.account']]
  replaces.forEach(e => element(e[0]).replaceChild(page.querySelector(e[1]), element(e[1])))

  if(url.indexOf("Dashboard") !== -1) {
    element('.dashboard-container').classList.remove('load')
    setSectionOnDashboard('BillsPage')
    changeSectionDashboard()
  }
  else scriptHome()
}

async function callPopUp(e) {
  e.preventDefault()
  const windowPopUp = document.createElement('div')
  windowPopUp.classList.add('pop-up')
  windowPopUp.innerHTML = '<div class="container load"><button id="close-pop-up"></button></div>'
  windowPopUp.querySelector('#close-pop-up').addEventListener('click', () => element('.pop-up').remove())
  document.body.appendChild(windowPopUp)
  await callContent(e.target.dataset.request)
}

async function callContent(dataset) {
  const content = document.createElement('div')
  const container = element('.container')
  
  let route, afterFunction;
  requestedContent.forEach(e => {
    if(e[0] === dataset) {
      route = e[1]
      if(e[2]) afterFunction = e[2]
    }
  })
  content.innerHTML = await fetchRequest(route)
  editingRoutes.forEach(e => {
    if(e[0] === dataset) {
      const button = content.querySelector('button')
      button.innerHTML = "Alterar"
      button.value += "Edit"
    }
  })
  container.classList.remove('load')
  container.appendChild(content)
  if(afterFunction) afterFunction()
  spanAnimation()
  onSubmit()
}

async function setSectionOnDashboard(page) {
  const container = element('.dashboard-container')
  container.classList.add('load')
  container.innerHTML = ""
  container.innerHTML = await fetchRequest(page)
  pageFunctions.forEach(e => { if(e[0] === page) e[1](e[2]) })
  scriptDashboard()
  container.classList.remove('load')
}

function changeSectionDashboard() {
  elements('[data-link]').forEach((link, i, a) => link.addEventListener('click', () => {
    a.forEach(e => e.classList.remove('active'))
    link.classList.add('active')

    dashboardPageLinks.forEach(item => {
      if(item[0] === link.dataset.link) {
        setSectionOnDashboard(item[1])
        return true
      }
    })
  }))
}

function onSubmit() { // CHAMA A VALIDAÇÃO DAS INPUTS E INSERE A MENSAGEM AO ENVIAR O FORMULÁRIO
  const forms = Array.from(document.forms)

  forms.forEach(e=>e.addEventListener('submit', async e => {
    e.preventDefault()
    const btnSubmit = e.target.querySelector('button[type="submit"]')
    //if (allowSubmit()) {
    if (true) {
      const form = e.target
      let route, options = {}, params = {};
      btnSubmit.classList.add('load')

      submitPages.forEach(e => {
        if(e[0] == btnSubmit.value) {
          route = e[1].route
          options.method = e[1].method
          return true
        }
      })

      const url = new URL(location.origin + "/Home/" + route)
      if(options.method === "GET") {
        const counterLimit = form.childElementCount - 1
        for(let i = 0; i < counterLimit; i++) params[form[i].name] = form[i].value
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
      } 
      else if(options.method === "POST") {
        const extraDataForEditingMethods = [
          ['editBill', 'codconta', sessionStorage.edit_bill],
          ['editCustomer', 'codcli', sessionStorage.edit_customer],
          ...insertionRoutes
        ]
        console.log('rota: ', route, extraDataForEditingMethods)
        const formData = new FormData(form)
        extraDataForEditingMethods.forEach(e => {
          if(e[0] === route) {
            if(!formData.has('codfunc'))
              formData.append('codfunc', JSON.parse(sessionStorage.user).cod)
            formData.append(e[1], e[2]); 
            return true 
          }
        })
        options.body = formData
      }

      const insert = await (await fetch(url, options)).text()
      resultRequest(insert, route, form, btnSubmit)
    }
  }))

  function allowSubmit() {
    const inputs = elements('input[name].validate')
    inputs.forEach(e=>{
      functionBlur(e)
      e.addEventListener('change', () => functionBlur(e))
    })
    function functionBlur(e) {
      if(validarInput(e) != true) e.classList.add('invalid')
      else e.classList.remove('invalid')
      msgAlert(validarInput(e), e)
    }
    const validation = Array.from(inputs).map(e => ({e, isValid: !e.classList.contains('invalid')}))
    return validation.every(e => e.isValid)
  }
}

function resultRequest(result, route, form, button) {
  console.log(result, route) // lembrar de tirar
  const sucess = result === "True"

  const resultMsg = document.createElement('h1')
  sucess ? resultMsg.classList.add('success') : resultMsg.classList.add('fail')

  button.classList.remove('load')

  if(sucess && insertionRoutes.some(e => e[0] === route)) {
    form.reset()
    elements('.alerta').forEach(e => e.innerHTML = "")
    insertionRoutes.forEach(e => { if(e[0] === route && e[1]) e[1](e[2]) })
    resultMsg.innerText = "Registro realizado com sucesso"
  }
  else if(!sucess && (insertionRoutes.some(e => e[0] === route) || editingRoutes.some(e => e[0] === route))) {
    const page = document.createElement('div')
    page.innerHTML = result

    const span = page.querySelectorAll('span.alerta')
    const inputs = form.querySelectorAll('span.alerta')
    console.log(span, inputs)
    if(span.length && inputs.length) {
      for(let i = 0; i < (inputs.length); i++) inputs[i].innerHTML = span[i].innerHTML
    }
    if(result === "False") resultMsg.innerText = "Registro já encontrado!"
  }
  else if(sucess && editingRoutes.some(e => e[0] === route)) {
    sessionStorage.removeItem('edit_bill')
    sessionStorage.removeItem('edit_customer')
    element('.pop-up').remove()
    editingRoutes.forEach(e => {
      if(e[0] === route && e[1]) e[1](e[2])
    })
  }
  else if(route == "LoginUser") {
    try {
      const objectUser = JSON.parse(result)
      element('.pop-up').remove()
      changePage("/Home/Dashboard")
      sessionStorage.user = `{"cod": ${objectUser.cod}, "username": "${objectUser.user}"}`
    } catch {
        form.reset()
        resultMsg.innerText = "Usuário não encontrado!"
    }
  }
  else console.log('Resultado inesperado')

  if(button.nextElementSibling) button.nextElementSibling.remove()
  if(resultMsg.innerHTML) button.insertAdjacentElement('afterend', resultMsg)
}

async function getList(route) {
  const customers = await fetchRequest(`${route}?cod=${JSON.parse(sessionStorage.user).cod}`)
  const objectCustomers = JSON.parse(customers.replace(', ', ''))
  if(objectCustomers) {
    const listType = [
      ['Bills', setBills],
      ['Customers', setCustomers]
    ]
    listType.forEach(e => { if(e[0] === route) e[1](objectCustomers) })
  }
}

function setBills(objectBills) {
  element('.container-bills').innerHTML = objectBills.reduce((a, e) => {
    const tipo = e.tipo === 'R' ? 'increase' : 'decrease'
    return a +
    `<div class="bill-item" data-cod=${e.codigo}>
      <span class="name">${e.cliente}</span>
      <span class="due-date">${e.datav.slice(0, e.datav.indexOf(' '))}</span>
      <span class="identifier">${e.identificacao}</span>
      <span class="bill-name ${tipo}">${e.titulo}</span>
      <i class="edit" title="Editar conta" data-request="editBill"></i>
      <i class="delete" title="Deletar conta"></i>
      <span class="bill-value ${tipo}">R$ ${Number(e.valor.replace(',', '.')).toFixed(2).replace('.', ',')}</span>
    </div>`
  }, "")
  editButtons('getBill')
  deleteButtons('deleteBill', 'Bills')
}

function setCustomers(objectCustomers) {
  element('.container-bills').innerHTML = objectCustomers.reduce((a, e) => a +
    `<div class="bill-item" data-cod=${e.codigo}>
      <span class="name">${e.nome}</span>
      <i class="edit" title="Editar conta" data-request="editCustomer"></i>
      <i class="delete" title="Deletar conta"></i>
      <span class="identifier">${e.cpf}</span>
    </div>`, "")
  editButtons('getCustomer')
  deleteButtons('deleteCustomer', 'Customers')
}

function deleteButtons(route, list) {
  const deleteButtons = document.querySelectorAll('i.delete')
  deleteButtons.forEach(e => e.addEventListener('click', async () => {
    if(confirm("Deseja deletar o esta conta?")) {
      const cod = e.parentElement.dataset.cod
      const request = await fetchRequest(`${route}?cod=${cod}`)
      if(request === "True") getList(list)
      else alert("O cliente possui contas vinculadas ao sistema!")
    }
  }))
}

function editButtons(route) {
  const editButtons = document.querySelectorAll('i.edit')
  editButtons.forEach(e => e.addEventListener('click', async event => {
    await callPopUp(event)
    const cod = e.parentElement.dataset.cod
    const data = await fetchRequest(`${route}?cod=${cod}`)
    
    dataFormAndSession.forEach(async function(e) {
      if(e[0] === route) {
        sessionStorage.setItem(e[2], cod)
        e[1](JSON.parse(data))
        spanAnimation()
      }
    })
  }))
}

async function setDataFormBill(data) {
  const form = document.querySelector('form')
  form.nome.value = data.nome
  form.valor.value = Number(data.valor.replace(',', '.')).toFixed(2).replace('.', ',')
  form.datav.value = data.datav.substring(0, data.datav.indexOf(' '))
  data.tipo === "P" ? form.tipoP.checked = true : form.tipoR.checked = true
  element(`option[value="${data.codcli}"]`).setAttribute('selected', '')
}

function setDataFormCustomer(data) {
  let form = document.forms[0]
  form.nome.value = data.nome
  form.cpf.value = data.cpf
  form.data.value = data.data.substring(0, data.data.indexOf(' '))
  form.email.value = data.email
  form.endereco.value = data.endereco
}

function setDataFormEmployee(data) {
  let form = document.forms[0]
  form.nome.value = data.nome
  form.email.value = data.email
  form.tel.value = data.telefone
  form.cpf.value = data.cpf
  form.data.value = data.datan.substring(0, data.datan.indexOf(' '))
  spanAnimation()
}

async function getCustomerOptions() {
  const customers = await (await fetchRequest(`getCustomers?cod=${JSON.parse(sessionStorage.user).cod}`)).replace(', ', '')
  const jsonCustomers = JSON.parse(customers)
  if(jsonCustomers) {
    element('select#cliente').innerHTML = jsonCustomers.reduce((a, e) =>
      a + `<option value="${e.codigo}">${e.nome}</option>`, ``)
  }
}

async function getEmployeeData() {
  const customers = await fetchRequest(`getRegister?cod=${JSON.parse(sessionStorage.user).cod}`)
  setDataFormEmployee(JSON.parse(customers))
}

function scriptHome() { // CHAMA OS MÉTODOS NECESSÁRIOS PARA O FUNCIONAMENTO DA TELA HOME
  splitPhrase()
  actionLinks()
}

function scriptDashboard() { // CHAMA OS MÉTODOS NECESSÁRIOS PARA O FUNCIONAMENTO DA DASHBOARD
  if(!sessionStorage.page) sessionStorage.page = `{"page": "Dashboard", "time": ${new Date().getTime()}}`

  let verifySessionStorage = setInterval(() => {
    const time = new Date() - JSON.parse(sessionStorage.page).time >= 3600000
    if(sessionStorage.page && time) {
      clearInterval(verifySessionStorage)
      sessionStorage.removeItem('page')
      location.reload()
      alert("Sua sessão acabou, faça login novamente!")
    }
  }, 10000)

  const btnFilterBills = elements('[data-filter]')
  btnFilterBills.forEach((e,i,a) => e.addEventListener('click', () => filterBills(a, e)))

  const btnAdd = element('button[data-request]')
  if(btnAdd) btnAdd.addEventListener('click', callPopUp)
  
  const searchBar = element('#search-bar')
  searchBar.addEventListener('keyup', searchBills)
  menuProfile()
}

function splitPhrase() { // QUEBRA A FRASE DE APRESENTAÇÃO PALAVRA POR PALAVRA
  const style = 'style="padding-top: 60px; max-height: 60px"'
  const phrase = element('.informations h1')
  phrase.outerHTML = `<h1 ${style}>${phrase.innerHTML.split(' ').join(`<h1 ${style}>`)}</h1>`
  animationText(Array.from(element('.phrase').children))
}
function animationText(words) { // ANIMAÇÃO DO TEXTO DA TELA DE APRESENTAÇÃO
  words.forEach((e,i) => setTimeout(()=> e.style.paddingTop = '0', 200*(i)))
}
function actionLinks() { // DÁ FUNÇÃO AOS BOTÕES DA TELA HOME
  const links = [".login-btn", ".register-btn", ".know-more", ".join"]
  links.forEach(e => element(e).addEventListener('click', e => callPopUp(e)))
}

function filterBills(array, button) {
  array.forEach(e => e.classList.remove('active'))
  button.classList.add('active')

  const container = element('.container-bills')
  const currentDate = new Date().setHours(0,0,0,0)
  const bills = Array.from(elements('.bill-item')).map(element => {
    const date = element.querySelector('.due-date').innerHTML.split('/')
    return { date: new Date(date[2], date[1]-1, date[0]), element }
  })
  if(!futureBills && !pastBills)
    bills.forEach(e => e.date >= currentDate ? futureBills += e.element.outerHTML : pastBills += e.element.outerHTML)
  button.value === "venturo" ? container.innerHTML = futureBills : container.innerHTML = pastBills
  editButtons('getBill')
  deleteButtons('deleteBill')
}

let bills = ""
function searchBills(event) {
  const searchedText = event.target.value
  if(!bills) bills = elements('.bill-item')
  const objectBills = Array.from(bills).map(e => {
    return {
      element: e,
      nome: e.querySelector('.name').innerText.toLowerCase(),
      cpf: e.querySelector('.identifier').innerText.toLowerCase()
    }
  })
  const returnedElements = objectBills.filter(e => {
    const condition = e.nome.includes(searchedText) || e.cpf.includes(searchedText)
    if(condition) return e.element.outerHTML
  })
  console.log(returnedElements)
}

function menuProfile() {
  const profileImage = element('.account > img')
  const links = elements('.profile-menu a')
  if(profileImage) profileImage.addEventListener('click', () => element('.profile-menu').classList.toggle('active'))
  links.forEach(e => e.addEventListener('click', optionsMenu))
}
async function optionsMenu(event) {
  event.preventDefault()

  const optionsMenu = [
    ['sair', 'Logout', clearSession, false],
    ['config', 'editRegister', null, true]
  ]

  const reference = event.target.dataset.request
  let route, afterFunction;
  optionsMenu.forEach(async e => {
    if(e[0] === reference) {
      route = e[1]
      if(e[2]) afterFunction = e[2]
      if(e[3]) await callPopUp(event)
    }
  })
  if(afterFunction) afterFunction(await fetchRequest(route))
}

function clearSession(request) {
  if(request === "True") {
    sessionStorage.clear()
    changePage("/Home/Home")
  } else console.log('Erro ao sair da conta!')
}

function spanAnimation() { // EFEITO NA <SPAN> AO FOCAR E DESFOCAR A INPUT DE CADASTRO
  const inputs = elements('input[type="text"], input[type="password"]')
  if(inputs) inputs.forEach(e => checkValue(e))
}
function checkValue(e) { // VERIFICA SE A INPUT POSSUI VALOR PARA INSERIR A CLASSE
  if(e.value) e.previousElementSibling.classList.add('focus')
  e.addEventListener('focus', onFocus)
}
function onFocus() { // AO FOCAR NA INPUT, OCORRE UMA ANIMAÇÃO NO SPAN DA INPUT
  if(!this.value) {
    this.previousElementSibling.classList.add('focus')
    this.addEventListener('blur', onBlur)
  }
}
function onBlur() { // AO DESFOCAR DA INPUT, OCORRE UMA ANIMAÇÃO NO SPAN DA INPUT
  if(!this.value) {
    this.previousElementSibling.classList.remove('focus')
    this.removeEventListener('blur', onBlur)
  }
}