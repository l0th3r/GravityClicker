import * as THREE from 'three';
import { MainScene } from './scenes.js';
import { Objects, Object } from './objects';
import { GetTexture, Texture } from './texture';

MainScene.Init();
MainScene.Debug(); // DEBUG

const moon_t = new THREE.TextureLoader().load('https://raw.githubusercontent.com/l0th3r/js3DTest/main/src/assets/moon.jpg');

const moon = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial({
        map: moon_t
    })
);

const moon2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({
        map: moon_t
    })
);

const moo = new Object(MainScene.scene, "Moon", moon, 6, 0.2, 0, true);
const mo = new Object(MainScene.scene, "Moon2", moon2, 3, 0, 0, true, true, moo);

function Update() {
    requestAnimationFrame(Update);

    Objects.forEach(obj => {
        obj.Update();
    });
    
    MainScene.Render();
}

Update();


//handle window resize
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() {
    MainScene.camera.aspect = window.innerWidth / window.innerHeight;
    MainScene.camera.updateProjectionMatrix();
    MainScene.renderer.setSize( window.innerWidth, window.innerHeight );
}