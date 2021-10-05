import * as THREE from 'three';

var Textures = [];

class Texture {
    name = "null";
    txtr = undefined;
    isReady = false;
    ErrorHandler(err) {
        console.warn('texture: ' + err.target.src + " haven't loaded...");
    };
    async LoadTexture() {
        this.txtr = await new THREE.TextureLoader().load(this.path, ()=>{this.isReady = true}, undefined, this.ErrorHandler);
    };
    constructor(name, path) {
        this.isReady = false;
        Textures.push(this);
        this.name = name;
        this.path = path;
        this.LoadTexture();
    }
}

const GetTexture = function (name) {
    const temp = Textures.filter(t => t.name === name);
    console.log(temp[0].isReady);
    if(temp[0].isReady)
        return temp[0].txtr;
    else
        return undefined;
}

export {GetTexture, Texture};