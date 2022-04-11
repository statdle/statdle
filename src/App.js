import React from "react";
import "./App.css";
import Search from "./Search";
import Display from "./Display";
import Top from "./Top";
import Modal from "./Modal";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.doSearch = this.doSearch.bind(this);
    this.updateDisplay = this.updateDisplay.bind(this);
    this.seedValues = this.seedValues.bind(this);
    this.doRandom = this.doRandom.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleModalOff = this.toggleModalOff.bind(this);

    this.seedValues();
  }

  // generate ordered random values
  doRandom(number, range) {
    var retArr = [];
    for (let i = 0; i < range; i++) {
      retArr.push(i);
    }
    while (retArr.length > number) {
      var r = Math.floor(Math.random() * retArr.length);
      retArr.splice(r, 1);
    }
    return retArr;
  }

  // startup pick target country and catagories
  seedValues() {
    // Select target country
    const targetCountry = data[Math.floor(Math.random() * data.length)];

    // Select which 4 catagories
    const seeds = this.doRandom(4, Object.keys(catagoryNames).length);

    //generate inital state values
    const initialState = {};
    for (let i in seeds) {
      var key = Object.keys(catagoryNames)[seeds[i]];
      initialState[key] = {
        target: targetCountry[key],
        high: "",
        highName: "\u00A0",
        low: "",
        lowName: "\u00A0",
        lineThing: 0,
      };
    }

    //set initial state
    this.state = {
      catagories: initialState,
      history: [],
      showModal: true,
      modalType: "how",
    };
  }

  // help, win, settings

  updateDisplay(data) {
    const newState = {}; //we fill this instead of repeatedly calling state

    //history stores what gets inputed, and changed
    const history = this.state.history;
    const turnData = []; //this will be added to history

    //loop through data catagories; name, pop, area,
    for (const key in data) {
      //ignore name column (ignoring name row)
      if (this.state.catagories[key]) {
        const catagory = this.state.catagories[key];
        const rank = data[key];

        newState[key] = {
          target: catagory.target,
          high: "",
          highName: "",
          low: "",
          lowName: "",
          lineThing: 0,
        }; //adding new blank row

        if (rank < catagory.target) {
          //1: higher rank
          if (catagory.high === "" || rank > catagory.high) {
            newState[key].high = rank;
            newState[key].highName = data.name;
            turnData.push("🔼");
          } else {
            newState[key].high = catagory.high;
            newState[key].highName = catagory.highName;
            turnData.push("⏫");
            newState[key].lineThing = 2;
          }
          newState[key].low = catagory.low;
          newState[key].lowName = catagory.lowName;
        } else if (rank > catagory.target) {
          //2: lower rank
          if (catagory.low === "" || rank < catagory.low) {
            newState[key].low = rank;
            newState[key].lowName = data.name;
            turnData.push("🔽");
          } else {
            newState[key].low = catagory.low;
            newState[key].lowName = catagory.lowName;
            turnData.push("⏬");
            newState[key].lineThing = 1;
          }
          newState[key].high = catagory.high;
          newState[key].highName = catagory.highName;
        } else {
          console.log("win condition");
          newState[key].low = rank;
          newState[key].lowName = data.name;
          newState[key].high = rank;
          newState[key].highName = data.name;
          turnData.push("☑️");
          this.toggleModal("win");
        }
      }
    }

    // Update State
    this.setState({
      catagories: newState,
      history: history.concat([{ country: data.name, values: turnData }]),
    });
  }

  doSearch(searchTerm) {
    for (let v in data) {
      if (data[v].name.toLowerCase() === searchTerm.toLowerCase()) {
        this.updateDisplay(data[v]);
        return;
      }
    }
  }

  toggleModal(type) {
    const modalValue = !this.state.showModal;
    this.setState({
      showModal: modalValue,
      modalType: type,
    });
  }

  toggleModalOff() {
    const modalValue = !this.state.showModal;
    this.setState({
      showModal: modalValue,
    });
  }

  render() {
    return (
      <>
        {this.state.showModal ? (
          <Modal
            toggleModalOff={this.toggleModalOff}
            modalType={this.state.modalType}
            // refactor this
            history={this.state.history}
          />
        ) : null}
        <Top
          guessCount={this.state.history.length}
          toggleModal={this.toggleModal}
        />
        <Display
          values={this.state.catagories}
          currentCountry={
            this.state.history.length
              ? this.state.history[this.state.history.length - 1].country
              : ""
          }
        />
        <Search doSearch={this.doSearch} />
      </>
    );
  }
}

const catagoryNames = {
  alpha: "Alphabetically",
  pop: "Population",
  area: "Area",
  density: "Density",
  gdp: "GDP",
  gdpc: "GDP Per Capita",
  calpha: "Capital Cities Alphabetically",
  latt: "Capital Lattitude (North -> South)",
  long: "Capital Longitude (Anti Meridian -> East)",
};

