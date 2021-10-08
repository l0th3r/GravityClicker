import * as THREE from 'three';
import { MainScene } from './scenes.js';
import { Data } from './data';
import { SetPlanetWin } from './interface';

var Objects = [];

function InitPlanets() {

    const sun_t = new THREE.TextureLoader().load(`/textures/planets/sun.jpg`);

    const sun_obj = new THREE.Mesh(
        new THREE.SphereGeometry(60, 32, 32),
        new THREE.MeshStandardMaterial({
            map: sun_t
        })
    );
    const sun = new Object(MainScene.scene, "sun", sun_obj, 0, 0, 0, true);
    sun.allowRotation = false;
    sun.allowMovements = false;
    sun.allowInteraction = false;

    Data.forEach((planet, i) => {
        const planet_t = new THREE.TextureLoader().load(`/textures/planets/${planet.id}.jpg`);
    
        // calculate size
        const newRadius = remap(planet.equaRadius, 1188.3, 71492, 12, 20);
        const temp_obj = new THREE.Mesh(
            new THREE.SphereGeometry(newRadius, 32, 32),
            new THREE.MeshStandardMaterial({
                map: planet_t
            })
        );

        new Object(MainScene.scene, planet.englishName, temp_obj, i * 35 + 150, getRandomBetw(0.01, 0.05), getRandomBetw(0.01, 0.028), true, {type: "_Interactible"}, undefined, undefined, (e)=>SetPlanetWin(e.id));
    });
}

function remap(from, fromMin, fromMax, toMin, toMax) {
    var fromAbs  =  from - fromMin;
    var fromMaxAbs = fromMax - fromMin;      
    var normal = fromAbs / fromMaxAbs;
    var toMaxAbs = toMax - toMin;
    var toAbs = toMaxAbs * normal;
    var to = toAbs + toMin;
    return to;
}

function getRandomBetw(min, max) {
    return Math.random() * (max - min) + min;
}
  
class Object {
    allowMovements = true;
    allowInteraction = true;
    allowRotation = true;
    orbitInfo = {
        orbitRadius: 0,
        rotSpeed: 0,
        rot: 0,
        orbitSpeed: 0,
        orbit: 0,
        rotSpeed: 0,
        origin: new THREE.Vector3(0, 0, 0)
    };
    Update() {
        // Meant to be executed every frames
        if(this.isLinked === true)
            this.SetOrbitOrigin(this.linked.object.position.x, this.linked.object.position.y, this.linked.object.position.z);
        if(this.allowRotation === true) {
            this.orbitInfo.rot += this.orbitInfo.rotSpeed;
            this.object.rotation.set(0, this.orbitInfo.rot, 0);
        }
        if(this.allowMovements === true) {
            this.orbitInfo.orbit += this.orbitInfo.orbitSpeed;
            this.object.position.set((Math.cos(this.orbitInfo.orbit) * this.orbitInfo.orbitRadius) + this.orbitInfo.origin.x, this.orbitInfo.origin.y, (Math.sin(this.orbitInfo.orbit) * this.orbitInfo.orbitRadius) + this.orbitInfo.origin.z);
        }
    };
    LinkOrbit(object) {
        this.isLinked = true;
        this.linked = object;
    }
    SetOrbitOrigin(x, y, z) {
        this.orbitInfo.origin.x = x;
        this.orbitInfo.origin.y = y;
        this.orbitInfo.origin.z = z;
        if(this.hasOrbitLine === true)
            this.orbitLine.position.set(x, y, z);
    };
    GetOrbitOrigin() {
        return this.orbitInfo.origin;
    }
    Default_Hover(e) {}
    Default_UnHover() {}
    Default_Interact() {}
    constructor(
        scene, id, object, orbitRadius, rotSpeed, orbitSpeed, hasOrbitLine = true, objData = {},
        hoverFunc = this.Default_Hover, unHoverFunc = this.Default_UnHover, interactFunc = this.Default_Interact, link = false, linked = undefined)
        {
        // set object settings
        this.id = id;
        this.object = object;
        this.object.data = objData;
        this.object.data.parent = this;
        this.object.position.set(orbitRadius, 0, 0);

        this.Hover = hoverFunc;
        this.UnHover = unHoverFunc;
        this.Interact = interactFunc;
        
        // set orbit settings
        this.orbitInfo.orbitRadius = orbitRadius;
        this.orbitInfo.rotSpeed = 0.005 + rotSpeed * 0.1,
        this.orbitInfo.rot = Math.random(),
        this.orbitInfo.orbitSpeed = (0.01 - (orbitSpeed * 100) * 0.0048) * 0.25,
        this.orbitInfo.orbit = Math.random() * Math.PI * 2
        this.orbitInfo.rotSpeed *= 1 < .10 ? -1 : 1;
        
        //create orbite line
        if(hasOrbitLine === true)
        {
            this.orbitLine = new THREE.Mesh( 
                new THREE.TorusGeometry( orbitRadius, 0.5, 10, 100),
                new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.5 } )
            );
            this.orbitLine.rotation.set(1.5708, 0, 0);
            this.orbitLine.position.set(this.orbitInfo.origin.x, this.orbitInfo.origin.y, this.orbitInfo.origin.z);
            this.orbitLine.data = {type: "_OrbitLine"}
            scene.add(this.orbitLine);
        }
        this.hasOrbitLine = hasOrbitLine;

        if(link === true) {this.LinkOrbit(linked);}

        Objects.push(this);
        scene.add(this.object);
        this.SetOrbitOrigin(0,0,0);
    };
}

export { Objects, Object, InitPlanets };