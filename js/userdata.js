import { GameData, GetRessourceData } from './data';
import { updateMoneyUI } from './interface';
import { OutputFile } from './file';

var UserData = undefined;

class UserDataObj {
    money;
    firstTime;
    planets = [];
    AddPlanetData(data) {
        this.planets.push(data);
    }
    GetPlanetData(id) {
        return this.planets.filter(p => p.data.id === id)[0];
    }
    UpdatePlanetData(id, data) {
        this.GetPlanetData(id).InjectData(data);
        updateMoneyUI();
    }
    ModMoney(value) {
        this.money += value;
        updateMoneyUI();
    }
    constructor(money = 0, firstTime = false) {
        this.money = money;
        this.firstTime = firstTime;
    }
}

class PlanetData {
    data = {
        id: "null",
        lvl: 1,
        timeLvl: 1,
        stock: 0,
        stockLvl: 1,
        ressourceName : "null",
        miningProgression : 0
    }
    calculatedData = {
        unitValue: 0,
        miningTime: 0,
        nextUpdatePrice: 0,
    }
    CalculateData() {
        const ressData = GetRessourceData(this.data.id);

        // calculate unit value depending on the level
        this.calculatedData.unitValue = (this.data.lvl + 2) * ressData.unit_value;

        // calculate the price of the next upgrade
        this.calculatedData.nextUpdatePrice = (ressData.price * ressData.coef ^ this.data.lvl - 1);

        // dont have a fromula yet
        this.calculatedData.miningTime = ressData.mining_time;
    }
    InjectData(inputData = {}) {
        this.data = Object.assign(this.data, inputData);
    }
    constructor(inputData = {}) {
        this.InjectData(inputData);
    }
}

function LoadUserData() {

    if(!window.localStorage.GravityClicker) {
        UserData = new UserDataObj(0, true);

        // create planets and link them to ressources
        GameData.planets.forEach((p, i) => {
            UserData.AddPlanetData(new PlanetData({id: p.englishName, ressourceName: GameData.settings.ressources[i].name}));
        });

        SaveUserData();
    } else {
        const loadedData = JSON.parse(window.localStorage.GravityClicker);

         // load User
        UserData = new UserDataObj(loadedData.money);

        // load planet and assign ressources values
        loadedData.planets.forEach(planet => {
            UserData.AddPlanetData(new PlanetData(planet.data)); 
        });
    }
}

function SaveUserData(isAlert = false) {
    window.localStorage.setItem('GravityClicker', JSON.stringify(UserData));
    if(isAlert === true) alert("Your data are saved in your browser's files :)");
}

function ClearLocalData() {
    UserData.requestWipe = true;
    window.localStorage.removeItem('GravityClicker');
    location.reload();
}

function OutputUserData() {
    SaveUserData();
    OutputFile("save.grvclick", btoa(window.localStorage.GravityClicker));
}

function HandleSaveFileLoad(fileContent) {

    const parsedData = JSON.parse(atob(fileContent));
    var error = "null";
    var data;

    try {
        data = JSON.parse(response);
    } catch(err) {
        error = err;
    }
    
    if(error = "null")
    {
        UserData = parsedData;
        SaveUserData();
        location.reload();
    }
}

export { UserData, LoadUserData, SaveUserData, ClearLocalData, OutputUserData, HandleSaveFileLoad };