import {Command} from './Command';

export class ResizeCommand extends Command {
    public execute(): void {
        super.execute();
        this.view.onResize(this.model.speed);
    }
}