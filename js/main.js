import { Fetch } from './data';
import { MainScene } from './scenes.js';
import { Objects, InitPlanets } from './objects';
import { UserData, LoadUserData } from './userdata';
import { SpawnMainUi } from './interface';

LoadUserData();
Fetch.GetPlanets(LoadLocal, HandlePending, HandleError);

function LoadLocal(e) {
    Fetch.GetJsonFile('/assets/settings.json', HandleSucess, ()=>{}, HandleError);
}

function HandlePending(e) {
    document.getElementById('progress').style.width = `${(e * 100 / 4)}%`;
    document.getElementById('loading-txt').innerText = `Loading ${(e * 100 / 4)}%`;
}

function HandleError(e) {
    document.getElementById('progress').style.width = "100%";
    document.getElementById('loading-txt').innerText = "Error: " + e;
}

function HandleSucess() {
    setTimeout(function() {
        document.getElementById('progress').style.width = "100%";
        document.getElementById('loading-txt').innerText = `Loading 100%`;
        
        setTimeout(function(){
            document.getElementById('loading-env').style.display = "none";

            SpawnMainUi();
            InitPlanets();

            // start three js scene
            MainScene.Init();
            // start frame update
            Update();

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