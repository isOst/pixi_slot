import {Container, Graphics, Sprite, Texture} from 'pixi.js';
import {Layer} from "./Layer";

export class LayerUI extends Layer {
    public static draw(): Container {
        const container = super.draw();
        container.name = "Layer_UI";
        const bg = new Graphics();
        bg.beginFill(0x000000, 0.7);
        bg.drawCircle(0, 0, 40);
        bg.endFill();
        bg.position.x = bg.width / 2;
        bg.position.y = bg.height / 2;
        const buttonSpin = new Sprite(Texture.from("button"));
        buttonSpin.name = "spin_button";
        buttonSpin.interactive = true;
        buttonSpin.buttonMode = true;
        buttonSpin.width = 50;
        buttonSpin.height = 50;
        buttonSpin.x = (bg.width - buttonSpin.width) / 2;
        buttonSpin.y = (bg.height - buttonSpin.height) / 2;
        container.addChild(bg);
        container.addChild(buttonSpin);
        return container;
    }
}