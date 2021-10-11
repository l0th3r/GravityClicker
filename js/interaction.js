import { MainScene } from './scenes';

const canvas = document.getElementById("env");

var InteractionState = {
	isMouseInCanvas: false,
}

function onMouseMove( event ) {

	if(InteractionState.isMouseInCanvas === true){
		MainScene.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		MainScene.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		
		MainScene.HoverObjects();
	}
}

function onMouseClick( event ) {
	if(InteractionState.isMouseInCanvas === true){
		MainScene.Click();
	}
}

// know if mouse is in the canvas
canvas.addEventListener('mouseleave', ()=>{InteractionState.isMouseInCanvas = false;document.body.style.cursor = 'default';});
canvas.addEventListener('mouseenter', ()=>InteractionState.isMouseInCanvas = true);

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', onMouseClick, false);

export default InteractionState;