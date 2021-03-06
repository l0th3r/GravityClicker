import { GameData, GetRessourceData } from './data';
import { updateMoneyUI, NewLog } from './interface';
import { OutputFile } from './file';
import { playSaveSound, playMakeMoney } from './sound';

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
        if(value > 0)
        {
            NewLog(`+${value}$`);
            playMakeMoney();
        }
        else
            NewLog(`${value}$`);
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
        miningProgression : 0,
        deltaProgression: 0
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
    if(!window.localStorage.GravityClicker || window.localStorage.GravityClicker === "undefined") {
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
            // resume mining doesnt work
            planet.data.miningProgression = 0;
            
            UserData.AddPlanetData(new PlanetData(planet.data));
            UserData.GetPlanetData(planet.data.id).CalculateData();
            
            // DOEST WORK
            // Check pending progressions
            // if(UserData.GetPlanetData(planet.data.id).data.miningProgression > 0) {
            //     var temp = UserData.GetPlanetData(planet.data.id);
            //     new MiningEvent(temp.data.id, temp.calculatedData.miningTime, temp.data.deltaProgression);
            // }
        });
    }
}

function SaveUserData(isAlert = true) {
    window.localStorage.setItem('GravityClicker', JSON.stringify(UserData));
    if(isAlert === true) {
        NewLog("Game Saved !", true);
        playSaveSound();
    }
}

function ClearLocalData() {
    UserData.requestWipe = true;
    window.localStorage.removeItem('GravityClicker');
    location.reload();
}

function OutputUserData() {
    SaveUserData(false);
    OutputFile("save.grvclick", btoa(window.localStorage.GravityClicker));
}

function HandleSaveFileLoad(fileContent) {

    var parsedData;
    var error = "null";

    try {
        parsedData = JSON.parse(atob(fileContent));
    } catch(err) {
        error = err;
    }
    
    if(error == "null")
    {
        UserData = parsedData;
        SaveUserData();
        location.reload();
    }
    else {
        console.log("error");
        location.reload();
    }
}

export { UserData, LoadUserData, SaveUserData, ClearLocalData, OutputUserData, HandleSaveFileLoad };