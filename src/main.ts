import {Application,
    Texture,
    Sprite,
    Container,
    Graphics,
    Text } from "pixi.js";
import {EventEmitter} from 'events';

const app = new Application({
    width: 800, height: 600, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);

app.loader
    .add('eggHead', './assets/eggHead.png')
    .add('flowerTop', './assets/flowerTop.png')
    .add('helmlok', './assets/helmlok.png')
    .add('skully', './assets/skully.png')
    .add('button', './assets/button.png')
    .load(onAssetsLoaded);

const REEL_WIDTH = 160;
const SYMBOL_SIZE = 150;
const ROWS_NUMBER = 3;
const REELS_NUMBER = 1;

function onAssetsLoaded() {
    const slotTextures = [
        Texture.from('eggHead'),
        Texture.from('flowerTop'),
        Texture.from('helmlok'),
        Texture.from('skully'),
    ];

    const rc: Container = new Container();
    rc.height = SYMBOL_SIZE * ROWS_NUMBER;
    rc.width = SYMBOL_SIZE;
    app.stage.addChild(rc);

    const mask = new Graphics();
    mask.beginFill(0x000000);
    mask.drawRect(0, 0, SYMBOL_SIZE, SYMBOL_SIZE * ROWS_NUMBER);
    mask.endFill();
    app.stage.addChild(mask);
    mask.lineStyle(0);

    for (let i = 0; i <= ROWS_NUMBER; i++) {
        const symbol = new Sprite(slotTextures[i]);
        symbol.height = SYMBOL_SIZE;
        symbol.width = SYMBOL_SIZE;
        symbol.y = i * SYMBOL_SIZE;
        rc.addChild(symbol);
    }

    rc.mask= mask;

    let spinning = false;
    let spinningTimeCounter = 0;
    let spinningFinish = false;

    const buttonTexture = Texture.from("button");
    const button = new Sprite(buttonTexture);
    button.x = SYMBOL_SIZE + 20;
    button.y = SYMBOL_SIZE + 50;
    button.interactive = true;
    button.buttonMode = true;
    app.stage.addChild(button);
    button.addListener("pointerdown", () => {
        spinning = true;
    });
    const emmiter = new EventEmitter();
    window.addEventListener("Hello", (event) => {
        console.log(event)
    });
    emmiter.on("Hello", ()=> {console.log("Hello")});
    mask.on("Hello", (e)=>{console.log(e)});
    button.emit("Hello");
    emmiter.emit("Hello");

    const fpsContainer = new Container();
    fpsContainer.x = SYMBOL_SIZE + 20;
    const fpsBg = new Graphics();
    fpsBg.beginFill(0x000000, 0.6);
    fpsBg.drawRect(0, 0, 60, 40);
    fpsBg.endFill();
    fpsContainer.addChild(fpsBg);
    let fpsValue = new Text('0');
    fpsContainer.addChild(fpsValue);
    app.stage.addChild(fpsContainer);

    let updateCounter = 0;

    app.ticker.add((delta) => {
        updateCounter += app.ticker.deltaMS;
        if (updateCounter > 1000) {
            updateCounter = 0;
            fpsValue.text = `${Math.round(app.ticker.FPS)}`;
        }
    });

    app.ticker.add((delta) => {
        if (spinning) {
            rc.children.forEach((symbol) => {
                symbol.y += app.ticker.deltaMS;
                if (symbol.y > SYMBOL_SIZE * ROWS_NUMBER) {
                    symbol.y = -SYMBOL_SIZE;
                }
            });
            spinningTimeCounter += app.ticker.deltaMS;
            if (spinningTimeCounter > 3000) {
                console.log(delta);
                spinning = false;
                spinningFinish = true;
                spinningTimeCounter = 0;
            }
        }
    })
}