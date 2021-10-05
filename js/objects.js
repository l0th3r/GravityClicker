import * as THREE from 'three';
import { MainScene } from './scenes.js';
import { Data } from './data';

var Objects = [];

function InitPlanets() {

    const moon_t = new THREE.TextureLoader().load('https://raw.githubusercontent.com/l0th3r/js3DTest/main/src/assets/moon.jpg');

    const sun_obj = new THREE.Mesh(
        new THREE.SphereGeometry(60, 32, 32),
        new THREE.MeshStandardMaterial({
            color: 0xffffff
        })
    );

    new Object(MainScene.scene, "sun", sun_obj, 0, 0, 0, true);

    Data.forEach((planet, i) => {
        
        console.log(planet);
        const temp_obj = new THREE.Mesh(
            new THREE.SphereGeometry(Math.floor(planet.equaRadius * 0.001) / 3, 32, 32),
            new THREE.MeshStandardMaterial({
                map: moon_t
            })
        );

        new Object(MainScene.scene, planet.englishName, temp_obj, i * 35 + 100, Math.random(), Math.random() * 0.2, true, {info: planet});
    });
}

class Object {
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
        this.orbitInfo.rot += this.orbitInfo.rotSpeed;
        this.orbitInfo.orbit += this.orbitInfo.orbitSpeed;
        this.object.rotation.set(0, this.orbitInfo.rot, 0);
        this.object.position.set((Math.cos(this.orbitInfo.orbit) * this.orbitInfo.orbitRadius) + this.orbitInfo.origin.x, this.orbitInfo.origin.y, (Math.sin(this.orbitInfo.orbit) * this.orbitInfo.orbitRadius) + this.orbitInfo.origin.z);
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
    constructor(scene, name, object, orbitRadius, rotSpeed, orbitSpeed, hasOrbitLine = true, data = {}, link = false, linked = undefined) {
        // set object settings
        this.name = name;
        this.object = object;
        this.object.data = data;
        this.object.position.set(orbitRadius, 0, 0);
        
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