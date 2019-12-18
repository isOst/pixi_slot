import {Command} from './Command';

export class StartSpinCommand extends Command {
    public execute(): void {
        super.execute();
        this.model.isSpinning = true;
    }
}