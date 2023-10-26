import fs from 'fs';
import Band from './band.js';

export default class Musiker {
  musikerLista = [];

  constructor() {
    this.fetchData();
    this.band = new Band();
  }

  fetchData() {
    try {
      const jsonString = fs.readFileSync("musiker.json", "utf-8");
      const data = JSON.parse(jsonString);

      if (!Array.isArray(data)) {
        console.error("Data i musiker.json är inte i förväntat format.");
        return;
      }

      for (let i = 0; i < data.length; i++) {
        this.musikerLista.push(data[i]);
      }
    } catch (error) {
      console.error("Ett fel inträffade när du försökte läsa från musiker.json:", error.message);
    }
  }

  skapaMusiker(name, age, info) {
    if (typeof name !== "string" || typeof age !== "number" || typeof info !== "string") {
      console.error("Ogiltiga parametrar.");
      return;
    }

    const newMusiker = new NewMusiker(name, age, info);
    this.musikerLista.push(newMusiker.dataInfo());
    this.skrivTillJson();
  }

  skrivTillJson() {
    try {
      fs.writeFileSync('./musiker.json', JSON.stringify(this.musikerLista, null, 2));
      console.log('Artist data written to file');
    } catch (err) {
      console.error('Ett fel inträffade när data skulle skrivas till musiker.json:', err.message);
    }
  }

  skrivTillTidigareMedlemmarJson(data) {
    try {
      fs.writeFileSync('./tidigareMedlemmar.json', JSON.stringify(data, null, 2));
      console.log('Tidigare medlem data skriven till fil');
    } catch (err) {
      console.error('Ett fel inträffade när data skulle skrivas till tidigareMedlemmar.json:', err.message);
    }
  }

  visaAllaMusiker() {
    if (!this.musikerLista || this.musikerLista.length === 0) {
      console.log("Inga musiker hittades.");
      return;
    }

    for (let i = 0; i < this.musikerLista.length; i++) {
      console.log(`${i}. ${this.musikerLista[i].name}`);
    }
  }

  visaEnMusiker(val) {
    if (this.musikerLista[val]) {
      console.log(this.musikerLista[val]);
    } else {
      console.error("Ingen musiker hittades med det angivna värdet.");
    }
  }

  skapaEttBand(val, instrument, bandNamn, bandAge) {
    const tempID = this.band.skapaEttBand(bandNamn, bandAge, this.musikerLista[val].musikerID, this.musikerLista[val].name, instrument);
    this.editMusikerLista(val, instrument, tempID, bandNamn, bandAge);
    this.band.skrivTillJson();
    this.skrivTillJson();
  }

  editMusikerLista(index, instrument, bandID, bandNamn, yearCreated) {
    if (!this.musikerLista[index].instrument.includes(instrument)) {
      this.musikerLista[index].instrument.push(instrument);
    }
    this.musikerLista[index].currentBand.push({ bandID: bandID, bandName: bandNamn, yearCreated: yearCreated });
  }

  addMTB(musikerIndex, instrument, bandID, bandName) {
    let date = new Date().getFullYear();
    this.editMusikerLista(musikerIndex, instrument, bandID, bandName, date);
    this.band.editBand(this.band.bandLista.findIndex(x => x.bandID === bandID), this.musikerLista[musikerIndex].musikerID, this.musikerLista[musikerIndex].name, instrument, date)
    this.band.skrivTillJson();
    this.skrivTillJson();
  }

  removeOneMusician(bandID, bandIndex, musikerID) {
    const date = new Date().toLocaleString();

    this.band.currentToPrevious(bandIndex, musikerID, date);
    this.currentToPrevious(this.musikerLista.findIndex(x => x.musikerID === musikerID), bandID, date);
    this.band.skrivTillJson();
    this.skrivTillJson()
  }

  currentToPrevious(musikerID, bandID, date) {
    const music = this.musikerLista[musikerID];
    const band = music.currentBand.find(x => x.bandID === bandID);
    band["timeLeft"] = date;

    music.previusBand.push(band);
    music.currentBand.splice(music.currentBand.findIndex(x => x.bandID === bandID), 1)
  }

  visaDetaljeradInfo(musikerIndex) {
    const musiker = this.musikerLista[musikerIndex];

    console.log('Musiker Detaljer:');
    console.log('------------------');
    console.log('Namn:', musiker.name);
    console.log('Ålder:', musiker.age);
    console.log('Info:', musiker.info);
    console.log('Instrument:', musiker.instrument.join(', '));

    console.log('\nAktuella Band:');
    musiker.currentBand.forEach(band => {
      const bandDetaljer = this.band.bandLista.find(b => b.bandID === band.bandID);
      console.log('Band Namn:', bandDetaljer.name);
      console.log('Ålder:', bandDetaljer.age);
      console.log('Medlemmar:');
      bandDetaljer.currentBand.forEach(medlem => {
        console.log(`- ${medlem.memberName} (${medlem.instrument})`);
      });
      console.log('------------------');
    });

    console.log('\nTidigare Band:');
    musiker.previusBand.forEach(prevBand => {
      const bandDetaljer = this.band.bandLista.find(b => b.bandID === prevBand.bandID);
      if (bandDetaljer) {
        console.log('Band Namn:', bandDetaljer.name);
        console.log('Ålder:', bandDetaljer.age);
        console.log('Medlemmar:');
        bandDetaljer.previusBand.forEach(medlem => {
          if (medlem.memberID === musiker.musikerID) {
            console.log(`- ${medlem.memberName} (${medlem.instrument})`);
          } else {
          console.log('Banddetaljer saknas för bandID:', band.bandID);
        }
        });
        console.log('------------------');
      }
    });
  }

  taBortMusiker(musikerID) {
    const musikerIndex = this.musikerLista.findIndex(musiker => musiker.musikerID === musikerID);
    if (musikerIndex === -1) {
      console.error("Musiker inte hittad.");
      return false;
    }

    const borttagenMusiker = this.musikerLista[musikerIndex];
    let tidigareMedlemmar = [];

    try {
      if (fs.existsSync('./tidigareMedlemmar.json')) {
        tidigareMedlemmar = JSON.parse(fs.readFileSync('./tidigareMedlemmar.json', 'utf-8'));
      }
      tidigareMedlemmar.push(borttagenMusiker);
      this.skrivTillTidigareMedlemmarJson(tidigareMedlemmar);
    } catch (err) {
      console.error('Ett fel inträffade när tidigareMedlemmar.json skulle hanteras:', err.message);
      return false;
    }

    const bandIDsToRemoveFrom = this.musikerLista[musikerIndex].currentBand.map(b => b.bandID);
    for (const bandID of bandIDsToRemoveFrom) {
      const bandIndex = this.band.bandLista.findIndex(band => band.bandID === bandID);
      if (bandIndex !== -1) {
        this.band.currentToPrevious(bandIndex, musikerID, new Date().toLocaleString());
      }
    }

    this.musikerLista.splice(musikerIndex, 1);
    return true;
  }
}

class NewMusiker {
  constructor(name, age, info) {
    if (typeof name !== "string" || typeof age !== "number" || typeof info !== "string") {
      console.error("Ogiltiga parametrar.");
      return;
    }

    this.name = name;
    this.age = age;
    this.info = info;
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