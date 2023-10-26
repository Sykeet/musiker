import fs from 'fs'
export default class Band {
  bandLista = []
  constructor() {
    this.fetchData()
    this.newBand = new NewBand();
  }

  fetchData() {
    const jsonString = fs.readFileSync("band.json");
    const data = JSON.parse(jsonString);

    for (let i = 0; i < data.length; i++) {
      this.bandLista.push(data[i]);
    }
  }
  skapaEttBand(bandNamn, bandAge, musikerID, musikerNamn, instrument,) {
    const newBand = new NewBand(bandNamn, bandAge, musikerID, musikerNamn, instrument);
    this.bandLista.push(newBand.dataInfo())
    return newBand.dataInfo().bandID;
  }

  skrivTillJson() {
    fs.writeFileSync('./band.json', JSON.stringify(this.bandLista, null, 2), (err) => {
      if (err) throw err;
      console.log('artist data writen to file')
    })
  }

  ongoingBand() {
    const temp = [];
    for (let i = 0; i < this.bandLista.length; i++) {
      if (this.bandLista[i].dissolved === null) {
        temp.push({ bandID: this.bandLista[i].bandID, bandNamn: this.bandLista[i].name, index: i })
      }
    }
    return temp;
  }

  displayOngoingBand() {
    const temp = this.ongoingBand();
    if (temp.length != 0) {
      for (let i = 0; i < temp.length; i++) {
        console.log(`${i}. ${temp[i].bandNamn}`)
      }
    }
    return temp;
  }

  displayCurrentMember(bandIndex) {
    const band = this.bandLista[bandIndex].currentBand;
    const currentMember = [];
    for (let i = 0; i < band.length; i++) {
      console.log(`${i}. ${band[i].memberName} ${band[i].instrument}`)
      currentMember.push(band[i].memberID);
    }
    return currentMember;
  }

  editBand(index, musikerID, musikerNamn, instrument, datum) {
    this.bandLista[index].currentBand.push({ memberID: musikerID, memberName: musikerNamn, instrument: instrument, joined: datum })
  }

  currentToPrevious(bandIndex, musikerID, date) {
    const member = this.bandLista[bandIndex].currentBand.find(x => x.memberID === musikerID);
    member["dateItLeft"] = date;

    this.bandLista[bandIndex].previusBand.push(member);
    this.bandLista[bandIndex].currentBand.splice(this.bandLista[bandIndex].currentBand.findIndex(x => x.memberID === musikerID), 1)
    if (this.bandLista[bandIndex].currentBand.length === 0) {
      this.bandLista[bandIndex].dissolved = date;
    }
  }

taBortBand(bandID) {
  const bandIndex = this.bandLista.findIndex(band => band.bandID === bandID);
  if (bandIndex === -1) {
    return false;
  }

  const borttagetBand = this.bandLista[bandIndex];
  let tidigareBand = [];

  if (fs.existsSync('./tidigareBand.json')) {
    tidigareBand = JSON.parse(fs.readFileSync('./tidigareBand.json', 'utf-8'));
  }

  tidigareBand.push(borttagetBand);
  fs.writeFileSync('./tidigareBand.json', JSON.stringify(tidigareBand, null, 2), 'utf-8');

  this.bandLista.splice(bandIndex, 1);

  return true;
}
}

class NewBand {
  constructor(bandNamn, bandAge, musikerID, musikerNamn, instrument) {
    this.name = bandNamn;
    this.age = bandAge;
    this.musikerID = musikerID;
    this.musikerNamn = musikerNamn;
    this.instrument = instrument;
  }
  dataInfo() {
    return {
      bandID: 'id' + new Date().getTime(),
      name: this.name,
      age: this.age,
      currentBand: [{ memberID: this.musikerID, memberName: this.musikerNamn, instrument: this.instrument, joined: this.age }],
      previusBand: [],
      instrument: [],
      dissolved: null
    };
  }
}