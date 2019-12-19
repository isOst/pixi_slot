import {Container, Graphics, Sprite, Texture} from 'pixi.js';
import {Layer} from "./Layer";

export class LayerWinning extends Layer {
    public static draw(): Container {
        const container = super.draw();
        container.name = "Layer_Winning";
        const particlesContainer = new Container();
        particlesContainer.name = "particles_container";
        container.addChild(particlesContainer);
        container.pivot.x -= container.getBounds().width / 2;
        container.pivot.y -= container.getBounds().height / 2;
        return container;
    }
}