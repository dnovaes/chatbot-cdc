var showDivTermoConsentimento = () =>{

  let divOverlay = document.querySelector(".overlay");
  divOverlay.style.display = "block";

  let divTermo = document.querySelector(".divTermo");
  /*
   * "In Javascript you can check tow string for values same as integers so you can do this:
   *  A < B, A == B, A > B
   */
  if(divTermo.style.display == "none"){
    divTermo.style.display = "block";
  }else{
    divTermo.style.display = "none";
  }
}


