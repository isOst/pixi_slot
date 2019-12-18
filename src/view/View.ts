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
    private _reel: Container;

    public emitter: EventEmitter;
    public particlesEmitter: particles.Emitter;

    public buttonSpin: Sprite;

    constructor(ee: EventEmitter, stage: Container) {
        this._stage = stage;
        this.emitter = ee;
    }

    public drawUILayer(): void {
        const container = new Container();
        container.name = "Layer_UI";
        this.buttonSpin = new Sprite(Texture.from("button"));
        this.buttonSpin.name = "spin_button";
        this.buttonSpin.interactive = true;
        this.buttonSpin.buttonMode = true;
        container.addChild(this.buttonSpin);
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
        this._reel = new Container();
        this._reel.height = SYMBOL_SIZE * ROWS_NUMBER;
        this._reel.width = SYMBOL_SIZE;
        this._stage.addChild(this._reel);

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
            this._reel.addChild(symbol);
        }

        const mask = new Graphics();
        mask.beginFill(0x000000);
        mask.drawRect(0, 0, SYMBOL_SIZE, SYMBOL_SIZE * ROWS_NUMBER);
        mask.endFill();
        mask.lineStyle(0);
        this._stage.addChild(mask);

        this._reel.mask= mask;
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
        container.x = this._stage.getBounds().width / 2;
        container.y = this._stage.getBounds().height / 2;
        container.pivot.x -= container.getBounds().width / 2;
        container.pivot.y -= container.getBounds().height / 2;
        this.particlesEmitter.emit = true;
    }

    public spinReel(speed: number): void {
        this._reel.children.forEach((symbol) => {
            symbol.y += speed;
            if (symbol.y > SYMBOL_SIZE * ROWS_NUMBER) {
                symbol.y = -SYMBOL_SIZE;
            }
        });
    }

    public stopReel(speed): void {
        let distance: number = this._reel.children[0].y;
        this._reel.children.forEach((symbol) => {
            if (symbol.y <= 0) { distance = Math.abs(symbol.y) }
        });
        if (distance <= 1) {
            this.emitter.emit(ViewEventsNames.ON_REEL_STOP);
        } else {
            this._reel.children.forEach((symbol) => {
                symbol.y += speed;
            });
        }
    }

     public onResize(): void {
        this._stage.position.x = (window.innerWidth - this._stage.getBounds().width) / 2;
        this._stage.position.y = (window.innerHeight - this._stage.getBounds().height) / 2;
     }
}