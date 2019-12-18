import { ICommand } from './ICommand';

export class Command implements ICommand {
    /**
     * Context data, required for launching receiver's method
     */
    protected view: any;
    protected model: any;
    /**
     * Inject contexts of receivers
     * @param view
     * @param model
     */
    constructor(view: any, model: any) {
        this.view = view;
        this.model = model;
    }
    /**
     * Logic to execute
     */
    public execute(): void {}
}