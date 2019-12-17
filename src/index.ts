import {EventEmitter} from 'events';
import {Application} from 'pixi.js';
import {Model} from './model/Model';
import {View} from './view/View';
import {Controller} from './controller/Controller';

const app = new Application({
    width: 800, height: 600, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);

const emitter = new EventEmitter();

const model = new Model(emitter);
const view = new View(emitter, app.stage);
const controller = new Controller(view, model);