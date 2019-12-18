import {Command} from './Command';

export class StopSpinCommand extends Command {
    public execute(): void {
        super.execute();
        this.view.stopReel(this.model.speed);
    }
}