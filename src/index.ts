import {EventEmitter} from 'events';
import {Model} from './model/Model';
import {View} from './view/View';
import {Controller} from './controller/Controller';

class SlotMachine {
    readonly emitter: EventEmitter;
    readonly view: View;
    readonly model: Model;
    readonly controller: Controller;

    readonly configView: {[key: string]: number | string} = {
        appWidth: 1600,
        appHeight: 800,
        numberOfReels: 1,
        numberOfRows: 3,
        uiOffsetX: 200,
        uiOffsetY: 80,
        symbolSize: 220
    };

    readonly configModel = {
        spinSpeed: 40,
        timeSpinning: 3000,
        timeWinning: 7000,
        timeFPSUpdate: 500
    };

    constructor() {
        this.emitter = new EventEmitter();
        this.model = new Model(this.emitter, this.configModel);
        this.view = new View(this.emitter, this.configView);
        this.controller = new Controller(this.view, this.model);
    }
}

window.onload = () => {
    const slot = new SlotMachine();
};
