import {Command} from './Command';

export class StopWinningAnimationCommand extends Command {
    public execute(): void {
        super.execute();
        this.view.particlesEmitter.cleanup();
        this.view.particlesEmitter.emit = false;
        this.model.isWinning = false;
    }
}
