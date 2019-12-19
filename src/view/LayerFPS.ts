import {Container, DisplayObject, Graphics, Text} from 'pixi.js';
import {Layer} from "./Layer";

export class LayerFPS extends Layer {
    public static draw(): Container {
        const fpsContainer = super.draw();
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
        return fpsContainer;
    }
}