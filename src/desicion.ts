import { InterfaceOrder, InterfaceVehicleDistance } from './entity/interfaces';
import * as Rules from './rules';

export default class Decision {
    private vehicles: InterfaceVehicleDistance[] = [];

    constructor(vehiles) {
        this.vehicles = vehiles;
    }

    public async make(order: InterfaceOrder): Promise<string> {
        /* TODO add features filtering*/
        const rules = Object.keys(Rules);
        const weights = this.vehicles.map((vehicle) => {
            const weight = rules.reduce((accumulator, currentValue) => accumulator + Rules[currentValue](vehicle), 0);

            return { id: vehicle.id, weight };
        });
        weights.sort(function (a, b) {
            return b.weight - a.weight;
        });

        return weights[0].id;
    }


}