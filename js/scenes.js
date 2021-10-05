import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

var MainScene = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000),
    canvas: document.querySelector('#env'),
    renderer: undefined,
    lights : {
        ambientLight: new THREE.AmbientLight(0xffffff),
    },
    Init: function () {
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, alpha: true});
        this.camera.position.set(9.5, 18, 21);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.scene.add(this.lights.ambientLight);
        this.ChangeBG('https://raw.githubusercontent.com/l0th3r/js3DTest/main/src/assets/spacebg.jpg');
    },
    Debug: function() {
        const gridHelper = new THREE.GridHelper( 30, 100 );
        this.scene.add(gridHelper);
    },
    ChangeBG: function (path) {
        this.canvas.style.background = `url(${path}) no-repeat center center`
    },
    Render: function () {
        this.renderer.render(this.scene, this.camera);
    }
}

export { MainScene };