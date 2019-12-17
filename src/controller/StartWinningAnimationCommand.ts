import {Command} from './Command';

export class StartWinningAnimationCommand extends Command {
    public execute(): void {
        super.execute();
        this.view.particlesEmitter.emit = true;
        this.model.getTicker().add(() => {
            this.view.particlesEmitter.update(this.model.getTicker().elapsedMS * 0.01);
        })
    }
}