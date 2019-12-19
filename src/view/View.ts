import {EventEmitter} from 'events';
import {Container, Sprite, Texture, Text, Application} from 'pixi.js';
import * as particles from 'pixi-particles';
import {ViewEventsNames} from './ViewEventsNames';
import * as particlesConfig from './emitter.json';
import {LayerUI} from "./LayerUI";
import {LayerFPS} from "./LayerFPS";
import {LayerWinning} from "./LayerWinning";
import {ContainerNames, LayerNames} from "./ViewLayerNames";
import {TexturesNames} from "../model/AssestsConfig";
import {LayerGame} from "./LayerGame";

export class View {
    private _app: Application;
    private _body: HTMLElement;
    private _config: {[key: string]: any};
    private _background: Sprite;
    private _reel: Container;
    private _layersMap: Map<string, Container> = new Map();

    public emitter: EventEmitter;
    public particlesEmitter: particles.Emitter;

    public buttonSpin: Sprite;

    constructor(ee: EventEmitter, config: {[key: string]: any}) {
        this._config = config;
        this._app = new Application({width: this._config.appWidth, height: this._config.appHeight});
        this._body = document.body;
        this.emitter = ee;
        this._body.appendChild(this._app.view);
    }

    public addBackground(): void {
        this._background = new Sprite(Texture.from(TexturesNames.BG_GAME));
        this._background.anchor.set(0.5, 0.5);
        this._background.position.x = this._app.view.width / 2;
        this._background.position.y = this._app.view.height / 2;
        this._app.stage.addChild(this._background);
    }

    public drawUILayer(): void {
        this.addBackground();
        const container = LayerUI.draw();
        this.buttonSpin = <Sprite>container.getChildByName(ContainerNames.SPIN_BUTTON);
        this._layersMap.set(LayerNames.LAYER_UI, container);
        this._app.stage.addChild(container);
    }

    public drawFPSLayer(): void {
        const fpsContainer = LayerFPS.draw();
        this._app.stage.addChild(fpsContainer);
        this._layersMap.set(LayerNames.LAYER_FPS, fpsContainer);
        this.emitter.emit(ViewEventsNames.ON_DRAW_FPS_LAYER);
    }

    public updateFPS(value: number): void {
        const layer = <Container>this._app.stage.getChildByName(LayerNames.LAYER_FPS);
        const text = <Text>layer.getChildByName(ContainerNames.FPS_CONTAINER);
        text.text = `${value.toFixed(1)} fps`;
    }

    public drawGameScene(): void {
        const container = LayerGame.draw(this._config);
        this._layersMap.set(LayerNames.LAYER_GAME, container);
        this._app.stage.addChild(container);
        this._reel = <Container>container.getChildByName(ContainerNames.REEL_CONTAINER);
    }

    public drawWinningLayer(): void {
        const winningLayer = LayerWinning.draw();
        const particlesContainer = <Container>winningLayer.getChildByName(ContainerNames.PARTICLES_CONTAINER);
        particlesContainer.pivot.x -= particlesContainer.getBounds().width / 2;
        particlesContainer.pivot.y -= particlesContainer.getBounds().height / 2;
        this.particlesEmitter = new particles.Emitter(
            particlesContainer,
            [Texture.from(TexturesNames.BUBBLES)],
            particlesConfig
        );
        this.particlesEmitter.autoUpdate = false;
        winningLayer.x = (this._app.view.width - winningLayer.getBounds().width) / 2;
        winningLayer.y = (this._app.view.height - winningLayer.getBounds().height) / 2;
        this._layersMap.set(LayerNames.LAYER_WINNING, winningLayer);
        this._app.stage.addChild(winningLayer);
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
            if (symbol.y > this._config.symbolSize * this._config.numberOfRows) {
                symbol.texture = slotTextures[Math.round(Math.random()*(slotTextures.length - 1))];
                symbol.y = - this._config.symbolSize + (symbol.y - this._config.symbolSize * this._config.numberOfRows);
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
        const ratioHorizontal = this._body.clientWidth / this._config.appWidth;
        const ratioVertical = this._body.clientHeight / this._config.appHeight;
        const ratio = ratioHorizontal < ratioVertical ? ratioHorizontal : ratioVertical;
        this._app.view.width = this._config.appWidth * ratio;
        this._app.view.height = this._config.appHeight * ratio;
        this._background.width = this._app.view.width;
        this._background.height = this._app.view.height;
        this._background.position.x = this._app.view.width / 2;
        this._background.position.y = this._app.view.height / 2;

         this._layersMap.get(LayerNames.LAYER_WINNING).setTransform(
             this._app.view.width / 2, this._app.view.height / 2
         );
        this._layersMap.get(LayerNames.LAYER_UI).setTransform(
            this._app.view.width / 2 + this._config.uiOffsetX * ratio,
            this._app.view.height / 2 - this._config.uiOffsetY * ratio,
            ratio, ratio
        );
        this._layersMap.get(LayerNames.LAYER_FPS).setTransform(0, 0);
        const gameContainer = this._layersMap.get(LayerNames.LAYER_GAME);
        gameContainer.scale.x = gameContainer.scale.y = ratio;
        gameContainer.position.x = (this._app.view.width - gameContainer.width) / 2;
        gameContainer.position.y = (this._app.view.height - gameContainer.height) / 2;
     }

     public switchUI(): void {
        const ui = this._app.stage.getChildByName(LayerNames.LAYER_UI);
        ui.visible = !ui.visible;
     }
}
