/**
 * Taxi5 external vehicle sync services
 *
 * Created by omez on 31.07.17.
 */

import * as debug from 'debug';
import * as request from 'request-promise-native';

namespace Api {

	export interface VehicleInterface {
		id: number,
		controller_id: string,
		license_tax: string,
		phone_number: string
	}

	export type VehicleCollectionInterface = VehicleInterface[];

}


export class VehicleSync {

	private readonly endpoint = 'http://api.taxi5.by/v3/vehicle/list';
	private readonly logger;
	private readonly request;

	private intervalHandler = null;
	private indexById: { [ key: number ]: string } = {};
	private indexByLicense: { [ key: string ]: string } = {};

	constructor(token: string) {
		this.logger = debug('taxi5:vehicle_sync');
		this.request = request.defaults({
			headers: {
				'x-authorization': token
			},
			json: true
		});

		this.logger('Initialized');
	}

	public synchronize(): Promise<any> {
		return this.request.get(this.endpoint)
			.then((result) => {
				// TODO validate correct data type, now parsed as JSON by json:true flag in request
				const vehicles = result;
				if (vehicles && vehicles.length) this.rebuildIndices(vehicles);
			}).catch((err) => {
				console.log(err);
				throw err;
			});
	}

	public watch(period: number): void {
		this.unwatch();
		this.intervalHandler = setInterval(() => {
			this.logger('Synchronization interval trigger');
			this.synchronize();
		}, period * 1000);
	}

	public unwatch(): void {
		if (this.intervalHandler !== null) {
			clearInterval(this.intervalHandler);
			this.intervalHandler = null;
		}
	}

	public getVehicleIds(): number[] {
		return Object.keys(this.indexById).map((i) => parseInt(i));
	}

	public findByVehicleId(id: number): string | null {
		return this.indexById[id] !== undefined ? this.indexById[id] : null;
	}

	public findByLicensePlate(plate: string): string | null {
		return this.indexByLicense[plate] !== undefined ? this.indexByLicense[plate] : null;
	}

	private rebuildIndices(vehicles: Api.VehicleInterface[]): void {

		this.logger('Rebuilding index for %d vehicles', vehicles.length);
		const activeVehicles = vehicles.filter((vehicle) => vehicle.controller_id);
		this.logger('Active vehicles: %s', activeVehicles.length);

		// index for ID => controller_id
		this.indexById = activeVehicles.reduce((index, info) => {
			if (info.id) {
				index[info.id] = info.controller_id;
			}
			return index;
		}, {});

		// index for licencePlate => controllerId
		this.indexByLicense = activeVehicles.reduce((index, info) => {
			if (info.license_tax) {
				index[info.license_tax] = info.controller_id;
			}
			return index;
		}, {});

		this.logger('Complete with [ID=>controllerID]=%d, [licence=>controllerID]=%d', Object.keys(this.indexById).length, Object.keys(this.indexByLicense).length);
	}

}