import {Command} from './Command';

export class SpinCommand extends Command {
    public execute(): void {
        super.execute();
        this.view.spinReel(this.model.speed);
    }
}