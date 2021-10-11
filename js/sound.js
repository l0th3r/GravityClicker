function playCollectSound() {
    var audio = new Audio('/sounds/PickUpAlt.wav');
    audio.play();
}

function playSaveSound() {
    var audio = new Audio('/sounds/GameSaved.wav');
    audio.play();
}

function playMakeMoney() {
    var audio = new Audio('/sounds/PickUp.wav');
    audio.play();
}

function playClickSound() {
    var audio = new Audio('/sounds/Click.wav');
    audio.play();
}

function playMachineSound() {
    var audio = new Audio('/sounds/MachineBien.wav');
    audio.play();
}

export { playCollectSound, playSaveSound, playMakeMoney, playClickSound, playMachineSound };