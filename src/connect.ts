import Connectors from './connectors';
import Connector from "./connectors/connector";

export default class Connect {
    connectors:Array<Connector>;
    callback:(message)=>void;

    constructor(callback:(message)=>void) {
        this.callback = callback;
        this.connectors = Connectors.map(connector => new connector(this.callback));
    }

    init() {
        this.connectors.forEach((connector) => {
            connector.connect();
        })
    }
}