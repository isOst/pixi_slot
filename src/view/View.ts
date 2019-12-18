import {EventEmitter} from 'events';
import {Container, Sprite, Texture, Graphics, Text, DisplayObject, Application} from 'pixi.js';
import * as particles from 'pixi-particles';
import {ViewEventsNames} from './ViewEventsNames';
import * as particlesConfig from './emitter.json';

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
        this._app.stage.pivot.x = -this._app.stage.getBounds().width / 2;
        this._app.stage.pivot.y = -this._app.stage.getBounds().height / 2;
        this._background = new Sprite(Texture.from("bg_game"));
        this._background.anchor.set(0.5, 0.5);
        this._background.position.x = this._app.view.width / 2;
        this._background.position.y = this._app.view.height / 2;
        this._app.stage.addChild(this._background);
        this._gameContainer = new Container();
        this._app.stage.addChild(this._gameContainer);
    }

    public drawUILayer(): void {
        this.addBackground();
        const container = new Container();
        container.name = "Layer_UI";
        const bd = new Graphics();
        bd.beginFill(0x000000, 0.7);
        bd.drawCircle(0, 0, 40);
        bd.endFill();
        bd.position.x = bd.width / 2;
        bd.position.y = bd.height / 2;
        this.buttonSpin = new Sprite(Texture.from("button"));
        this.buttonSpin.name = "spin_button";
        this.buttonSpin.interactive = true;
        this.buttonSpin.buttonMode = true;
        this.buttonSpin.width = 50;
        this.buttonSpin.height = 50;
        this.buttonSpin.x = (bd.width - this.buttonSpin.width) / 2;
        this.buttonSpin.y = (bd.height - this.buttonSpin.height) / 2;
        container.x = this._app.stage.width - container.getBounds().width;
        container.y = this._app.stage.height - container.getBounds().height / 2;
        container.addChild(bd);
        container.addChild(this.buttonSpin);
        this._app.stage.addChild(container);
    }

    public drawFPSLayer(): void {
        const fpsContainer = new Container();
        fpsContainer.name = "Layer_FPS";
        fpsContainer.x = 0;
        const fpsBg = new Graphics();
        fpsBg.beginFill(0x000000, 0.6);
        fpsBg.drawRect(0, 0, 120, 80);
        fpsBg.endFill();
        fpsContainer.addChild(fpsBg);
        const fpsHeader = new Text('FPS monitor',
            {fill: 0x00ff00, fontSize: 18, align: "center"});
        fpsHeader.anchor.set(0.5, 0);
        fpsHeader.position.x = fpsBg.width / 2;
        fpsHeader.name = "FPS_header";
        const fpsValue = new Text('0', {fill: 0xffffff, fontSize: 30, align: "center"});
        fpsValue.name = "FPS";
        fpsValue.anchor.set(0.5, 0.5);
        fpsValue.position.x = fpsBg.width / 2;
        fpsValue.position.y = fpsBg.height / 2;
        fpsContainer.addChild(fpsHeader as DisplayObject);
        fpsContainer.addChild(fpsValue as DisplayObject);
        this._app.stage.addChild(fpsContainer);
        this.emitter.emit(ViewEventsNames.ON_DRAW_FPS_LAYER);
    }

    public updateFPS(value: number): void {
        const layer = <Container>this._app.stage.getChildByName("Layer_FPS");
        const text = <Text>layer.getChildByName("FPS");
        text.text = `${value.toFixed(1)} fps`;
    }

    public drawGameScene(): void {
        this._reel = new Container();
        this._reel.height = SYMBOL_SIZE * ROWS_NUMBER;
        this._reel.width = SYMBOL_SIZE;
        this._gameContainer.addChild(this._reel);

        const bg = new Sprite(Texture.from("bg_reel"));
        bg.alpha = 0.6;
        bg.anchor.set(0.5, 0.5);
        this._reel.addChild(bg);

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
            symbol.x = (SYMBOL_SIZE * 1.1 - SYMBOL_SIZE) / 2;
            this._reel.addChild(symbol);
        }

        const mask = new Graphics();
        mask.beginFill(0x000000);
        mask.drawRect(0, 0, SYMBOL_SIZE*1.1, SYMBOL_SIZE * ROWS_NUMBER);
        mask.endFill();
        mask.lineStyle(0);
        bg.x = mask.width / 2;
        bg.y = mask.height / 2;
        this._gameContainer.addChild(mask);

        this._reel.mask= mask;
    }

    public drawWinningLayer(): void {
        const container = new Container();
        this._gameContainer.addChild(container);
        const particlesContainer = new Container();
        container.addChild(particlesContainer);
        this.particlesEmitter = new particles.Emitter(
            particlesContainer,
            [Texture.from('bubbles')],
            particlesConfig
        );
        container.x = this._gameContainer.getBounds().width / 2;
        container.y = this._gameContainer.getBounds().height / 2;
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
                symbol.y += 1;
            });
        }
    }

     public onResize(): void {
        console.log(this._app);
        const ratioHorizontal = this._body.clientWidth / 1600;
        const ratioVertical = this._body.clientHeight / 800;
        const ratioView = ratioHorizontal > ratioVertical ? ratioHorizontal : ratioVertical;
        const ratioStage = ratioHorizontal < ratioVertical ? ratioHorizontal : ratioVertical;
        this._app.view.width = 1600 * ratioStage;
        this._app.view.height = 800 * ratioStage;
        this._background.width = this._app.view.width;
        this._background.height = this._app.view.height;
        this._background.position.x = this._app.view.width / 2;
        this._background.position.y = this._app.view.height / 2;
        this._gameContainer.scale.x = ratioStage;
        this._gameContainer.scale.y = ratioStage;
        this._gameContainer.position.x = (this._app.view.width - this._gameContainer.width) / 2;
        this._gameContainer.position.y = (this._app.view.height - this._gameContainer.height) / 2;
        this.buttonSpin.parent.x = this._gameContainer.x + this._gameContainer.width + 20;
        this.buttonSpin.parent.y = this._gameContainer.y + this._gameContainer.height / 2;
     }

     public switchUI(): void {
        const ui = this._app.stage.getChildByName("Layer_UI");
        ui.visible = !ui.visible;
     }
}
