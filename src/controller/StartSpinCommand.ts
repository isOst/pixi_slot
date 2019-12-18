import {Command} from './Command';

export class StartUpdateFPSCommand extends Command {
    public execute(): void {
        super.execute();
        this.model.startUpdateFPS();
    }
}