import {Command} from './Command';

export class DrawGameSceneCommand extends Command {
    public execute(): void {
        super.execute();
        this.view.drawGameScene();
    }
}