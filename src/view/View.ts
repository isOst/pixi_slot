import {EventEmitter} from 'events';
import {Container, Sprite, Texture, Graphics, Text, Application} from 'pixi.js';
import * as particles from 'pixi-particles';
import {ViewEventsNames} from './ViewEventsNames';
import * as particlesConfig from './emitter.json';
import {LayerUI} from "./LayerUI";
import {LayerFPS} from "./LayerFPS";
import {LayerWinning} from "./LayerWinning";
import {ContainerNames, LayerNames} from "./ViewLayerNames";
import {TexturesNames} from "../model/AssestsConfig";

const REEL_WIDTH = 160;
const SYMBOL_SIZE = 220;
const ROWS_NUMBER = 3;
const REELS_NUMBER = 1;

export class View {
    private _app: Application;
    private _body: HTMLElement;
    private _background: Sprite;
    private _gameContainer: Container;
    private _reel: Container;

    public emitter: EventEmitter;
    public particlesEmitter: particles.Emitter;

    public buttonSpin: Sprite;

    constructor(ee: EventEmitter, app: Application, body: HTMLElement) {
        this._app = app;
        this._body = body;
        this.emitter = ee;
    }

    public addBackground(): void {
        this._background = new Sprite(Texture.from(TexturesNames.BG_GAME));
        this._background.anchor.set(0.5, 0.5);
        this._background.position.x = this._app.view.width / 2;
        this._background.position.y = this._app.view.height / 2;
        this._app.stage.addChild(this._background);
        this._gameContainer = new Container();
        this._app.stage.addChild(this._gameContainer);
    }

    public drawUILayer(): void {
        this.addBackground();
        const container = LayerUI.draw();
        this.buttonSpin = <Sprite>container.getChildByName(ContainerNames.SPIN_BUTTON);
        this._app.stage.addChild(container);
    }

    public drawFPSLayer(): void {
        const fpsContainer = LayerFPS.draw();
        this._app.stage.addChild(fpsContainer);
        this.emitter.emit(ViewEventsNames.ON_DRAW_FPS_LAYER);
    }

    public updateFPS(value: number): void {
        const layer = <Container>this._app.stage.getChildByName(LayerNames.LAYER_FPS);
        const text = <Text>layer.getChildByName(ContainerNames.FPS_CONTAINER);
        text.text = `${value.toFixed(1)} fps`;
    }

    public drawGameScene(): void {
        this._reel = new Container();
        this._reel.height = SYMBOL_SIZE * ROWS_NUMBER;
        this._reel.width = SYMBOL_SIZE;
        this._gameContainer.addChild(this._reel);

        const slotTextures = [
            Texture.from(TexturesNames.EGG_HEAD),
            Texture.from(TexturesNames.FLOWER_TOP),
            Texture.from(TexturesNames.HELMLOK),
            Texture.from(TexturesNames.SKULLY),
        ];

        for (let i = 0; i <= ROWS_NUMBER; i++) {
            const symbol = new Sprite(slotTextures[i]);
            symbol.height = SYMBOL_SIZE;
            symbol.width = SYMBOL_SIZE;
            symbol.y = i * SYMBOL_SIZE;
            symbol.x = (SYMBOL_SIZE * 1.1 - SYMBOL_SIZE) / 2;
            this._reel.addChild(symbol);
        }

        const mask = new Graphics();
        mask.beginFill(0x000000);
        mask.drawRect(0, 0, SYMBOL_SIZE*1.1, SYMBOL_SIZE * ROWS_NUMBER);
        mask.endFill();
        mask.lineStyle(0);
        this._gameContainer.addChild(mask);

        this._reel.mask= mask;
    }

    public drawWinningLayer(): void {
        const container = LayerWinning.draw();
        const particlesContainer = <Container>container.getChildByName(ContainerNames.PARTICLES_CONTAINER);
        this.particlesEmitter = new particles.Emitter(
            particlesContainer,
            [Texture.from(TexturesNames.BUBBLES)],
            particlesConfig
        );
        container.x = this._gameContainer.getBounds().width / 2;
        container.y = this._gameContainer.getBounds().height / 2;
        this._gameContainer.addChild(container);
    }

    public spinReel(speed: number): void {
        const slotTextures = [
            Texture.from(TexturesNames.EGG_HEAD),
            Texture.from(TexturesNames.FLOWER_TOP),
            Texture.from(TexturesNames.HELMLOK),
            Texture.from(TexturesNames.SKULLY),
        ];
        this._reel.children.forEach((symbol: Sprite) => {
            symbol.y += speed;
            if (symbol.y > SYMBOL_SIZE * ROWS_NUMBER) {
                symbol.texture = slotTextures[Math.round(Math.random()*(slotTextures.length - 1))];
                symbol.y = -SYMBOL_SIZE + (symbol.y - SYMBOL_SIZE * ROWS_NUMBER);
            }
        });
    }

    public stopReel(speed: number): void {
        let distance: number = this._reel.children[0].y;
        this._reel.children.forEach((symbol: Sprite) => {
            if (symbol.y <= 0) { distance = Math.abs(symbol.y) }
        });
        if (distance <= 1) {
            this.emitter.emit(ViewEventsNames.ON_REEL_STOP);
        } else {
            this._reel.children.forEach((symbol: Sprite) => {
                symbol.y += speed;
            });
        }
    }

     public onResize(): void {
        const ratioHorizontal = this._body.clientWidth / 1600;
        const ratioVertical = this._body.clientHeight / 800;
        const ratio = ratioHorizontal < ratioVertical ? ratioHorizontal : ratioVertical;
        this._app.view.width = 1600 * ratio;
        this._app.view.height = 800 * ratio;
        this._background.width = this._app.view.width;
        this._background.height = this._app.view.height;
        this._background.position.x = this._app.view.width / 2;
        this._background.position.y = this._app.view.height / 2;
        this._gameContainer.scale.x = ratio;
        this._gameContainer.scale.y = ratio;
        this._gameContainer.position.x = (this._app.view.width - this._gameContainer.width) / 2;
        this._gameContainer.position.y = (this._app.view.height - this._gameContainer.height) / 2;
        this.buttonSpin.parent.x = this._gameContainer.x + this._gameContainer.width + 20;
        this.buttonSpin.parent.y = this._gameContainer.y + this._gameContainer.height / 2;
     }

     public switchUI(): void {
        const ui = this._app.stage.getChildByName(LayerNames.LAYER_UI);
        ui.visible = !ui.visible;
     }
}
