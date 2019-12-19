import {EventEmitter} from 'events';
import {Application} from 'pixi.js';
import {Model} from './model/Model';
import {View} from './view/View';
import {Controller} from './controller/Controller';

const app = new Application({
    width: 1600, height: 800
});
const body = document.body;
body.appendChild(app.view);

const emitter = new EventEmitter();

const model = new Model(emitter);
const view = new View(emitter, app, body);
const controller = new Controller(view, model);
