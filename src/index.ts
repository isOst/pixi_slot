interface IBasic {
    notify(): void;
}

class Basic implements IBasic {
    private message: string = "Hello world";

    constructor() {
        this.notify()
    }

    notify(): void {
        alert(this.message)
    }
}

const basic = new Basic();
basic.notify();