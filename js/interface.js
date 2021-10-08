import { UserData } from "./userdata";

// console.log(JSON.parse(data));

const container = {}

container.planetWin = document.getElementById('ui-planet-win');
container.isPlanetWinOpen = false
document.getElementById('ui-planet-win-close').addEventListener('click', ClosePlanetWin);

function SetPlanetWin(planetId) {

    var data = UserData.GetPlanetData(planetId);
    console.log(data);

    UpdateClassElement('ui-planet-name', data.id);
    UpdateClassElement('ui-ressource-name', data.ressourceName);
    UpdateClassElement('ui-stock', data.stock);
    UpdateClassElement('ui-max-stock', data.stockLvl * 10);
    UpdateClassElement('ui-next-stock-upgrade', data.stock);
    
    if(container.isPlanetWinOpen === false)
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
}

function updateMoneyUI() {
    container.money.ui.innerHTML = UserData.money;
}

export { SpawnMainUi, updateMoneyUI, SetPlanetWin };