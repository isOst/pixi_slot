import {EventEmitter} from 'events';
import {Loader, Ticker} from 'pixi.js';
import {ModelEventNames} from './ModelEventsNames';
import {TexturesPaths} from "./AssestsConfig";

export class Model {
    private _config: {[key: string]: any};
    private _loader: Loader = new Loader();
    private _ticker: Ticker = new Ticker();
    private _updateFPStimer: number = 0;
    private _spinTimer: number = 0;
    private _winningTimer: number = 0;
    public isSpinning: boolean = false;
    public speed: number;
    public isWinning: boolean = false;

    public emitter: EventEmitter;

    constructor(ee: EventEmitter, config: {[key: string]: any}) {
        this.emitter = ee;
        this._config = config;
        this.speed = this._config.spinSpeed;
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
            if (this._updateFPStimer > this._config.timeFPSUpdate) {
                this.emitter.emit(ModelEventNames.ON_UPDATE_FPS);
                this._updateFPStimer = 0;
            }
        });
        //TODO: Separate adding of spin ticker
        this._ticker.add(() => {
            if (this.isSpinning) {
                this._spinTimer += this._ticker.deltaMS;
                if (this._spinTimer > this._config.timeSpinning) {
                    this.emitter.emit(ModelEventNames.STOP_REEL);
                    // tricky thing to make some kind of easing
                    this.speed = Math.sqrt(this.speed);
                } else {
                    this.speed = this._config.spinSpeed;
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
                if (this._winningTimer > this._config.timeSpinning) {
                    this.emitter.emit(ModelEventNames.WINNING_ANIMATION_END)
                }
            }
        })
    }

    public getTicker(): Ticker {
        return this._ticker;
    }
}
