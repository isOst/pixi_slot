import {Command} from './Command';

export class StartWinningAnimationCommand extends Command {
    public execute(): void {
        super.execute();
        this.model.addParticleEmitterTicker(this.view.particlesEmitter);
        this.view.particlesEmitter.emit = true;
        this.model.isWinning = true;

    }
}