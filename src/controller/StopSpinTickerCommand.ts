import {Command} from './Command';

export class StopSpinTickerCommand extends Command {
    public execute(): void {
        super.execute();
        this.model.isSpinning = false;
        this.model.resetTimers();
    }
}