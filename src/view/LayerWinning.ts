import {Container, Graphics, Sprite, Texture} from 'pixi.js';
import {Layer} from "./Layer";
import {ContainerNames, LayerNames} from "./ViewLayerNames";

export class LayerWinning extends Layer {
    public static draw(): Container {
        const container = super.draw();
        container.name = LayerNames.LAYER_WINNING;
        const particlesContainer = new Container();
        particlesContainer.name = ContainerNames.PARTICLES_CONTAINER;
        container.addChild(particlesContainer);
        container.pivot.x -= container.getBounds().width / 2;
        container.pivot.y -= container.getBounds().height / 2;
        return container;
    }
}