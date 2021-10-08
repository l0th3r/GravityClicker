import { GameData } from "./data";
import { UserData } from "./userdata";

const container = {}

// UI event listener
container.planetWin = document.getElementById('ui-planet-win');
container.isPlanetWinOpen = false
container.mineBtn = document.getElementById('btn-mine');
container.sellStockBtn = document.getElementById('btn-sell-stock');
container.upgradeStock = document.getElementById('btn-upgrade-stock');

container.mineBtn.addEventListener('click', ()=>MineEvent(container.mineBtn.value));
container.sellStockBtn.addEventListener('click', ()=>SellStock(container.mineBtn.value));
container.upgradeStock.addEventListener('click', ()=>UpgradeStock(container.mineBtn.value));

document.getElementById('ui-planet-win-close').addEventListener('click', ClosePlanetWin);

function UpgradeStock(planetId) {

    //Static
    const planetData = UserData.GetPlanetData(planetId).data;

    if(UserData.money >= (planetData.stockLvl + 1) * 10) {
        UserData.ModMoney(-(planetData.stockLvl + 1) * 10);
        UserData.GetPlanetData(planetId).data.stockLvl += 1;
    } else {
        console.log("fuck off");
    }

    
    SetPlanetWin(planetId, false);
}

function SellStock(planetId) {
    
    //Static
    const planetData = UserData.GetPlanetData(planetId).data;
    const ressourceData = GameData.settings.ressources.filter(r => r.name === planetData.ressourceName)[0];

    UserData.ModMoney(planetData.stock * (ressourceData.unit_value + 1));
    UserData.GetPlanetData(planetId).data.stock = 0;
    
    SetPlanetWin(planetId, false);
}

function MineEvent(planetId) {
    
    //Static
    const planetData = UserData.GetPlanetData(planetId).data;

    if(planetData.stock < planetData.stockLvl * 10)
    {
        UserData.GetPlanetData(planetId).data.stock += 1;
        SetPlanetWin(planetId, false);
    }
}

function SetPlanetWin(planetId, allowWinOpen = true) {

    // static data
    const planetData = UserData.GetPlanetData(planetId).data;
    const ressourceData = GameData.settings.ressources.filter(r => r.name === planetData.ressourceName)[0];

    // variable data
    var stockValue = planetData.stock * (ressourceData.unit_value + 1);

    container.mineBtn.value = planetData.id;

    UpdateClassElement('ui-planet-name', planetData.id);
    UpdateClassElement('ui-ressource-name', planetData.ressourceName);
    UpdateClassElement('ui-stock', planetData.stock);
    UpdateClassElement('ui-max-stock', planetData.stockLvl * 10);
    UpdateClassElement('ui-next-stock-upgrade', planetData.stock);
    UpdateClassElement('ui-mining-value', planetData.lvl);
    UpdateClassElement('ui-stock-value', stockValue);
    UpdateClassElement('ui-next-stock-upgrade', planetData.stockLvl + 1);
    UpdateClassElement('ui-next-stock-upgrade-price', (planetData.stockLvl + 1) * 10);

    if(planetData.stock >= planetData.stockLvl * 10) {
        container.mineBtn.setAttribute('disabled', "true"); 
    }
    else {
        container.mineBtn.removeAttribute('disabled'); 
    }

    if(planetData.stock <= 0) {
        container.sellStockBtn.setAttribute('disabled', "true"); 
    }
    else {
        container.sellStockBtn.removeAttribute('disabled');   
    }
    
    if(container.isPlanetWinOpen === false && allowWinOpen === true)
        OpenPlanetWin();
}

function UpdateClassElement(className, value) {
    var list = document.getElementsByClassName(className);
    for (let item of list) {
        item.innerHTML = value;
    }
}

function ClosePlanetWin() {
    container.planetWin.style.display = "none";
    container.isPlanetWinOpen = false;
}
function OpenPlanetWin() {
    container.planetWin.style.display = "block";
    container.isPlanetWinOpen = true;
}

function SpawnMainUi() {
    SpawnHeader();
}

function SpawnHeader() {
    
    var old = document.getElementById("ui-header");
    if(old)
        old.remove();
    
    // create container
    var cont = document.createElement('div');
    cont.id = "ui-header";
    cont.classList.add("ui-container", "ui-element", "ui-align", "ui-panel", "ui-padding", "ui-right", "ui-border-bot");

    var moneyTxt = document.createElement('span');
    moneyTxt.classList.add("ui-data");
    moneyTxt.innerHTML = `Money: <span id="ui-money" class="ui-data">0</span>$`;

    cont.appendChild(moneyTxt);
    document.body.appendChild(cont);

    container.money = {}
    container.money.window = cont;
    container.money.ui = document.getElementById('ui-money');
    updateMoneyUI();    
}

function updateMoneyUI() {
    container.money.ui.innerHTML = UserData.money;
}

export { SpawnMainUi, updateMoneyUI, SetPlanetWin };