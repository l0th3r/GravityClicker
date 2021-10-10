import * as THREE from 'three';
import { UpdatePlanetsProgressBar, Mine } from './interface';
import { UserData } from "./userdata";

var MiningEvents = [];

class MiningEvent {
    clock = new THREE.Clock();
    planetId = "null";
    maxTime = 0;
    currentDelta = 0;
    currentPourcentage = 0;
    remap(from, fromMin, fromMax, toMin, toMax) {
        var fromAbs  =  from - fromMin;
        var fromMaxAbs = fromMax - fromMin;      
        var normal = fromAbs / fromMaxAbs;
        var toMaxAbs = toMax - toMin;
        var toAbs = toMaxAbs * normal;
        var to = toAbs + toMin;
        return to;
    };
    Then() {
        // mine ressource
        Mine(this.planetId);

        // set progress value to 0 and update UI
        UserData.GetPlanetData(this.planetId).data.miningProgression = 0;
        UpdatePlanetsProgressBar(this.planetId);
        
        // remove event
        MiningEvents.splice(this.eventIndex, 1);
    }
    Update() {
        if(this.currentPourcentage < 100) {
            this.currentDelta += this.clock.getDelta();
            this.currentPourcentage = this.remap(this.maxTime - this.currentDelta, 0, this.maxTime, 100, 0);
            
            // Update planet Data
            UserData.GetPlanetData(this.planetId).data.miningProgression = this.currentPourcentage;
            UserData.GetPlanetData(this.planetId).data.deltaProgression = this.currentDelta;
        } else {
            this.Then();
        }
    }
    constructor(planetId, time, startDelta = 0) {
        if(!(MiningEvents.filter(me=>me.planetId === planetId).length > 0)) {
            this.planetId = planetId;
            this.maxTime = time;
            this.currentDelta = startDelta;
            this.eventIndex = MiningEvents.length;
            MiningEvents.push(this);
        }
    }
}

export { MiningEvents, MiningEvent };