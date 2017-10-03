import Connectors from './connectors';
import Connector from './entity/connector';

export default class Connect {
    private readonly connectors: Connector[];
    private readonly callback: (message) => void;

    constructor(callback: (message) => void) {
        this.callback = callback;
        this.connectors = Connectors.map((connector) => new connector(this.callback));
    }

    public init() {
        this.connectors.forEach((connector) => {
            connector.connect();
        });

        return this;
    }
}
