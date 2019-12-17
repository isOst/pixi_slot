import {Command} from './Command';

export class DrawUICommand extends Command {
    public execute(): void {
        super.execute();
        this.view.drawUILayer();
    }
}