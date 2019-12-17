import {Command} from './Command';
import {COMMANDS_NAMES} from './CommandsNames';
import {LoadAssetsCommand} from './LoadAssetsCommand';
import {ModelEventNames} from '../model/ModelEventsNames';
import {DrawUICommand} from './DrawUIComand';
import {ViewEventsNames} from '../view/ViewEventsNames';
import {DrawFPSCommand} from './DrawFPSCommand';
import {StartUpdateFPSCommand} from './StartUpdateFPSCommand';
import {UpdateFPSCommand} from './UpdateFPSCommand';
import {DrawGameSceneCommand} from './DrawGameSceneCommand';
import {DrawWinningsCommand} from './DrawWinningsCommand';
import {StartWinningAnimationCommand} from './StartWinningAnimationCommand';

export class Controller {

    private view: any;
    private model: any;
    private commands: Map<string, Command> = new Map();

    constructor(view: any, model: any) {
        this.view = view;
        this.model = model;
        this.registerCommands();
        this.registerEventListeners();
    }

    private registerCommands(): void {
        this.commands.set(COMMANDS_NAMES.LOAD_ASSETS, new LoadAssetsCommand(this.view, this.model));
        this.commands.set(COMMANDS_NAMES.DRAW_UI, new DrawUICommand(this.view, this.model));
        this.commands.set(COMMANDS_NAMES.DRAW_GAME_SCENE, new DrawGameSceneCommand(this.view, this.model));
        this.commands.set(COMMANDS_NAMES.DRAW_WINNING, new DrawWinningsCommand(this.view, this.model));
        this.commands.set(COMMANDS_NAMES.DRAW_FPS, new DrawFPSCommand(this.view, this.model));
        this.commands.set(COMMANDS_NAMES.START_UPDATE_FPS, new StartUpdateFPSCommand(this.view, this.model));
        this.commands.set(COMMANDS_NAMES.UPDATE_FPS, new UpdateFPSCommand(this.view, this.model));
        this.commands.set(COMMANDS_NAMES.START_WINNING_ANIMATION,
            new StartWinningAnimationCommand(this.view, this.model)
        );
    }

    private execute(commandName: string): void {
        if (this.commands.get(commandName)) {
            this.commands.get(commandName).execute();
        }
    }

    private registerEventListeners(): void {
        this.model.emitter.on(ModelEventNames.ASSETS_LOADED, () => {
            this.execute(COMMANDS_NAMES.DRAW_UI);
            this.execute(COMMANDS_NAMES.DRAW_GAME_SCENE);
            this.execute(COMMANDS_NAMES.DRAW_WINNING);
            this.execute(COMMANDS_NAMES.DRAW_FPS);
            this.execute(COMMANDS_NAMES.START_WINNING_ANIMATION);
        });
        this.model.emitter.on(ModelEventNames.ON_UPDATE_FPS, () => {
           this.execute(COMMANDS_NAMES.UPDATE_FPS)
        });
        this.view.emitter.on(ViewEventsNames.ON_DRAW_FPS_LAYER, () => {
            this.execute(COMMANDS_NAMES.START_UPDATE_FPS)
        })
    }
}