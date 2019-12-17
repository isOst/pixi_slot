import {EventEmitter} from 'events';
import {Loader, Ticker} from 'pixi.js';
import * as config from './assets-config.json';
import {ModelEventNames} from './ModelEventsNames';

export class Model {

    private _loader: Loader = new Loader();
    private _ticker: Ticker = new Ticker();
    private _updateFPStimer: number = 0;

    public emitter: EventEmitter;

    constructor(ee: EventEmitter) {
        this.emitter = ee;
        this._ticker.start();
        this.loadAssets();
    }

    public loadAssets(): void {
        for (let asset in config) {
            this._loader.add(asset, config[asset]);
        }
        this._loader.load(() => {
            this.emitter.emit(ModelEventNames.ASSETS_LOADED)
        });
    }

    public startUpdateFPS(): void {
        this._ticker.add(() => {
            this._updateFPStimer += this._ticker.deltaMS;
            if (this._updateFPStimer > 1000) {
                this.emitter.emit(ModelEventNames.ON_UPDATE_FPS);
                this._updateFPStimer = 0;
            }
        });
        this._ticker.add(() => {
            if (this._ > 1000) {
                this.emitter.emit(ModelEventNames.ON_UPDATE_FPS);
                this._updateFPStimer = 0;
            }
        })
    }

    public getTicker(): Ticker {
        return this._ticker;
    }
}