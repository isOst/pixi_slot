import {Command} from './Command';

export class UpdateFPSCommand extends Command {
    public execute(): void {
        super.execute();
        this.view.updateFPS(this.model.getTicker().FPS);
    }
}