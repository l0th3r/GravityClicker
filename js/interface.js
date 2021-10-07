import { UserData } from "./userdata";

const container = {}


function NewPlanetWin(planet) {
    
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

export { SpawnMainUi, updateMoneyUI };