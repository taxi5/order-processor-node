export default abstract class Connector {
    handler:(message) => void;

    constructor(handler:(message) => void) {
        this.handler = handler;
    }

    abstract connect(): void;
}