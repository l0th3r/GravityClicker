import * as THREE from 'three';
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Objects } from './objects';

var MainScene = {
    allowHover: true,
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1500),
    cameraTarget: undefined,
    raycaster: new THREE.Raycaster(),
    mouse: {x: 0, y:0},
    canvas: document.querySelector('#env'),
    lights : {
        ambientLight: new THREE.AmbientLight(0xffffff),
    },
    Init: function () {
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, alpha: true});
        this.camera.position.set(600, 600, 0);
        this.camera.rotation.set(10, 0, 0);
        this.cameraBasePos = this.camera.position;
        this.cameraBaseRot = this.camera.rotation;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.scene.add(this.lights.ambientLight);
        this.ChangeBG('/textures/stars.jpg');
    },
    Update: function () {
        if(this.cameraTarget)
        {
            const objPos = this.cameraTarget.object.position;
            this.camera.lookAt(new Vector3(objPos.x, objPos.y, objPos.z));

        } else {
            this.camera.lookAt(new Vector3(0, 0, 0));
        }
    },
    Debug: function() {
        const gridHelper = new THREE.GridHelper( 1000, 100 );
        this.scene.add(gridHelper);
        window.addEventListener('click', ()=>{console.log(this.camera.position); console.log(this.camera.rotation)});
    },
    ChangeBG: function (path) {
        this.canvas.style.background = `url(${path}) no-repeat center center`
    },
    Render: function () {
        this.renderer.render(this.scene, this.camera);
    },
    Click: function() {
        if(this.hoveredObject)
            this.hoveredObject.Interact(this.hoveredObject);
    },
    hoveredObject: undefined,
    HoverObjects: function() {
        
        if(this.allowHover === true) {    
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const hdObjects = this.raycaster.intersectObjects(this.scene.children);
            
            if(hdObjects.length > 0) {
                if(hdObjects[0].object.data.type === "_Interactible" && hdObjects[0].object.data.parent != this.hoveredObject) {
                    this.hoveredObject = hdObjects[0].object.data.parent;
                    if(this.hoveredObject.allowInteraction === true)
                    {
                        this.hoveredObject.Hover(this.hoveredObject);
                        document.body.style.cursor = 'pointer';
                    }
                }
                
            } else {
                if(this.hoveredObject)
                {
                    this.hoveredObject.UnHover(this.hoveredObject);
                    this.hoveredObject = undefined;
                }
                document.body.style.cursor = 'default';
            }
        }
    },
    FocusObject: function(planetId) {

        if(this.cameraTarget) {
            this.UnfocusObject();
        }

        const planet = Objects.filter(p => p.id === planetId)[0];
        planet.allowMovements = false;
    
        // set the camera target
        this.cameraTarget = planet;
        this.camera.position.set(planet.object.position.x - 30, planet.object.position.y + 30, planet.object.position.z - 30);
    },
    UnfocusObject: function () {
        if(this.cameraTarget)
            this.cameraTarget.allowMovements = true;
        this.cameraTarget = undefined;

        this.camera.position.set(600, 600, 0);
        this.camera.rotation.set(10, 0, 0);
    }
}

export { MainScene };