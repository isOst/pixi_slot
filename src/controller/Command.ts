import { ICommand } from './ICommand';

export class Command implements ICommand {
    /**
     * Context data, required for launching receiver's method
     */
    protected view: any;
    protected model: any;

    constructor(view: any, model: any) {
        this.view = view;
        this.model = model;
    }

    public execute(): void {}
}