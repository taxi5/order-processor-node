

import {LocationInterface} from "./geo";
import { OsrmClient } from "./service/osrm";
import sync from './vehicle';

(async () => {
	await sync.synchronize();
})();

const osrm = new OsrmClient("http://localhost:5000");


export function getVehicles(): any[] {
	const ids = sync.getVehicleIds();
	const vehicles = ids.map((id) => sync.findByVehicleId(id));
	return vehicles;
}




/*
export interface VehicleLocationInterface extends LocationInterface {
	controllerId: string
}

export async function getVehiclePositions(): Promise<VehicleLocationInterface[]> {

	let locations: VehicleLocationInterface[] = [];

	for (let i = 0; i < 10; i++) {
		const vehicleLocation: VehicleLocationInterface = {
			controllerId: "10",
			latitude: Math.random() * (53.972167 - 53.828164) + 53.828164,
			longitude: Math.random() * (27.719198 - 27.400352) + 27.400352
		};
		locations.push(vehicleLocation);
	}

	return locations;
}



export interface VehicleDistanceInterface extends VehicleLocationInterface {
	distance_km: number,
	eta_m: number
}

export async function getVehicleDistances(vehicles: VehicleLocationInterface[]): Promise<VehicleDistanceInterface[]> {
	return Promise.all(vehicles.map((item) => {


	}));
	return null;
}

*/