import {Command} from './Command';

export class LoadAssetsCommand extends Command {
    public execute(): void {
        super.execute();
        this.model.loadAssets()
    }
}