export default abstract class Connector {
    protected readonly handler:(message) => void;

    constructor(handler: (message) => void) {
        this.handler = handler;
    }

    public abstract connect(): void;
}