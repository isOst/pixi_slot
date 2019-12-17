import {Command} from './Command';

export class DrawFPSCommand extends Command {
    public execute(): void {
        super.execute();
        this.view.drawFPSLayer();
    }
}