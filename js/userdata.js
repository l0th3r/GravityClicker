import { updateMoneyUI } from './interface';

var UserData = undefined;

class GameData {
    money;
    planets;
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
    constructor(money = 0) {
        this.money = money;
        this.planets = [];
    }
}

class PlanetData {
    data = {
        id: "null",
        lvl: 1,
        stock: 0,
        stockLvl: 1,
        ressourceName : "Carbon",
        miningProgression : -1
    }
    InjectData(inputData = {}) {
        this.data = Object.assign(this.data, inputData);
    }
    constructor(inputData = {}) {
        this.InjectData(inputData);
    }
}

function LoadUserData() {
    // DEV
    UserData = new GameData(10);
    UserData.AddPlanetData(new PlanetData({id: "Jupiter", lvl: 1, stock: 0, stockLvl: 2, ressourceName: "Carbon"}));
    UserData.AddPlanetData(new PlanetData({id: "Venus"}));
    UserData.AddPlanetData(new PlanetData({id: "Earth"}));
}

export { UserData, LoadUserData };