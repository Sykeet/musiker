import fs from 'fs'

export default class Musiker{
  musikerLista = []
  constructor() {
    this.fetchData()
  }
  
  fetchData() {
    const jsonString = fs.readFileSync("musiker.json");
    const data = JSON.parse(jsonString);

    for (let i = 0; i < data.length; i++) {
      this.musikerLista.push(data[i]);
    }
  }

  skapaMusiker(name, age, info)
  {
    const newMusiker = new NewMusiker(name, age, info);
    this.musikerLista.push(newMusiker.dataInfo())
    this.skrivTillJson();
  }
  skrivTillJson() {
    fs.writeFileSync('./musiker.json', JSON.stringify(this.musikerLista, null, 2), (err) => {
      if (err) throw err;
      console.log('artist data writen to file')
    })
  }

  visaAllaMusiker() {
    for (let i = 0; i < this.musikerLista.length; i++) {
      console.log (`${i}. ${this.musikerLista[i].name} ${this.musikerLista[i].age}`)
    }
  }
  
  visaEnMusiker(val) {
    console.log (this.musikerLista[val])
  }
}
class NewMusiker{
  constructor(name, age, info) {
    this.name = name
    this.age = age
    this.info = info
  }
  dataInfo() {
    return {
      musikerID: 'id' + new Date().getTime(),
      name: this.name,
      age: this.age,
      info: this.info,
      currentBand: [],
      previusBand: [],
      instrument: []
    };
  }
}