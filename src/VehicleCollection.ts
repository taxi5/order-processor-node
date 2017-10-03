import { InterfaceVehicleLocation } from './entity/interfaces';
import { VehicleSync } from './service/taxi5';
import Timer = NodeJS.Timer;

export class VehicleCollection {
    private state: InterfaceVehicleLocation[] = [];
    private interval: Timer;
    private sync: VehicleSync;

    constructor(sync: VehicleSync) {
        this.sync = sync;
    }

    public async load() {
        this.state = this.sync.getVehicleIds()
        /* Find controllerId by vehicleId */
            .map((id) => this.sync.findByVehicleId(id))
            /* Filter out test vehicles */
            .filter((id) => id !== '0' && id !== 'test' && id !== 'a')
            /* Get vehicle coordinates */
            .map(((id) => {
                const location = {
                    latitude: Math.random() * (53.972167 - 53.828164) + 53.828164,
                    longitude: Math.random() * (27.719198 - 27.400352) + 27.400352,
                };
                return ({id, location});
            }));
    }

    public watch(interval) {
        this.interval = setInterval(async () => this.load(), interval * 1000);
    }

    public async getState(): Promise<InterfaceVehicleLocation[]> {
        return this.state;
    }
}
