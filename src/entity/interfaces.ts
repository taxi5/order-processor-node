export interface InterfaceLocation {
    longitude: number;
    latitude: number;
    accuracy?: number;
}

export interface InterfaceOrder {
    id: number;
    location: InterfaceLocation;
    features?: {};
}

export interface InterfaceVehicleLocation {
    id: string;
    location: InterfaceLocation;
}

export interface InterfaceVehicleDistance extends InterfaceVehicleLocation {
    distance_km: number;
    eta_m: number;
}
