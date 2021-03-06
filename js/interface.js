import { GetRessourceData } from "./data";
import { UserData, SaveUserData, ClearLocalData, OutputUserData } from "./userdata";
import { TriggerInputSaveFile } from './file';
import { MainScene } from "./scenes";
import { MiningEvent } from './mine_events';
import { playCollectSound, playMachineSound, playClickSound } from './sound';

const container = {}

// Store UI
container.displayedWindow = undefined;
container.planetWin = document.getElementById('ui-planet-win');
container.isPlanetWinOpen = false
container.planetWinProgressBar = document.getElementById('progress-bar-mine');
container.planetWinProgressBarPrnct = document.getElementById('progress-bar-prcnt');
container.planetWinData = {};
container.ressourceData = undefined;

container.mineBtn = document.getElementById('btn-mine');
container.sellStockBtn = document.getElementById('btn-sell-stock');
container.upgradeStock = document.getElementById('btn-upgrade-stock');
container.saveBtn = document.getElementById('btn-save');
container.wipeBtn = document.getElementById('btn-wipe');
container.exportBtn = document.getElementById('btn-export');
container.importBtn = document.getElementById('btn-import');
container.planetsBtn = document.getElementById('btn-planet');
container.logsContainer = document.getElementById('ui-log-cont');
container.planetList = document.getElementById("planets-list");
container.planetsWin = document.getElementById("ui-planets-win");
container.upgradeMineBtn = document.getElementById('btn-upgrade-mining');

// Events
container.mineBtn.addEventListener('click', ()=>MineEvent(container.mineBtn.value));
container.sellStockBtn.addEventListener('click', ()=>SellStock(container.mineBtn.value));
container.upgradeStock.addEventListener('click', ()=>UpgradeStock(container.mineBtn.value));
container.saveBtn.addEventListener('click', ()=>SaveUserData(true));
container.wipeBtn.addEventListener('click', ClearLocalData);
container.exportBtn.addEventListener('click', ()=>{OutputUserData(); playClickSound();});
container.importBtn.addEventListener('click', ()=>{TriggerInputSaveFile(); playClickSound();});
container.planetsBtn.addEventListener('click', ()=>{OpenPlanetsWin(); playClickSound();});
container.upgradeMineBtn.addEventListener('click', ()=>UpgradeMining(container.mineBtn.value));

document.getElementById('ui-planet-win-close').addEventListener('click', ()=>{ClosePlanetWin(); playClickSound();});
document.getElementById('ui-planets-win-close').addEventListener('click', ()=>{ClosePlanetsWin(); playClickSound();});

function SetPlanetWinData(planetId) {
    UserData.GetPlanetData(planetId).CalculateData();
    
    container.planetWinData.planetData = UserData.GetPlanetData(planetId).data;
    container.planetWinData.calcPlanetData = UserData.GetPlanetData(planetId).calculatedData;
    container.planetWinData.ressourceData = GetRessourceData(planetId);
    
    container.planetWinData.stockValue = container.planetWinData.planetData.stock * (container.planetWinData.ressourceData.unit_value + 1);
    container.planetWinId = planetId;
    container.mineBtn.value = container.planetWinData.planetData.id;
    UpdatePlanetWin();
}

