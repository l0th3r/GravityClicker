import * as THREE from 'three';
import { MainScene } from './scenes';

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	MainScene.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	MainScene.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

window.addEventListener('mousemove', onMouseMove, false);