import {EventEmitter} from 'events';
import {Container, Sprite, Texture, Graphics, Text, DisplayObject} from 'pixi.js';
import * as particles from 'pixi-particles';
import {ViewEventsNames} from './ViewEventsNames';
import * as particlesConfig from './emitter.json';

const REEL_WIDTH = 160;
const SYMBOL_SIZE = 150;
const ROWS_NUMBER = 3;
const REELS_NUMBER = 1;

export class View {
    private _stage: Container;

    public emitter: EventEmitter;
    public particlesEmitter: particles.Emitter;

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
        fpsValue.name = "FPS";
        fpsContainer.addChild(fpsValue as DisplayObject);
        this._stage.addChild(fpsContainer);
        this.emitter.emit(ViewEventsNames.ON_DRAW_FPS_LAYER);
    }

    public updateFPS(value: number): void {
        const layer = <Container>this._stage.getChildByName("Layer_FPS");
        const text = <Text>layer.getChildByName("FPS");
        text.text = `${Math.round(value)}`;
    }

    public drawGameScene(): void {
        const rc: Container = new Container();
        rc.height = SYMBOL_SIZE * ROWS_NUMBER;
        rc.width = SYMBOL_SIZE;
        this._stage.addChild(rc);

        const slotTextures = [
            Texture.from('eggHead'),
            Texture.from('flowerTop'),
            Texture.from('helmlok'),
            Texture.from('skully'),
        ];

        for (let i = 0; i <= ROWS_NUMBER; i++) {
            const symbol = new Sprite(slotTextures[i]);
            symbol.height = SYMBOL_SIZE;
            symbol.width = SYMBOL_SIZE;
            symbol.y = i * SYMBOL_SIZE;
            rc.addChild(symbol);
        }

        const mask = new Graphics();
        mask.beginFill(0x000000);
        mask.drawRect(0, 0, SYMBOL_SIZE, SYMBOL_SIZE * ROWS_NUMBER);
        mask.endFill();
        mask.lineStyle(0);
        this._stage.addChild(mask);

        rc.mask= mask;
    }

    public drawWinningLayer(): void {
        const container = new Container();
        this._stage.addChild(container);
        const particlesContainer = new Container();
        container.addChild(particlesContainer);
        this.particlesEmitter = new particles.Emitter(
            particlesContainer,
            [Texture.from('bubbles')],
            particlesConfig
        );
        this.particlesEmitter.emit = true;
    }
}