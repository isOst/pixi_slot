import {Command} from './Command';

export class DrawFPSComand extends Command {
    public execute(): void {
        super.execute();
        this.view.drawFPSLayer();
    }
}