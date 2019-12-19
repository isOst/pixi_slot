import {Container, Graphics, Sprite, Texture} from 'pixi.js';
import {Layer} from "./Layer";
import {ContainerNames, LayerNames} from "./ViewLayerNames";
import {TexturesNames} from "../model/AssestsConfig";

export class LayerGame extends Layer {
    public static draw(options?: {[key: string]: any}): Container {
        const container = super.draw();
        container.name = LayerNames.LAYER_GAME;
        const reel = new Container();
        reel.name = ContainerNames.REEL_CONTAINER;
        container.addChild(reel);

        const slotTextures = [
            Texture.from(TexturesNames.EGG_HEAD),
            Texture.from(TexturesNames.FLOWER_TOP),
            Texture.from(TexturesNames.HELMLOK),
            Texture.from(TexturesNames.SKULLY),
        ];

        for (let i = 0; i <= options.numberOfRows; i++) {
            const symbol = new Sprite(slotTextures[i]);
            symbol.height = options.symbolSize;
            symbol.width = options.symbolSize;
            symbol.y = i * options.symbolSize;
            symbol.x = (options.symbolSize * 1.1 - options.symbolSize) / 2;
            reel.addChild(symbol);
        }

        const mask = new Graphics();
        mask.beginFill(0x000000);
        mask.drawRect(0, 0, options.symbolSize * 1.1, options.symbolSize * options.numberOfRows);
        mask.endFill();
        mask.lineStyle(0);
        container.addChild(mask);
        reel.mask= mask;

        return container;
    }
}
