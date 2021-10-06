import { Fetch } from './data';
import { MainScene } from './scenes.js';
import { Objects, InitPlanets } from './objects';
import { UserData, LoadUserData } from './userdata';
import { SpawnHeader, updateMoneyUI } from './interface';

LoadUserData();
Fetch.GetPlanets(HandleSucess, HandlePending, HandleError);

function HandlePending(e) {
    document.getElementById('progress').style.width = `${(e * 100 / 4)}%`;
    document.getElementById('loading-txt').innerText = `Loading ${(e * 100 / 4)}%`;
}

function HandleError(e) {
    document.getElementById('progress').style.width = "100%";
    document.getElementById('loading-txt').innerText = "Error: " + e;
}

function HandleSucess(e) {
    setTimeout(function(){
        document.getElementById('progress').style.width = "100%";
        document.getElementById('loading-txt').innerText = `Loading 100%`;
        
        setTimeout(function(){
            document.getElementById('loading-env').remove();

            //MainScene.Init();
            //MainScene.Debug(); // DEBUG

            SpawnHeader();
            InitPlanets();
            //Update();
        }, /*800*/0);
    }, /*1000*/0);
}

function Update() {
    requestAnimationFrame(Update);

    // update all objects
    Objects.forEach(obj => { obj.Update(); });
    
    MainScene.Render();
}

// handle window resize
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() {
    if(MainScene.renderer) {
        MainScene.camera.aspect = window.innerWidth / window.innerHeight;
        MainScene.camera.updateProjectionMatrix();
        MainScene.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}