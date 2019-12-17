import {EventEmitter} from 'events';
import {Container, Sprite, Texture, Graphics} from 'pixi.js';
import {ViewEventsNames} from './ViewEventsNames';

const REEL_WIDTH = 160;
const SYMBOL_SIZE = 150;
const ROWS_NUMBER = 3;
const REELS_NUMBER = 1;

export class View {
    private _stage: Container;

    public emitter: EventEmitter;

    constructor(ee: EventEmitter, stage: Container) {
        this._stage = stage;
        this.emitter = ee;
    }

    public drawUILayer(): void {
        const container = new Container();
        container.name = "Layer_UI";
        const spinButton = new Sprite(Texture.from("button"));
        container.interactive = true;
        container.buttonMode = true;
        container.addChild(spinButton);
        this._stage.addChild(container);
    }

    public drawFPSLayer(): void {
        const fpsContainer = new Container();
        fpsContainer.name = "Layer_FPS";
        fpsContainer.x = SYMBOL_SIZE + 20;
        const fpsBg = new Graphics();
        fpsBg.beginFill(0x000000, 0.6);
        fpsBg.drawRect(0, 0, 60, 40);
        fpsBg.endFill();
        fpsContainer.addChild(fpsBg);
        const fpsValue = new Text('0');
        // fpsValue.name = "FPS";
        fpsContainer.addChild(fpsValue);
        this._stage.addChild(fpsContainer);
        this.emitter.emit(ViewEventsNames.ON_DRAW_FPS_LAYER);
    }

    public updateFPS(value: number): void {
        const layer = this._stage.getChildByName("Layer_FPS");
        const text = layer.getChildren()[1];
        text.text = `${Math.round(value)}`;
    }
}