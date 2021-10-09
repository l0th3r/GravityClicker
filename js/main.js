import { Fetch } from './data';
import { MainScene } from './scenes.js';
import { Objects, InitPlanets } from './objects';
import { LoadUserData, UserData } from './userdata';
import { SpawnMainUi, Mine, SetPlanetWin } from './interface';

Fetch.GetPlanets(LoadLocal, HandlePending, HandleError);

function LoadLocal() {
    Fetch.GetJsonFile('/assets/settings.json', HandleSucess, undefined, HandleError);
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
    LoadUserData();

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

    // update all 3D objects
    Objects.forEach(obj => { obj.Update(); });

    // update planets data
    UpdatePlanetsData();
    
    MainScene.Render();
}

function UpdatePlanetsData() {
    // get planets data
    const planets = UserData.planets;

    // get ones that mining is engaged
    const needUpdate = planets.filter(p => p.data.miningProgression >= 0);

    needUpdate.forEach(e => {
        if(e.data.miningProgression < 100) {
            UserData.GetPlanetData(e.data.id).data.miningProgression += 1;
            
            // update planets progressbars
            var list = document.getElementsByClassName(`ui-${e.data.id}-progress`);
            for (let item of list) {
                item.style.width = `${UserData.GetPlanetData(e.data.id).data.miningProgression}%`;
            }
        }
        else {
            UserData.GetPlanetData(e.data.id).data.miningProgression = -1;
            Mine(e.data.id);
        }
    });
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