function UpdatePlanetWin() {
    var planetData = container.planetWinData.planetData;
    var calcPlanetData = container.planetWinData.calcPlanetData;

    container.planetWinProgressBar.classList = "progress-planet " + `ui-${planetData.id}-progress`;
    container.planetWinProgressBarPrnct.classList = "ui-data " + `ui-${planetData.id}-progress-prcnt`;
    
    // Update UI
    UpdatePlanetsProgressBar(planetData.id);

    UpdateClassElement('ui-planet-name', planetData.id);
    UpdateClassElement('ui-ressource-name', planetData.ressourceName);
    UpdateClassElement('ui-stock', planetData.stock);
    UpdateClassElement('ui-max-stock', planetData.stockLvl * 10);
    UpdateClassElement('ui-next-stock-upgrade', planetData.stock);
    UpdateClassElement('ui-mining-value', planetData.lvl);
    UpdateClassElement('ui-stock-value', container.planetWinData.stockValue);
    UpdateClassElement('ui-next-stock-upgrade', planetData.stockLvl + 1);
    UpdateClassElement('ui-next-stock-upgrade-price', (planetData.stockLvl + 1) * 10);

    UpdateClassElement('ui-next-mining-upgrade', planetData.lvl + 1);
    UpdateClassElement('ui-next-mining-upgrade-price', calcPlanetData.nextUpdatePrice);

    if(planetData.stock >= planetData.stockLvl * 10 || (planetData.miningProgression > 0 && planetData.miningProgression < 100)) {
        container.mineBtn.setAttribute('disabled', "true"); 
    }
    else {
        container.mineBtn.removeAttribute('disabled'); 
    }

    if(planetData.lvl >= 100) {
        container.upgradeMineBtn.style.display = "none";
    }
    else {
        container.upgradeMineBtn.style.display = "inline";
        if(UserData.money < calcPlanetData.nextUpdatePrice) {
            container.upgradeMineBtn.setAttribute('disabled', "true"); 
        }
        else {
            container.upgradeMineBtn.removeAttribute('disabled'); 
        }
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
}

function UpgradeMining(planetId) {
    const planetData = UserData.GetPlanetData(planetId);

    if(UserData.money >= planetData.calculatedData.nextUpdatePrice) {
        UserData.ModMoney(-planetData.calculatedData.nextUpdatePrice);
        UserData.GetPlanetData(planetId).data.lvl += 1;
        UserData.GetPlanetData(planetId).CalculateData();
    }

    SetPlanetWinData(planetId);
}

function UpgradeStock(planetId) {

    //Static
    const planetData = UserData.GetPlanetData(planetId).data;

    if(UserData.money >= (planetData.stockLvl + 1) * 10) {
        UserData.ModMoney(-(planetData.stockLvl + 1) * 10);
        UserData.GetPlanetData(planetId).data.stockLvl += 1;
    }
    
    SetPlanetWinData(planetId);
}

function SellStock(planetId) {
    
    //Static
    const planetData = UserData.GetPlanetData(planetId).data;
    const ressourceData = GetRessourceData(planetId);

    UserData.ModMoney(planetData.stock * (ressourceData.unit_value + 1));
    UserData.GetPlanetData(planetId).data.stock = 0;
    
    SetPlanetWinData(planetId);
    SaveUserData(false);
}

function MineEvent(planetId) {
    UserData.GetPlanetData(planetId).CalculateData();
    const planet = UserData.GetPlanetData(planetId);

    playMachineSound();

    new MiningEvent(planetId, planet.calculatedData.miningTime);
}

function Mine(planetId) {
    //Static
    const planetData = UserData.GetPlanetData(planetId).data;

    if(planetData.stock < planetData.stockLvl * 10)
    {
        if(planetData.stock + planetData.lvl > planetData.stockLvl * 10) {
            NewLog(`+ ${planetData.stock - planetData.stockLvl * 10}` + planetData.ressourceName);
            planetData.stock = planetData.stockLvl * 10;
        } else {
            planetData.stock += planetData.lvl;
            NewLog(`+ ${planetData.lvl}` + planetData.ressourceName);
        }
        
        
        playCollectSound();

        if(container.planetWinId === planetId)
            SetPlanetWinData(planetId);
    }
}

function UpdateClassElement(className, value) {
    var list = document.getElementsByClassName(className);
    for (let item of list) {
        item.innerHTML = value;
    }
}

function UpdatePlanetsProgressBar(planetId) {
    var list = document.getElementsByClassName(`ui-${planetId}-progress`);
    for (let item of list) {
        item.style.width = `${UserData.GetPlanetData(planetId).data.miningProgression}%`;
    }

    UpdateClassElement(`ui-${planetId}-progress-prcnt`, Math.floor(UserData.GetPlanetData(planetId).data.miningProgression));
}

function OpenPlanetsWin()
{
    if(container.planetsWin) {
        container.planetsWin.style.display = "block";
    }
}

function ClosePlanetsWin()
{
    if(container.planetsWin) {
        container.planetsWin.style.display = "none";
    }
}

function ClosePlanetWin() {
    CloseOpenedWin();
    MainScene.UnfocusObject();
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
    InitPlanetList();
}

function InitPlanetList() {
    UserData.planets.forEach(planet => {
        var element = document.createElement('li');
        element.innerText = planet.data.id;
        element.id = `${planet.data.id}-btn`;
        container.planetList.appendChild(element);
        document.getElementById(`${planet.data.id}-btn`).addEventListener('click', ()=>{playClickSound(); MainScene.FocusObject(planet.data.id); ClosePlanetsWin(); SetPlanetWinData(planet.data.id); OpenPlanetWin()});
    });
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
    if(UserData && !UserData.requestWipe)
        SaveUserData(false);
};

var logsCounter = 0;

function NewLog(content, isImportant = false) {

    const cont = document.createElement('div');
    cont.id = `ui-log-win-${logsCounter}`;

    if(isImportant) {
        cont.innerHTML = `
            <div class="ui-log-win ui-container ui-bottom ui-element ui-panel ui-border">
                <span class="warning">${content}</span>
            </div>
        `;
    } else {
        cont.innerHTML = `
            <div class="ui-log-win ui-container ui-bottom ui-element ui-panel ui-border">
                <span>${content}</span>
            </div>
        `;
    }
    container.logsContainer.appendChild(cont);
    logsCounter++;
}

export { NewLog, UpdatePlanetWin, container, SpawnMainUi, updateMoneyUI, SetPlanetWinData, Mine, UpdatePlanetsProgressBar, OpenPlanetWin, UpdateClassElement };