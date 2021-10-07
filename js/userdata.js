import { updateMoneyUI } from './interface';

var UserData = undefined;

class GameData {
    money;
    planets;
    AddPlanetData(data) {
        this.planets.push(data);
    }
    GetPlanetData(id) {
        return this.planets.filter(p => p.id === id)[0];
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
    id = String;
    lvl = Number;
    stockLvl = Number;
    stock = Number;
    constructor(id, lvl = 0, stockLvl = 0, stock = 0) {
        this.id = id;
        this.lvl = lvl;
        this.stockLvl = stockLvl;
        this.stock = stock;
    }
}

function LoadUserData() {
    // DEV
    UserData = new GameData(10);
    UserData.AddPlanetData(new PlanetData("Venus", 2, 4, 40));
    UserData.AddPlanetData(new PlanetData("Jupiter"));
}

export { UserData, LoadUserData };