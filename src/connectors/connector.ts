export default abstract class Connector {
    private readonly handler:(message) => void;

    constructor(handler:(message) => void) {
        this.handler = handler;
    }

    abstract connect(): void;
}