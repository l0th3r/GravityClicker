import * as THREE from 'three';
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

var MainScene = {
    allowHover: true,
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1500),
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
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        //this.camera.position.sub(new Vector3(0,0,0)).setLength(100).add(new Vector3(0,0,0));

        this.scene.add(this.lights.ambientLight);
        this.ChangeBG('/textures/stars.jpg');
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
    }
}

export { MainScene };