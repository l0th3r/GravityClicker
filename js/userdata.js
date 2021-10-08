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
    ressourceName = String;
    constructor(id, lvl = 0, stockLvl = 0, stock = 0, ressourceName = "Carbon") {
        this.id = id;
        this.lvl = lvl;
        this.stockLvl = stockLvl;
        this.stock = stock;
        this.ressourceName = ressourceName;
    }
}

function LoadUserData() {
    // DEV
    UserData = new GameData(10);
    UserData.AddPlanetData(new PlanetData("Jupiter", 2, 4, 30));
    UserData.AddPlanetData(new PlanetData("Venus"));
    UserData.AddPlanetData(new PlanetData("Earth"));
}

export { UserData, LoadUserData };