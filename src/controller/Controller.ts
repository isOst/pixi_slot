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
import {StartSpinCommand} from "./StartSpinCommand";
import {SpinCommand} from "./SpinCommand";
import {StopSpinCommand} from "./StopSpinCommand";
import {StopSpinTickerCommand} from "./StopSpinTickerCommand";
import {StopWinningAnimationCommand} from "./StopWinningAnimationCommand";
import {ResizeCommand} from "./ResizeCommand";
import {SwitchUICommand} from "./SwitchUICommand";

export class Controller {

    readonly view: any;
    readonly model: any;
    private commands: Map<string, Command> = new Map();

    constructor(view: any, model: any) {
        this.view = view;
        this.model = model;
        this.registerCommands();
        this.registerEventListeners();
    }
    /**
     * Create map of commands
     */
    private registerCommands(): void {
        this.commands.set(COMMANDS_NAMES.LOAD_ASSETS, new LoadAssetsCommand(this.view, this.model));
        this.commands.set(COMMANDS_NAMES.DRAW_UI, new DrawUICommand(this.view, this.model));
        this.commands.set(COMMANDS_NAMES.DRAW_GAME_SCENE, new DrawGameSceneCommand(this.view, this.model));
        this.commands.set(COMMANDS_NAMES.DRAW_WINNING, new DrawWinningsCommand(this.view, this.model));
        this.commands.set(COMMANDS_NAMES.DRAW_FPS, new DrawFPSCommand(this.view, this.model));
        this.commands.set(COMMANDS_NAMES.START_UPDATE_FPS, new StartUpdateFPSCommand(this.view, this.model));
        this.commands.set(COMMANDS_NAMES.UPDATE_FPS, new UpdateFPSCommand(this.view, this.model));
        this.commands.set(COMMANDS_NAMES.START_SPIN, new StartSpinCommand(this.view, this.model));
        this.commands.set(COMMANDS_NAMES.SPIN, new SpinCommand(this.view, this.model));
        this.commands.set(COMMANDS_NAMES.SWITCH_UI, new SwitchUICommand(this.view, this.model));
        this.commands.set(COMMANDS_NAMES.STOP_SPIN, new StopSpinCommand(this.view, this.model));
        this.commands.set(COMMANDS_NAMES.STOP_SPIN_TICKER, new StopSpinTickerCommand(this.view, this.model));
        this.commands.set(COMMANDS_NAMES.START_WINNING_ANIMATION,
            new StartWinningAnimationCommand(this.view, this.model)
        );
        this.commands.set(COMMANDS_NAMES.STOP_WINNING_ANIMATION,
            new StopWinningAnimationCommand(this.view, this.model)
        );
        this.commands.set(COMMANDS_NAMES.RESIZE, new ResizeCommand(this.view, this.model));
    }
    /**
     * Method to execute particular command
     * @param commandName
     */
    private execute(commandName: string): void {
        if (this.commands.get(commandName)) {
            this.commands.get(commandName).execute();
        }
    }
    /**
     * Subscribe execution on events
     */
    private registerEventListeners(): void {
        this.model.emitter.on(ModelEventNames.ASSETS_LOADED, () => {
            this.execute(COMMANDS_NAMES.DRAW_UI);
            this.execute(COMMANDS_NAMES.DRAW_GAME_SCENE);
            this.execute(COMMANDS_NAMES.DRAW_WINNING);
            this.execute(COMMANDS_NAMES.DRAW_FPS);
            this.view.buttonSpin.on("pointertap", () => {
                this.execute(COMMANDS_NAMES.START_SPIN);
                this.execute(COMMANDS_NAMES.SWITCH_UI);
            })
        });
        this.model.emitter.on(ModelEventNames.ON_UPDATE_FPS, () => {
           this.execute(COMMANDS_NAMES.UPDATE_FPS)
        });
        this.model.emitter.on(ModelEventNames.SPIN_REEL, () => {
            this.execute(COMMANDS_NAMES.SPIN);
        });
        this.model.emitter.on(ModelEventNames.STOP_REEL, () => {
            this.execute(COMMANDS_NAMES.STOP_SPIN)
        });
        this.model.emitter.on(ModelEventNames.WINNING_ANIMATION_END, () => {
            this.execute(COMMANDS_NAMES.STOP_WINNING_ANIMATION);
            this.execute(COMMANDS_NAMES.SWITCH_UI);
        });
        this.view.emitter.on(ViewEventsNames.ON_REEL_STOP, () => {
           this.execute(COMMANDS_NAMES.STOP_SPIN_TICKER);
           this.execute(COMMANDS_NAMES.START_WINNING_ANIMATION);
        });
        this.view.emitter.on(ViewEventsNames.ON_DRAW_FPS_LAYER, () => {
            this.execute(COMMANDS_NAMES.START_UPDATE_FPS)
        });
        window.onresize = () => {
            this.execute(COMMANDS_NAMES.RESIZE)
        }
    }
}
