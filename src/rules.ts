import { InterfaceVehicleDistance } from './entity/interfaces';

export const shortestArrivalTime = (vehicle: InterfaceVehicleDistance): number => {
    return 100 - vehicle.eta_m;
};

export const shortestDistance = (vehicle: InterfaceVehicleDistance): number => {
    return 100 - vehicle.distance_km;
};