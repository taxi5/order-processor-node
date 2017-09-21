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

export interface InterfaceVehicleLocation extends InterfaceLocation {
    id: string;
}

export interface InterfaceVehicleDistance extends InterfaceVehicleLocation {
    distance_km: number;
    eta_m: number;
}