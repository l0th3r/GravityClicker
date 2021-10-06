import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

var MainScene = {
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
        this.camera.position.set(506.6200247239426, 408.80277449475, 88.76608057473604);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.scene.add(this.lights.ambientLight);
        this.ChangeBG('/textures/stars.jpg');
    },
    Debug: function() {
        const gridHelper = new THREE.GridHelper( 1000, 100 );
        this.scene.add(gridHelper);
        window.addEventListener('click', ()=>console.log(this.camera.position));
    },
    ChangeBG: function (path) {
        this.canvas.style.background = `url(${path}) no-repeat center center`
    },
    Render: function () {
        this.renderer.render(this.scene, this.camera);
    },
    hoveredObjects: [],
    HoverObjects: function() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.hoveredObjects = raycaster.intersectObjects(this.scene.children);
    }
}

export { MainScene };