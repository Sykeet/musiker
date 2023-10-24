import PromptSync from "prompt-sync";
const prompt = PromptSync({sigint : true})
import Musiker from "./musiker.js";

const musiker = new Musiker();
console.log
  (`Meny:
  1. Lägg till musiker
  2. Visa en specifik Musiker`);

const alternativ = prompt();
switch (alternativ) {
  case "1":
    let musikerNamn = prompt("Vad heter musikern?")
    let age = prompt("Hur gammal är musikern?")
    let info = prompt("Information om musiker")
    musiker.skapaMusiker(musikerNamn, age, info);
    break;
  case "2":
    if (musiker.musikerLista.length <= 0) {
      console.log("Musiker finns inte!")
    }
    else {
      musiker.visaAllaMusiker();
      let val = prompt("skriv siffran på personen du vill se")

      if (val < 0 || val > musiker.musikerLista.length || isNaN(val)) {
        console.log("valet finns inte")
      } else {
        musiker.visaEnMusiker(val);
      }   
    }
    break;
  default:
    console.log("Valet finns ej");
}

