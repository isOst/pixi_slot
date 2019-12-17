import {Command} from './Command';

export class DrawWinningsCommand extends Command {
    public execute(): void {
        super.execute();
        this.view.drawWinningLayer();
    }
}