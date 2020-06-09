(()=>{
  console.log("IIFE funcionando")

  function splitPhrase() { // QUEBRA A FRASE DE APRESENTAÇÃO PALAVRA POR PALAVRA
    const style = 'style="padding-top: 60px; max-height: 60px"'
    const phrase = document.querySelector('.informations h1')
    phrase.outerHTML = `<h1 ${style}>${phrase.innerHTML.split(' ').join(`<h1 ${style}>`)}</h1>`
    animationText(Array.from(document.querySelector('.phrase').children))
  }
  //splitPhrase()

  function animationText(words) { // ANIMAÇÃO DO TEXTO DA TELA DE APRESENTAÇÃO
    words.forEach((e,i) => setTimeout(()=> e.style.paddingTop = '0', 200*(i)))
  }
})()