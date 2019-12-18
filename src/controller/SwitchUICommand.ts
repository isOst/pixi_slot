import {Command} from './Command';

export class SwitchUICommand extends Command {
    public execute(): void {
        super.execute();
        this.view.switchUI();
    }
}
