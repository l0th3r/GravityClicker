import { GameData } from "./data";
import { UserData, SaveUserData, ClearLocalData, OutputUserData } from "./userdata";
import { TriggerInputSaveFile } from './file';

const container = {}

// Store UI
container.displayedWindow = undefined;
container.planetWin = document.getElementById('ui-planet-win');
container.isPlanetWinOpen = false
container.planetWinProgressBar = document.getElementById('progress-bar-mine');

container.mineBtn = document.getElementById('btn-mine');
container.sellStockBtn = document.getElementById('btn-sell-stock');
container.upgradeStock = document.getElementById('btn-upgrade-stock');
container.saveBtn = document.getElementById('btn-save');
container.wipeBtn = document.getElementById('btn-wipe');
container.exportBtn = document.getElementById('btn-export');
container.importBtn = document.getElementById('btn-import');

// Events
container.mineBtn.addEventListener('click', ()=>MineEvent(container.mineBtn.value));
container.sellStockBtn.addEventListener('click', ()=>SellStock(container.mineBtn.value));
container.upgradeStock.addEventListener('click', ()=>UpgradeStock(container.mineBtn.value));
container.saveBtn.addEventListener('click', SaveUserData);
container.wipeBtn.addEventListener('click', ClearLocalData);
container.exportBtn.addEventListener('click', OutputUserData);
container.importBtn.addEventListener('click', TriggerInputSaveFile)

document.getElementById('ui-planet-win-close').addEventListener('click', ClosePlanetWin);

function UpgradeStock(planetId) {

    //Static
    const planetData = UserData.GetPlanetData(planetId).data;

    if(UserData.money >= (planetData.stockLvl + 1) * 10) {
        UserData.ModMoney(-(planetData.stockLvl + 1) * 10);
        UserData.GetPlanetData(planetId).data.stockLvl += 1;
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
    UserData.GetPlanetData(planetId).data.miningProgression = 0;
}

function Mine(planetId) {
    
    //Static
    const planetData = UserData.GetPlanetData(planetId).data;

    if(planetData.stock < planetData.stockLvl * 10 && planetData.miningProgression === -1)
    {
        UserData.GetPlanetData(planetId).data.stock += 1;
        if(container.planetWinId === planetId)
            SetPlanetWin(planetId, false);
    }
}

function SetPlanetWin(planetId, allowWinOpen = true) {

    // static data
    const planetData = UserData.GetPlanetData(planetId).data;
    const ressourceData = GameData.settings.ressources.filter(r => r.name === planetData.ressourceName)[0];

    // variable data
    var stockValue = planetData.stock * (ressourceData.unit_value + 1);
    
    container.planetWinId = planetId;
    container.mineBtn.value = planetData.id;
    
    container.planetWinProgressBar.classList = "";
    container.planetWinProgressBar.classList.add("progress-planet", `ui-${planetId}-progress`);
    container.planetWinProgressBar.style.width = `${planetData.miningProgression + 1}%`;

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

    if(!(UserData.money >= (planetData.stockLvl + 1) * 10)) {
        container.upgradeStock.setAttribute('disabled', 'true');
    } else {
        container.upgradeStock.removeAttribute('disabled');
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
    CloseOpenedWin();
    container.isPlanetWinOpen = false;
}
function OpenPlanetWin() {
    SetDisplayedWin(container.planetWin);
    container.isPlanetWinOpen = true;
}

function CloseOpenedWin() {
    if(container.displayedWindow)
        container.displayedWindow.style.display = "none";
}
function SetDisplayedWin(element) {
    CloseOpenedWin();
    container.displayedWindow = element;
    container.displayedWindow.style.display = "block";
}

function SpawnMainUi() {
    SpawnHeader();
}

function SpawnHeader() {

    if(container.header == undefined) {
        container.header = {};
        container.header.window = document.getElementById("ui-header");
        container.header.ui = document.getElementById('ui-money');
    }

    if(container.isHeaderOpen !== true) {
        container.header.window.style.display = "block";
        container.isHeaderOpen = true;
    }

    updateMoneyUI();    
}

function UnspawnHeader() {
    if(container.isHeaderOpen !== false) {
        container.header.window.style.display = "none";
        container.isHeaderOpen = false;
    }
}

function updateMoneyUI() {
    container.header.ui.innerHTML = UserData.money;
}

var list = document.getElementsByClassName('ui-nav-btn');
for (let item of list) {
    item.addEventListener('mouseenter', ()=>{item.childNodes[3].style.display = 'block';})
}

list = document.getElementsByClassName('ui-nav-btn');
for (let item of list) {
    item.addEventListener('mouseleave', ()=>{item.childNodes[3].style.display = 'none';})
}

window.onbeforeunload = function (event) {
    if(!UserData.requestWipe)
        SaveUserData();
};

export { SpawnMainUi, updateMoneyUI, SetPlanetWin, Mine };