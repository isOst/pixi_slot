import {EventEmitter} from 'events';
import {Loader, Ticker} from 'pixi.js';
import {ModelEventNames} from './ModelEventsNames';
import {TexturesPaths} from "./AssestsConfig";

export class Model {

    private _loader: Loader = new Loader();
    private _ticker: Ticker = new Ticker();
    private _updateFPStimer: number = 0;
    private _spinTimer: number = 0;
    private _winningTimer: number = 0;
    public isSpinning: boolean = false;
    public speed: number = 40;
    public isWinning: boolean = false;

    public emitter: EventEmitter;

    constructor(ee: EventEmitter) {
        this.emitter = ee;
        this._ticker.start();
        this.loadAssets();
    }

    public loadAssets(): void {
        for (let asset in TexturesPaths) {
            this._loader.add(asset, TexturesPaths[asset]);
        }
        this._loader.load(() => {
            this.emitter.emit(ModelEventNames.ASSETS_LOADED)
        });
    }

    public startUpdateFPS(): void {
        this._ticker.add(() => {
            this._updateFPStimer += this._ticker.deltaMS;
            if (this._updateFPStimer > 500) {
                this.emitter.emit(ModelEventNames.ON_UPDATE_FPS);
                this._updateFPStimer = 0;
            }
        });

        this._ticker.add(() => {
            if (this.isSpinning) {
                this._spinTimer += this._ticker.deltaMS;
                if (this._spinTimer > 3000) {
                    this.emitter.emit(ModelEventNames.STOP_REEL);
                    // tricky thing to make some kind of easing
                    this.speed = Math.sqrt(this.speed);
                } else {
                    this.speed = 40;
                    this.emitter.emit(ModelEventNames.SPIN_REEL);
                }
            }
        })
    }

    public resetTimers(): void {
        this._spinTimer = 0;
        this._winningTimer = 0;
    }

    public addParticleEmitterTicker(particleEmitter): void {
        this._ticker.add(() => {
            if (this.isWinning) {
                particleEmitter.update(this._ticker.elapsedMS * 0.001);
                this._winningTimer += this._ticker.deltaMS;
                if (this._winningTimer > 7000) {
                    this.emitter.emit(ModelEventNames.WINNING_ANIMATION_END)
                }
            }
        })
    }

    public getTicker(): Ticker {
        return this._ticker;
    }
}