const data = [
  {
    name: "Andorra",
    alpha: 4,
    pop: 185,
    area: 179,
    density: 56,
    gdp: 162,
    gdpc: 24,
    calpha: 8,
    latt: 39,
    long: 57,
  },
  {
    name: "United Arab Emirates",
    alpha: 184,
    pop: 92,
    area: 112,
    density: 72,
    gdp: 29,
    gdpc: 26,
    calpha: 1,
    latt: 83,
    long: 150,
  },
  {
    name: "Afghanistan",
    alpha: 1,
    pop: 37,
    area: 40,
    density: 122,
    gdp: 112,
    gdpc: 184,
    calpha: 73,
    latt: 64,
    long: 156,
  },
  {
    name: "Antigua and Barbuda",
    alpha: 6,
    pop: 184,
    area: 182,
    density: 47,
    gdp: 175,
    gdpc: 51,
    calpha: 151,
    latt: 96,
    long: 25,
  },
  {
    name: "Albania",
    alpha: 2,
    pop: 138,
    area: 142,
    density: 83,
    gdp: 126,
    gdpc: 105,
    calpha: 174,
    latt: 44,
    long: 96,
  },
  {
    name: "Armenia",
    alpha: 8,
    pop: 135,
    area: 137,
    density: 84,
    gdp: 133,
    gdpc: 112,
    calpha: 193,
    latt: 48,
    long: 140,
  },
  {
    name: "Angola",
    alpha: 5,
    pop: 44,
    area: 22,
    density: 153,
    gdp: 57,
    gdpc: 117,
    calpha: 92,
    latt: 167,
    long: 79,
  },
  {
    name: "Argentina",
    alpha: 7,
    pop: 32,
    area: 8,
    density: 171,
    gdp: 21,
    gdpc: 56,
    calpha: 41,
    latt: 191,
    long: 32,
  },
  {
    name: "Austria",
    alpha: 10,
    pop: 96,
    area: 114,
    density: 79,
    gdp: 27,
    gdpc: 16,
    calpha: 182,
    latt: 22,
    long: 88,
  },
  {
    name: "Australia",
    alpha: 9,
    pop: 55,
    area: 6,
    density: 191,
    gdp: 13,
    gdpc: 13,
    calpha: 44,
    latt: 193,
    long: 185,
  },
  {
    name: "Azerbaijan",
    alpha: 11,
    pop: 89,
    area: 113,
    density: 69,
    gdp: 86,
    gdpc: 110,
    calpha: 18,
    latt: 47,
    long: 146,
  },
  {
    name: "Bosnia and Herzegovina",
    alpha: 22,
    pop: 133,
    area: 126,
    density: 121,
    gdp: 113,
    gdpc: 95,
    calpha: 159,
    latt: 35,
    long: 92,
  },
  {
    name: "Barbados",
    alpha: 15,
    pop: 175,
    area: 183,
    density: 9,
    gdp: 155,
    gdpc: 46,
    calpha: 37,
    latt: 113,
    long: 31,
  },
  {
    name: "Bangladesh",
    alpha: 14,
    pop: 8,
    area: 94,
    density: 6,
    gdp: 42,
    gdpc: 148,
    calpha: 54,
    latt: 84,
    long: 166,
  },
  {
    name: "Belgium",
    alpha: 17,
    pop: 80,
    area: 136,
    density: 23,
    gdp: 24,
    gdpc: 20,
    calpha: 38,
    latt: 17,
    long: 62,
  },
  {
    name: "Burkina Faso",
    alpha: 27,
    pop: 58,
    area: 73,
    density: 107,
    gdp: 129,
    gdpc: 180,
    calpha: 125,
    latt: 115,
    long: 53,
  },
  {
    name: "Bulgaria",
    alpha: 26,
    pop: 105,
    area: 100,
    density: 120,
    gdp: 75,
    gdpc: 77,
    calpha: 163,
    latt: 38,
    long: 100,
  },
  {
    name: "Bahrain",
    alpha: 13,
    pop: 149,
    area: 173,
    density: 3,
    gdp: 95,
    gdpc: 37,
    calpha: 100,
    latt: 79,
    long: 147,
  },
  {
    name: "Burundi",
    alpha: 28,
    pop: 77,
    area: 143,
    density: 19,
    gdp: 161,
    gdpc: 193,
    calpha: 42,
    latt: 159,
    long: 113,
  },
  {
    name: "Benin",
    alpha: 19,
    pop: 76,
    area: 98,
    density: 80,
    gdp: 139,
    gdpc: 168,
    calpha: 136,
    latt: 136,
    long: 60,
  },
  {
    name: "Brunei",
    alpha: 25,
    pop: 170,
    area: 164,
    density: 104,
    gdp: 132,
    gdpc: 34,
    calpha: 20,
    latt: 141,
    long: 176,
  },
  {
    name: "Bolivia",
    alpha: 21,
    pop: 79,
    area: 26,
    density: 180,
    gdp: 93,
    gdpc: 124,
    calpha: 84,
    latt: 176,
    long: 22,
  },
  {
    name: "Brazil",
    alpha: 24,
    pop: 6,
    area: 5,
    density: 155,
    gdp: 8,
    gdpc: 68,
    calpha: 34,
    latt: 175,
    long: 37,
  },
  {
    name: "Bahamas",
    alpha: 12,
    pop: 172,
    area: 161,
    density: 142,
    gdp: 131,
    gdpc: 29,
    calpha: 116,
    latt: 81,
    long: 13,
  },
  {
    name: "Bhutan",
    alpha: 20,
    pop: 161,
    area: 132,
    density: 164,
    gdp: 167,
    gdpc: 123,
    calpha: 173,
    latt: 78,
    long: 165,
  },
  {
    name: "Botswana",
    alpha: 23,
    pop: 142,
    area: 47,
    density: 188,
    gdp: 114,
    gdpc: 80,
    calpha: 62,
    latt: 184,
    long: 106,
  },
  {
    name: "Belarus",
    alpha: 16,
    pop: 95,
    area: 82,
    density: 135,
    gdp: 79,
    gdpc: 91,
    calpha: 106,
    latt: 10,
    long: 109,
  },
  {
    name: "Belize",
    alpha: 18,
    pop: 171,
    area: 147,
    density: 173,
    gdp: 170,
    gdpc: 103,
    calpha: 28,
    latt: 95,
    long: 6,
  },
  {
    name: "Canada",
    alpha: 32,
    pop: 39,
    area: 4,
    density: 186,
    gdp: 10,
    gdpc: 19,
    calpha: 124,
    latt: 31,
    long: 17,
  },
  {
    name: "Democratic Republic of the Congo",
    alpha: 44,
    pop: 16,
    area: 11,
    density: 140,
    gdp: 92,
    gdpc: 186,
    calpha: 80,
    latt: 161,
    long: 86,
  },
  {
    name: "Central African Republic",
    alpha: 33,
    pop: 123,
    area: 42,
    density: 183,
    gdp: 168,
    gdpc: 189,
    calpha: 22,
    latt: 144,
    long: 93,
  },
  {
    name: "Republic of the Congo",
    alpha: 141,
    pop: 115,
    area: 64,
    density: 175,
    gdp: 141,
    gdpc: 146,
    calpha: 36,
    latt: 160,
    long: 85,
  },
  {
    name: "Switzerland",
    alpha: 169,
    pop: 100,
    area: 131,
    density: 48,
    gdp: 20,
    gdpc: 4,
    calpha: 30,
    latt: 28,
    long: 67,
  },
  {
    name: "Ivory Coast",
    alpha: 82,
    pop: 53,
    area: 66,
    density: 102,
    gdp: 94,
    gdpc: 152,
    calpha: 189,
    latt: 134,
    long: 51,
  },
  {
    name: "Chile",
    alpha: 35,
    pop: 62,
    area: 37,
    density: 154,
    gdp: 40,
    gdpc: 53,
    calpha: 156,
    latt: 190,
    long: 20,
  },
  {
    name: "Cameroon",
    alpha: 31,
    pop: 52,
    area: 52,
    density: 126,
    gdp: 96,
    gdpc: 156,
    calpha: 191,
    latt: 146,
    long: 74,
  },
  {
    name: "China",
    alpha: 36,
    pop: 1,
    area: 2,
    density: 57,
    gdp: 2,
    gdpc: 76,
    calpha: 25,
    latt: 50,
    long: 177,
  },
  {
    name: "Colombia",
    alpha: 37,
    pop: 29,
    area: 25,
    density: 137,
    gdp: 37,
    gdpc: 88,
    calpha: 33,
    latt: 143,
    long: 18,
  },
  {
    name: "Costa Rica",
    alpha: 39,
    pop: 120,
    area: 125,
    density: 88,
    gdp: 76,
    gdpc: 61,
    calpha: 152,
    latt: 124,
    long: 9,
  },
  {
    name: "Cuba",
    alpha: 41,
    pop: 82,
    area: 102,
    density: 82,
    gdp: 63,
    gdpc: 75,
    calpha: 67,
    latt: 86,
    long: 10,
  },
  {
    name: "Cabo Verde",
    alpha: 29,
    pop: 166,
    area: 166,
    density: 63,
    gdp: 171,
    gdpc: 125,
    calpha: 139,
    latt: 102,
    long: 38,
  },
  {
    name: "Cyprus",
    alpha: 42,
    pop: 155,
    area: 162,
    density: 67,
    gdp: 108,
    gdpc: 43,
    calpha: 120,
    latt: 63,
    long: 124,
  },
  {
    name: "Czechia",
    alpha: 43,
    pop: 85,
    area: 115,
    density: 62,
    gdp: 47,
    gdpc: 38,
    calpha: 138,
    latt: 19,
    long: 81,
  },
  {
    name: "Germany",
    alpha: 63,
    pop: 19,
    area: 63,
    density: 39,
    gdp: 4,
    gdpc: 18,
    calpha: 29,
    latt: 12,
    long: 80,
  },
  {
    name: "Djibouti",
    alpha: 46,
    pop: 157,
    area: 146,
    density: 139,
    gdp: 165,
    gdpc: 130,
    calpha: 56,
    latt: 120,
    long: 136,
  },
  {
    name: "Denmark",
    alpha: 45,
    pop: 113,
    area: 129,
    density: 66,
    gdp: 34,
    gdpc: 10,
    calpha: 50,
    latt: 8,
    long: 77,
  },
  {
    name: "Dominica",
    alpha: 47,
    pop: 186,
    area: 174,
    density: 90,
    gdp: 186,
    gdpc: 83,
    calpha: 149,
    latt: 101,
    long: 28,
  },
  {
    name: "Dominican Republic",
    alpha: 48,
    pop: 84,
    area: 127,
    density: 46,
    gdp: 68,
    gdpc: 82,
    calpha: 157,
    latt: 90,
    long: 21,
  },
  {
    name: "Algeria",
    alpha: 3,
    pop: 33,
    area: 10,
    density: 166,
    gdp: 53,
    gdpc: 115,
    calpha: 5,
    latt: 59,
    long: 61,
  },
  {
    name: "Ecuador",
    alpha: 49,
    pop: 66,
    area: 76,
    density: 112,
    gdp: 62,
    gdpc: 89,
    calpha: 142,
    latt: 154,
    long: 12,
  },
  {
    name: "Estonia",
    alpha: 54,
    pop: 152,
    area: 130,
    density: 150,
    gdp: 99,
    gdpc: 39,
    calpha: 166,
    latt: 4,
    long: 103,
  },
  {
    name: "Egypt",
    alpha: 50,
    pop: 14,
    area: 29,
    density: 85,
    gdp: 44,
    gdpc: 135,
    calpha: 43,
    latt: 74,
    long: 118,
  },
  {
    name: "Eritrea",
    alpha: 53,
    pop: 131,
    area: 103,
    density: 146,
    gdp: 169,
    gdpc: 183,
    calpha: 13,
    latt: 100,
    long: 134,
  },
  {
    name: "Spain",
    alpha: 164,
    pop: 30,
    area: 51,
    density: 94,
    gdp: 14,
    gdpc: 33,
    calpha: 95,
    latt: 46,
    long: 52,
  },
  {
    name: "Ethiopia",
    alpha: 56,
    pop: 12,
    area: 28,
    density: 73,
    gdp: 66,
    gdpc: 173,
    calpha: 4,
    latt: 127,
    long: 133,
  },
  {
    name: "Finland",
    alpha: 58,
    pop: 114,
    area: 70,
    density: 169,
    gdp: 41,
    gdpc: 17,
    calpha: 68,
    latt: 2,
    long: 104,
  },
  {
    name: "Fiji",
    alpha: 57,
    pop: 158,
    area: 151,
    density: 133,
    gdp: 150,
    gdpc: 92,
    calpha: 165,
    latt: 179,
    long: 193,
  },
  {
    name: "Micronesia",
    alpha: 110,
    pop: 167,
    area: 177,
    density: 8,
    gdp: 189,
    gdpc: 178,
    calpha: 126,
    latt: 132,
    long: 186,
  },
  {
    name: "France",
    alpha: 59,
    pop: 22,
    area: 48,
    density: 71,
    gdp: 7,
    gdpc: 23,
    calpha: 129,
    latt: 21,
    long: 59,
  },
  {
    name: "Gabon",
    alpha: 60,
    pop: 143,
    area: 75,
    density: 182,
    gdp: 120,
    gdpc: 84,
    calpha: 85,
    latt: 151,
    long: 70,
  },
  {
    name: "United Kingdom",
    alpha: 185,
    pop: 21,
    area: 78,
    density: 34,
    gdp: 6,
    gdpc: 25,
    calpha: 91,
    latt: 15,
    long: 55,
  },
  {
    name: "Grenada",
    alpha: 66,
    pop: 180,
    area: 185,
    density: 27,
    gdp: 180,
    gdpc: 66,
    calpha: 150,
    latt: 118,
    long: 26,
  },
  {
    name: "Georgia",
    alpha: 62,
    pop: 130,
    area: 118,
    density: 124,
    gdp: 119,
    gdpc: 116,
    calpha: 169,
    latt: 43,
    long: 141,
  },
  {
    name: "Ghana",
    alpha: 64,
    pop: 47,
    area: 81,
    density: 65,
    gdp: 74,
    gdpc: 142,
    calpha: 3,
    latt: 140,
    long: 54,
  },
  {
    name: "Gambia",
    alpha: 61,
    pop: 141,
    area: 160,
    density: 41,
    gdp: 177,
    gdpc: 177,
    calpha: 23,
    latt: 111,
    long: 41,
  },
  {
    name: "Guinea",
    alpha: 68,
    pop: 74,
    area: 77,
    density: 128,
    gdp: 137,
    gdpc: 167,
    calpha: 49,
    latt: 125,
    long: 44,
  },
  {
    name: "Equatorial Guinea",
    alpha: 52,
    pop: 150,
    area: 139,
    density: 131,
    gdp: 130,
    gdpc: 72,
    calpha: 97,
    latt: 147,
    long: 69,
  },
  {
    name: "Greece",
    alpha: 65,
    pop: 86,
    area: 95,
    density: 105,
    gdp: 51,
    gdpc: 41,
    calpha: 16,
    latt: 55,
    long: 101,
  },
  {
    name: "Guatemala",
    alpha: 67,
    pop: 65,
    area: 101,
    density: 55,
    gdp: 69,
    gdpc: 107,
    calpha: 64,
    latt: 104,
    long: 4,
  },
  {
    name: "Guinea-Bissau",
    alpha: 69,
    pop: 147,
    area: 138,
    density: 114,
    gdp: 178,
    gdpc: 174,
    calpha: 32,
    latt: 119,
    long: 43,
  },
  {
    name: "Guyana",
    alpha: 70,
    pop: 160,
    area: 84,
    density: 189,
    gdp: 158,
    gdpc: 104,
    calpha: 63,
    latt: 135,
    long: 33,
  },
  {
    name: "Honduras",
    alpha: 72,
    pop: 91,
    area: 99,
    density: 96,
    gdp: 105,
    gdpc: 133,
    calpha: 170,
    latt: 106,
    long: 7,
  },
  {
    name: "Croatia",
    alpha: 40,
    pop: 128,
    area: 123,
    density: 110,
    gdp: 78,
    gdpc: 59,
    calpha: 194,
    latt: 30,
    long: 87,
  },
  {
    name: "Haiti",
    alpha: 71,
    pop: 81,
    area: 141,
    density: 20,
    gdp: 142,
    gdpc: 171,
    calpha: 135,
    latt: 89,
    long: 19,
  },
  {
    name: "Hungary",
    alpha: 73,
    pop: 93,
    area: 109,
    density: 81,
    gdp: 56,
    gdpc: 54,
    calpha: 40,
    latt: 25,
    long: 94,
  },
  {
    name: "Indonesia",
    alpha: 76,
    pop: 4,
    area: 14,
    density: 59,
    gdp: 16,
    gdpc: 118,
    calpha: 71,
    latt: 163,
    long: 174,
  },
  {
    name: "Ireland",
    alpha: 79,
    pop: 122,
    area: 119,
    density: 111,
    gdp: 33,
    gdpc: 7,
    calpha: 58,
    latt: 11,
    long: 50,
  },
  {
    name: "Israel",
    alpha: 80,
    pop: 99,
    area: 148,
    density: 21,
    gdp: 31,
    gdpc: 22,
    calpha: 172,
    latt: 73,
    long: 126,
  },
  {
    name: "India",
    alpha: 75,
    pop: 2,
    area: 7,
    density: 18,
    gdp: 5,
    gdpc: 141,
    calpha: 117,
    latt: 76,
    long: 162,
  },
  {
    name: "Iraq",
    alpha: 78,
    pop: 36,
    area: 56,
    density: 95,
    gdp: 52,
    gdpc: 101,
    calpha: 17,
    latt: 69,
    long: 139,
  },
  {
    name: "Iran",
    alpha: 77,
    pop: 18,
    area: 17,
    density: 130,
    gdp: 26,
    gdpc: 97,
    calpha: 171,
    latt: 61,
    long: 148,
  },
  {
    name: "Iceland",
    alpha: 74,
    pop: 173,
    area: 104,
    density: 193,
    gdp: 104,
    gdpc: 6,
    calpha: 145,
    latt: 1,
    long: 39,
  },
  {
    name: "Italy",
    alpha: 81,
    pop: 23,
    area: 72,
    density: 51,
    gdp: 9,
    gdpc: 28,
    calpha: 148,
    latt: 42,
    long: 76,
  },
  {
    name: "Jamaica",
    alpha: 83,
    pop: 136,
    area: 158,
    density: 35,
    gdp: 121,
    gdpc: 100,
    calpha: 78,
    latt: 92,
    long: 16,
  },
  {
    name: "Jordan",
    alpha: 85,
    pop: 87,
    area: 110,
    density: 74,
    gdp: 87,
    gdpc: 111,
    calpha: 6,
    latt: 71,
    long: 129,
  },
  {
    name: "Japan",
    alpha: 84,
    pop: 11,
    area: 62,
    density: 25,
    gdp: 3,
    gdpc: 27,
    calpha: 175,
    latt: 62,
    long: 183,
  },
  {
    name: "Kenya",
    alpha: 87,
    pop: 27,
    area: 46,
    density: 93,
    gdp: 67,
    gdpc: 151,
    calpha: 115,
    latt: 157,
    long: 131,
  },
  {
    name: "Kyrgyzstan",
    alpha: 90,
    pop: 109,
    area: 86,
    density: 147,
    gdp: 145,
    gdpc: 161,
    calpha: 31,
    latt: 37,
    long: 161,
  },
  {
    name: "Cambodia",
    alpha: 30,
    pop: 70,
    area: 88,
    density: 92,
    gdp: 106,
    gdpc: 155,
    calpha: 130,
    latt: 121,
    long: 172,
  },
  {
    name: "Kiribati",
    alpha: 88,
    pop: 179,
    area: 172,
    density: 60,
    gdp: 192,
    gdpc: 147,
    calpha: 167,
    latt: 156,
    long: 190,
  },
  {
    name: "Comoros",
    alpha: 38,
    pop: 159,
    area: 170,
    density: 17,
    gdp: 181,
    gdpc: 159,
    calpha: 111,
    latt: 170,
    long: 137,
  },
  {
    name: "Saint Kitts and Nevis",
    alpha: 145,
    pop: 188,
    area: 188,
    density: 52,
    gdp: 182,
    gdpc: 42,
    calpha: 24,
    latt: 94,
    long: 24,
  },
  {
    name: "North Korea",
    alpha: 126,
    pop: 54,
    area: 96,
    density: 49,
    gdp: 115,
    gdpc: 175,
    calpha: 141,
    latt: 51,
    long: 180,
  },
  {
    name: "South Korea",
    alpha: 162,
    pop: 28,
    area: 105,
    density: 14,
    gdp: 12,
    gdpc: 30,
    calpha: 160,
    latt: 57,
    long: 181,
  },
  {
    name: "Kuwait",
    alpha: 89,
    pop: 127,
    area: 152,
    density: 40,
    gdp: 58,
    gdpc: 32,
    calpha: 82,
    latt: 75,
    long: 145,
  },
  {
    name: "Kazakhstan",
    alpha: 86,
    pop: 63,
    area: 9,
    density: 184,
    gdp: 55,
    gdpc: 74,
    calpha: 14,
    latt: 16,
    long: 158,
  },
  {
    name: "Laos",
    alpha: 91,
    pop: 103,
    area: 79,
    density: 149,
    gdp: 117,
    gdpc: 134,
    calpha: 183,
    latt: 93,
    long: 170,
  },
  {
    name: "Lebanon",
    alpha: 93,
    pop: 107,
    area: 159,
    density: 10,
    gdp: 80,
    gdpc: 78,
    calpha: 26,
    latt: 66,
    long: 128,
  },
  {
    name: "Saint Lucia",
    alpha: 146,
    pop: 178,
    area: 178,
    density: 31,
    gdp: 172,
    gdpc: 69,
    calpha: 46,
    latt: 107,
    long: 30,
  },
  {
    name: "Liechtenstein",
    alpha: 97,
    pop: 190,
    area: 190,
    density: 42,
    gdp: 147,
    gdpc: 1,
    calpha: 179,
    latt: 26,
    long: 71,
  },
  {
    name: "Sri Lanka",
    alpha: 165,
    pop: 57,
    area: 120,
    density: 26,
    gdp: 65,
    gdpc: 108,
    calpha: 48,
    latt: 133,
    long: 163,
  },
  {
    name: "Liberia",
    alpha: 95,
    pop: 121,
    area: 106,
    density: 129,
    gdp: 160,
    gdpc: 176,
    calpha: 109,
    latt: 137,
    long: 46,
  },
  {
    name: "Lesotho",
    alpha: 94,
    pop: 144,
    area: 135,
    density: 113,
    gdp: 166,
    gdpc: 160,
    calpha: 103,
    latt: 189,
    long: 108,
  },
  {
    name: "Lithuania",
    alpha: 98,
    pop: 139,
    area: 121,
    density: 138,
    gdp: 84,
    gdpc: 45,
    calpha: 184,
    latt: 9,
    long: 105,
  },
  {
    name: "Luxembourg",
    alpha: 99,
    pop: 164,
    area: 168,
    density: 38,
    gdp: 72,
    gdpc: 3,
    calpha: 94,
    latt: 20,
    long: 64,
  },
  {
    name: "Latvia",
    alpha: 92,
    pop: 148,
    area: 122,
    density: 151,
    gdp: 98,
    gdpc: 48,
    calpha: 146,
    latt: 6,
    long: 102,
  },
  {
    name: "Libya",
    alpha: 96,
    pop: 106,
    area: 16,
    density: 187,
    gdp: 90,
    gdpc: 94,
    calpha: 176,
    latt: 70,
    long: 78,
  },
  {
    name: "Morocco",
    alpha: 115,
    pop: 40,
    area: 55,
    density: 101,
    gdp: 61,
    gdpc: 126,
    calpha: 143,
    latt: 65,
    long: 49,
  },
  {
    name: "Monaco",
    alpha: 112,
    pop: 189,
    area: 194,
    density: 1,
    gdp: 148,
    gdpc: 2,
    calpha: 108,
    latt: 36,
    long: 66,
  },
  {
    name: "Moldova",
    alpha: 111,
    pop: 129,
    area: 134,
    density: 70,
    gdp: 143,
    gdpc: 140,
    calpha: 47,
    latt: 27,
    long: 112,
  },
  {
    name: "Montenegro",
    alpha: 114,
    pop: 163,
    area: 155,
    density: 136,
    gdp: 153,
    gdpc: 79,
    calpha: 131,
    latt: 40,
    long: 95,
  },
  {
    name: "Madagascar",
    alpha: 100,
    pop: 51,
    area: 44,
    density: 134,
    gdp: 134,
    gdpc: 187,
    calpha: 10,
    latt: 180,
    long: 144,
  },
  {
    name: "Marshall Islands",
    alpha: 106,
    pop: 187,
    area: 189,
    density: 28,
    gdp: 191,
    gdpc: 120,
    calpha: 96,
    latt: 131,
    long: 191,
  },
  {
    name: "North Macedonia",
    alpha: 127,
    pop: 145,
    area: 144,
    density: 103,
    gdp: 136,
    gdpc: 96,
    calpha: 162,
    latt: 41,
    long: 99,
  },
  {
    name: "Mali",
    alpha: 104,
    pop: 59,
    area: 23,
    density: 172,
    gdp: 118,
    gdpc: 169,
    calpha: 19,
    latt: 114,
    long: 48,
  },
  {
    name: "Myanmar",
    alpha: 117,
    pop: 26,
    area: 39,
    density: 100,
    gdp: 71,
    gdpc: 158,
    calpha: 190,
    latt: 97,
    long: 167,
  },
  {
    name: "Mongolia",
    alpha: 113,
    pop: 134,
    area: 18,
    density: 194,
    gdp: 135,
    gdpc: 119,
    calpha: 178,
    latt: 24,
    long: 175,
  },
  {
    name: "Mauritania",
    alpha: 107,
    pop: 125,
    area: 27,
    density: 185,
    gdp: 151,
    gdpc: 162,
    calpha: 121,
    latt: 91,
    long: 42,
  },
  {
    name: "Malta",
    alpha: 105,
    pop: 169,
    area: 186,
    density: 5,
    gdp: 128,
    gdpc: 31,
    calpha: 180,
    latt: 60,
    long: 82,
  },
  {
    name: "Mauritius",
    alpha: 108,
    pop: 154,
    area: 169,
    density: 11,
    gdp: 124,
    gdpc: 64,
    calpha: 132,
    latt: 181,
    long: 152,
  },
  {
    name: "Maldives",
    alpha: 103,
    pop: 168,
    area: 187,
    density: 4,
    gdp: 152,
    gdpc: 70,
    calpha: 98,
    latt: 145,
    long: 160,
  },
  {
    name: "Malawi",
    alpha: 101,
    pop: 61,
    area: 107,
    density: 54,
    gdp: 149,
    gdpc: 191,
    calpha: 86,
    latt: 173,
    long: 125,
  },
  {
    name: "Mexico",
    alpha: 109,
    pop: 10,
    area: 13,
    density: 119,
    gdp: 15,
    gdpc: 71,
    calpha: 105,
    latt: 88,
    long: 3,
  },
  {
    name: "Malaysia",
    alpha: 102,
    pop: 45,
    area: 65,
    density: 89,
    gdp: 36,
    gdpc: 67,
    calpha: 81,
    latt: 148,
    long: 169,
  },
  {
    name: "Mozambique",
    alpha: 116,
    pop: 46,
    area: 34,
    density: 141,
    gdp: 127,
    gdpc: 188,
    calpha: 102,
    latt: 187,
    long: 122,
  },
  {
    name: "Namibia",
    alpha: 118,
    pop: 140,
    area: 33,
    density: 192,
    gdp: 125,
    gdpc: 98,
    calpha: 188,
    latt: 183,
    long: 89,
  },
  {
    name: "Niger",
    alpha: 124,
    pop: 56,
    area: 20,
    density: 165,
    gdp: 144,
    gdpc: 190,
    calpha: 119,
    latt: 110,
    long: 58,
  },
  {
    name: "Nigeria",
    alpha: 125,
    pop: 7,
    area: 30,
    density: 45,
    gdp: 30,
    gdpc: 144,
    calpha: 2,
    latt: 126,
    long: 68,
  },
  {
    name: "Nicaragua",
    alpha: 123,
    pop: 108,
    area: 97,
    density: 127,
    gdp: 123,
    gdpc: 139,
    calpha: 99,
    latt: 116,
    long: 8,
  },
  {
    name: "Netherlands",
    alpha: 121,
    pop: 68,
    area: 133,
    density: 16,
    gdp: 18,
    gdpc: 14,
    calpha: 7,
    latt: 13,
    long: 63,
  },
  {
    name: "Norway",
    alpha: 128,
    pop: 117,
    area: 61,
    density: 177,
    gdp: 28,
    gdpc: 5,
    calpha: 123,
    latt: 3,
    long: 73,
  },
  {
    name: "Nepal",
    alpha: 120,
    pop: 49,
    area: 92,
    density: 53,
    gdp: 102,
    gdpc: 166,
    calpha: 75,
    latt: 77,
    long: 164,
  },
  {
    name: "Nauru",
    alpha: 119,
    pop: 194,
    area: 193,
    density: 13,
    gdp: 193,
    gdpc: 60,
    calpha: 192,
    latt: 155,
    long: 188,
  },
  {
    name: "New Zealand",
    alpha: 122,
    pop: 124,
    area: 74,
    density: 170,
    gdp: 50,
    gdpc: 21,
    calpha: 187,
    latt: 194,
    long: 192,
  },
  {
    name: "Oman",
    alpha: 129,
    pop: 118,
    area: 68,
    density: 176,
    gdp: 70,
    gdpc: 58,
    calpha: 113,
    latt: 85,
    long: 154,
  },
  {
    name: "Panama",
    alpha: 133,
    pop: 126,
    area: 116,
    density: 123,
    gdp: 73,
    gdpc: 55,
    calpha: 127,
    latt: 128,
    long: 11,
  },
  {
    name: "Peru",
    alpha: 136,
    pop: 43,
    area: 19,
    density: 152,
    gdp: 49,
    gdpc: 86,
    calpha: 87,
    latt: 171,
    long: 14,
  },
  {
    name: "Papua New Guinea",
    alpha: 134,
    pop: 97,
    area: 54,
    density: 162,
    gdp: 111,
    gdpc: 137,
    calpha: 133,
    latt: 169,
    long: 184,
  },
  {
    name: "Philippines",
    alpha: 137,
    pop: 13,
    area: 71,
    density: 24,
    gdp: 38,
    gdpc: 127,
    calpha: 101,
    latt: 105,
    long: 178,
  },
  {
    name: "Pakistan",
    alpha: 130,
    pop: 5,
    area: 35,
    density: 32,
    gdp: 39,
    gdpc: 154,
    calpha: 70,
    latt: 67,
    long: 159,
  },
  {
    name: "Poland",
    alpha: 138,
    pop: 38,
    area: 69,
    density: 68,
    gdp: 23,
    gdpc: 57,
    calpha: 185,
    latt: 14,
    long: 98,
  },
  {
    name: "Palestine",
    alpha: 132,
    pop: 119,
    area: 163,
    density: 7,
    gdp: 122,
    gdpc: 128,
    calpha: 144,
    latt: 72,
    long: 127,
  },
  {
    name: "Portugal",
    alpha: 139,
    pop: 88,
    area: 108,
    density: 76,
    gdp: 46,
    gdpc: 36,
    calpha: 88,
    latt: 53,
    long: 47,
  },
  {
    name: "Palau",
    alpha: 131,
    pop: 192,
    area: 181,
    density: 143,
    gdp: 190,
    gdpc: 49,
    calpha: 118,
    latt: 130,
    long: 182,
  },
  {
    name: "Paraguay",
    alpha: 135,
    pop: 104,
    area: 59,
    density: 168,
    gdp: 89,
    gdpc: 93,
    calpha: 15,
    latt: 185,
    long: 34,
  },
  {
    name: "Qatar",
    alpha: 140,
    pop: 137,
    area: 157,
    density: 37,
    gdp: 54,
    gdpc: 9,
    calpha: 57,
    latt: 80,
    long: 149,
  },
  {
    name: "Romania",
    alpha: 142,
    pop: 60,
    area: 80,
    density: 99,
    gdp: 48,
    gdpc: 62,
    calpha: 39,
    latt: 33,
    long: 107,
  },
  {
    name: "Serbia",
    alpha: 153,
    pop: 98,
    area: 111,
    density: 87,
    gdp: 85,
    gdpc: 102,
    calpha: 27,
    latt: 32,
    long: 97,
  },
  {
    name: "Russia",
    alpha: 143,
    pop: 9,
    area: 1,
    density: 181,
    gdp: 11,
    gdpc: 63,
    calpha: 112,
    latt: 7,
    long: 132,
  },
  {
    name: "Rwanda",
    alpha: 144,
    pop: 75,
    area: 145,
    density: 15,
    gdp: 140,
    gdpc: 172,
    calpha: 77,
    latt: 158,
    long: 114,
  },
  {
    name: "Saudi Arabia",
    alpha: 151,
    pop: 41,
    area: 12,
    density: 174,
    gdp: 19,
    gdpc: 40,
    calpha: 147,
    latt: 82,
    long: 143,
  },
  {
    name: "Solomon Islands",
    alpha: 159,
    pop: 162,
    area: 140,
    density: 160,
    gdp: 179,
    gdpc: 143,
    calpha: 69,
    latt: 168,
    long: 187,
  },
  {
    name: "Seychelles",
    alpha: 154,
    pop: 183,
    area: 180,
    density: 50,
    gdp: 176,
    gdpc: 52,
    calpha: 181,
    latt: 162,
    long: 151,
  },
  {
    name: "Sudan",
    alpha: 166,
    pop: 34,
    area: 15,
    density: 156,
    gdp: 59,
    gdpc: 131,
    calpha: 76,
    latt: 98,
    long: 120,
  },
  {
    name: "Sweden",
    alpha: 168,
    pop: 90,
    area: 58,
    density: 159,
    gdp: 22,
    gdpc: 12,
    calpha: 164,
    latt: 5,
    long: 91,
  },
  {
    name: "Singapore",
    alpha: 156,
    pop: 112,
    area: 176,
    density: 2,
    gdp: 35,
    gdpc: 11,
    calpha: 161,
    latt: 150,
    long: 171,
  },
  {
    name: "Slovenia",
    alpha: 158,
    pop: 146,
    area: 150,
    density: 86,
    gdp: 83,
    gdpc: 35,
    calpha: 89,
    latt: 29,
    long: 83,
  },
  {
    name: "Slovakia",
    alpha: 157,
    pop: 116,
    area: 128,
    density: 75,
    gdp: 64,
    gdpc: 44,
    calpha: 35,
    latt: 23,
    long: 90,
  },
  {
    name: "Sierra Leone",
    alpha: 155,
    pop: 102,
    area: 117,
    density: 77,
    gdp: 157,
    gdpc: 185,
    calpha: 60,
    latt: 129,
    long: 45,
  },
  {
    name: "San Marino",
    alpha: 149,
    pop: 191,
    area: 191,
    density: 12,
    gdp: 173,
    gdpc: 15,
    calpha: 153,
    latt: 34,
    long: 75,
  },
  {
    name: "Senegal",
    alpha: 152,
    pop: 69,
    area: 85,
    density: 98,
    gdp: 110,
    gdpc: 157,
    calpha: 51,
    latt: 103,
    long: 40,
  },
  {
    name: "Somalia",
    alpha: 160,
    pop: 72,
    area: 41,
    density: 158,
    gdp: 174,
    gdpc: 194,
    calpha: 107,
    latt: 149,
    long: 142,
  },
  {
    name: "Suriname",
    alpha: 167,
    pop: 165,
    area: 90,
    density: 190,
    gdp: 163,
    gdpc: 99,
    calpha: 128,
    latt: 139,
    long: 36,
  },
  {
    name: "South Sudan",
    alpha: 163,
    pop: 83,
    area: 43,
    density: 167,
    gdp: 159,
    gdpc: 192,
    calpha: 72,
    latt: 142,
    long: 119,
  },
  {
    name: "Sao Tome and Principe",
    alpha: 150,
    pop: 176,
    area: 171,
    density: 44,
    gdp: 188,
    gdpc: 145,
    calpha: 158,
    latt: 152,
    long: 65,
  },
  {
    name: "El Salvador",
    alpha: 51,
    pop: 110,
    area: 149,
    density: 30,
    gdp: 103,
    gdpc: 113,
    calpha: 154,
    latt: 109,
    long: 5,
  },
  {
    name: "Syria",
    alpha: 170,
    pop: 67,
    area: 87,
    density: 91,
    gdp: 116,
    gdpc: 164,
    calpha: 52,
    latt: 68,
    long: 130,
  },
  {
    name: "Eswatini",
    alpha: 55,
    pop: 156,
    area: 153,
    density: 118,
    gdp: 156,
    gdpc: 114,
    calpha: 104,
    latt: 188,
    long: 117,
  },
  {
    name: "Chad",
    alpha: 34,
    pop: 71,
    area: 21,
    density: 178,
    gdp: 138,
    gdpc: 179,
    calpha: 114,
    latt: 117,
    long: 84,
  },
  {
    name: "Togo",
    alpha: 175,
    pop: 101,
    area: 124,
    density: 58,
    gdp: 154,
    gdpc: 181,
    calpha: 90,
    latt: 138,
    long: 56,
  },
  {
    name: "Thailand",
    alpha: 173,
    pop: 20,
    area: 50,
    density: 64,
    gdp: 25,
    gdpc: 85,
    calpha: 21,
    latt: 108,
    long: 168,
  },
  {
    name: "Tajikistan",
    alpha: 171,
    pop: 94,
    area: 93,
    density: 116,
    gdp: 146,
    gdpc: 170,
    calpha: 59,
    latt: 54,
    long: 155,
  },
  {
    name: "Timor-Leste",
    alpha: 174,
    pop: 153,
    area: 154,
    density: 97,
    gdp: 164,
    gdpc: 138,
    calpha: 55,
    latt: 166,
    long: 179,
  },
  {
    name: "Turkmenistan",
    alpha: 180,
    pop: 111,
    area: 53,
    density: 179,
    gdp: 91,
    gdpc: 87,
    calpha: 12,
    latt: 56,
    long: 153,
  },
  {
    name: "Tunisia",
    alpha: 178,
    pop: 78,
    area: 91,
    density: 108,
    gdp: 88,
    gdpc: 121,
    calpha: 177,
    latt: 58,
    long: 72,
  },
  {
    name: "Tonga",
    alpha: 176,
    pop: 182,
    area: 175,
    density: 61,
    gdp: 187,
    gdpc: 109,
    calpha: 122,
    latt: 182,
    long: 1,
  },
  {
    name: "Turkey",
    alpha: 179,
    pop: 17,
    area: 36,
    density: 78,
    gdp: 17,
    gdpc: 65,
    calpha: 9,
    latt: 49,
    long: 123,
  },
  {
    name: "Trinidad and Tobago",
    alpha: 177,
    pop: 151,
    area: 165,
    density: 36,
    gdp: 107,
    gdpc: 50,
    calpha: 134,
    latt: 122,
    long: 27,
  },
  {
    name: "Tuvalu",
    alpha: 181,
    pop: 193,
    area: 192,
    density: 22,
    gdp: 194,
    gdpc: 122,
    calpha: 61,
    latt: 165,
    long: 194,
  },
  {
    name: "Tanzania",
    alpha: 172,
    pop: 24,
    area: 31,
    density: 117,
    gdp: 81,
    gdpc: 165,
    calpha: 53,
    latt: 164,
    long: 135,
  },
  {
    name: "Ukraine",
    alpha: 183,
    pop: 35,
    area: 45,
    density: 109,
    gdp: 60,
    gdpc: 132,
    calpha: 83,
    latt: 18,
    long: 115,
  },
  {
    name: "Uganda",
    alpha: 182,
    pop: 31,
    area: 83,
    density: 43,
    gdp: 100,
    gdpc: 182,
    calpha: 74,
    latt: 153,
    long: 121,
  },
  {
    name: "United States of America",
    alpha: 186,
    pop: 3,
    area: 3,
    density: 145,
    gdp: 1,
    gdpc: 8,
    calpha: 186,
    latt: 52,
    long: 15,
  },
  {
    name: "Uruguay",
    alpha: 187,
    pop: 132,
    area: 89,
    density: 163,
    gdp: 77,
    gdpc: 47,
    calpha: 110,
    latt: 192,
    long: 35,
  },
  {
    name: "Uzbekistan",
    alpha: 188,
    pop: 42,
    area: 57,
    density: 106,
    gdp: 82,
    gdpc: 149,
    calpha: 168,
    latt: 45,
    long: 157,
  },
  {
    name: "Saint Vincent and the Grenadines",
    alpha: 147,
    pop: 181,
    area: 184,
    density: 33,
    gdp: 185,
    gdpc: 81,
    calpha: 79,
    latt: 112,
    long: 29,
  },
  {
    name: "Venezuela",
    alpha: 190,
    pop: 50,
    area: 32,
    density: 148,
    gdp: 43,
    gdpc: 73,
    calpha: 45,
    latt: 123,
    long: 23,
  },
  {
    name: "Vietnam",
    alpha: 191,
    pop: 15,
    area: 67,
    density: 29,
    gdp: 45,
    gdpc: 136,
    calpha: 65,
    latt: 87,
    long: 173,
  },
  {
    name: "Vanuatu",
    alpha: 189,
    pop: 174,
    area: 156,
    density: 161,
    gdp: 183,
    gdpc: 129,
    calpha: 137,
    latt: 177,
    long: 189,
  },
  {
    name: "Samoa",
    alpha: 148,
    pop: 177,
    area: 167,
    density: 115,
    gdp: 184,
    gdpc: 106,
    calpha: 11,
    latt: 172,
    long: 2,
  },
  {
    name: "Yemen",
    alpha: 192,
    pop: 48,
    area: 49,
    density: 125,
    gdp: 97,
    gdpc: 163,
    calpha: 155,
    latt: 99,
    long: 138,
  },
  {
    name: "South Africa",
    alpha: 161,
    pop: 25,
    area: 24,
    density: 132,
    gdp: 32,
    gdpc: 90,
    calpha: 140,
    latt: 186,
    long: 110,
  },
  {
    name: "Zambia",
    alpha: 193,
    pop: 64,
    area: 38,
    density: 157,
    gdp: 101,
    gdpc: 153,
    calpha: 93,
    latt: 174,
    long: 111,
  },
  {
    name: "Zimbabwe",
    alpha: 194,
    pop: 73,
    area: 60,
    density: 144,
    gdp: 109,
    gdpc: 150,
    calpha: 66,
    latt: 178,
    long: 116,
  },
];

export default App;