import {EventEmitter} from 'events';
import {Loader, Ticker} from 'pixi.js';
import * as config from './assets-config.json';
import {ModelEventNames} from './ModelEventsNames';

export class Model {

    private _loader: Loader = new Loader();
    private _ticker: Ticker = new Ticker();
    private _updateFPStimer: number = 0;
    private _spinTimer: number = 0;
    private _winningTimer: number = 0;
    public isSpinning: boolean = false;
    public speed: number = 20;
    public isWinning: boolean = false;

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
            if (this.isSpinning) {
                this._spinTimer += this._ticker.deltaMS;
                if (this._spinTimer > 3000) {
                    this.emitter.emit(ModelEventNames.STOP_REEL);
                    this.decreaseSpeed();
                } else {
                    this.emitter.emit(ModelEventNames.SPIN_REEL);
                }
            }
        })
    }

    public decreaseSpeed(): void {
        this.speed -= 1;
    }

    public resetTimers(): void {
        // this._spinTimer = 0;
        // this.speed = 20;
    }

    public addParticleEmitterTicker(particleEmitter): void {
        this._ticker.add(() => {
            if (this.isWinning) {
                particleEmitter.update(this._ticker.elapsedMS * 0.001);
                this._winningTimer += this._ticker.deltaMS;
                if (this._winningTimer > 5000) {
                    this.emitter.emit(ModelEventNames.WINNING_ANIMATION_END)
                }
            }
        })
    }

    public getTicker(): Ticker {
        return this._ticker;
    }
}