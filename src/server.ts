/*/!*
* sample json
* {"id": 12, "location":{"latitude": 53.926624, "longitude": 27.590812}}
* *!/
/!* TODO Separate system initalization from business logic, implement ConfigurationManager*!/*/

import config from './config/config';
import Connect from './connect';
import { InterfaceOrder, InterfaceVehicleDistance, InterfaceVehicleLocation } from './entity/interfaces';
import { OsrmClient } from './service/osrm';
import { VehicleSync } from './service/taxi5';
import { VehicleCollection } from './VehicleCollection';

class App {

    private sync: VehicleSync;
    private osrm: OsrmClient;
    private connection: Connect;
    private vehicleCollection: VehicleCollection;

    public constructor() {
        this.sync = new VehicleSync(config.api.token);
        this.osrm = new OsrmClient(config.osrm.url);
        this.vehicleCollection = new VehicleCollection(this.sync);
    }

    public async init() {
        await this.sync.synchronize();
        this.sync.watch(10);
        await this.vehicleCollection.load();
        this.vehicleCollection.watch(3);
        this.connection = new Connect((order: InterfaceOrder) => this.process(order)).init();
    }

    public async process(order: InterfaceOrder): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const rejectTimeout = setTimeout(() => {
                reject(new Error(`Order ${order.id} processing took to long`));
            }, 1000);

            (async () => {
                const vehicles = await this.vehicleCollection.getState();
                const distances = await this.getVehicleDistancesTo(order, vehicles);
                const mycar = await new Promise<number>((res) => {

                });
                clearTimeout(rejectTimeout);
            })();
        }).catch(() => {
            return false;
        });
    }

    private async getVehicleDistancesTo(order: InterfaceOrder,
                                        coordinates: InterfaceVehicleLocation[]): Promise<InterfaceVehicleDistance[]> {
        return Promise.all(coordinates.map(async (vehicle) => {
            const from = {
                lat: vehicle.location.latitude,
                long: vehicle.location.longitude,
            };
            const to = {
                lat: order.location.latitude,
                long: order.location.longitude,
            };

            const { routes } = await this.osrm.route([from, to]);
            const { distance, duration } = routes[0];
            /* Consider rounding */
            /* TODO Always one route in response?*/
            return { ...vehicle, distance_km: distance / 1000, eta_m: duration / 60 };
        }));
    }
}

const app = new App();
app.init();

/*
async function process(order: InterfaceOrder): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {

        setTimeout(() => {
            reject(new Error(`Order ${order.id} processing took to long`));
        }, 1000);

        const sync = new VehicleSync(config.api.token);
        (async () => {
            setTimeout(() => {
                reject(new Error('asdasdasdas'));
            }, 1000);

            await sync.synchronize();
            sync.watch(10);

            const ids = sync.getVehicleIds();
            const vehicles = ids.map((id) => sync.findByVehicleId(id))
                .filter((id) => id !== '0' && id !== 'test' && id !== 'a');
            const vehicleCoordinates = vehicles.map(getVehicleCoordinatesBy);
            const vehicleDistances = vehicleCoordinates.map();
            console.log(vehicleCoordinates);
        })();
    }).catch(() => {
        return false;
    });
}

const getVehicleCoordinatesBy = (id: string): Promise<InterfaceVehicleLocation> => {
    return new Promise((resolve, reject) => {
        /!* TODO get vehicle location by id*!/
        const location = {
            latitude: Math.random() * (53.972167 - 53.828164) + 53.828164,
            longitude: Math.random() * (27.719198 - 27.400352) + 27.400352,
        };
        return resolve({id, ...location});
    });
};


*/


/*
import { OsrmClient } from './service/osrm';
import {InterfaceVehicleLocation} from './entity/vehicle-location-interface';

const coordinates = [
    {
        lat: 53.929287,
        long: 27.582678
    },
    {
        lat: 53.908756,
        long: 27.576026,
    },
    {
        lat: 53.919696,
        long: 27.586772,
    }
];
const orsmClient = new OsrmClient('http://localhost:5000');
orsmClient.route(coordinates).then((a) => console.log(a));*/

/*

async function process(order: InterfaceOrder): Promise<boolean> {

	return new Promise<boolean>((res, rej) => {

		setTimeout(()=> {
			rej(new Error('asdasdasdas'));
		}, 1000);


		const vehicles = flow.getVehicles();
		console.log(vehicles);

		const vehiclePositions = await flow.getVehicleLocations();

		const vehicleDistances = await flow.getVehicleDistances();

		// TODO ****** make decision what is my car

		const mycar = await new Promise<number>((res) => {
			decisionQueue.push({}, res);
		});


		const confirmed = await someservice.confirm(vehicle.id);
		continue;
		// TODO other binding stuff



	}).catch(() =>{
		return false;
	});








	while(true) {

		try {

			// get all vehicles




			break;
		} catch (err) {
			continue;
		}


	}




}*/

/*const vehiclePositions = flow.getVehicleLocations();*/

//const vehicles = ids.map((id) => sync.findByVehicleId(id));

/*return vehicles;*/

/*
import * as amqp from 'amqplib';
import {order} from './entity/order';
//import * as stream from 'stream';
import { getrandomlocation } from './geo';

//import * as flow from './flow';


(async () => {

	const connection = await amqp.connect('amqp://localhost');
	const channel = await connection.createchannel();

	channel.assertqueue('orders', {
		durable: true
	});
	channel.prefetch(10);

	channel.consume('orders', async (msg) => {
		try {
			const payload: order = json.parse(msg.content);
            console.log(payload);
            /!*await process(payload);*!/

			//orderpipe.push(payload);
			channel.ack(msg);
		} catch (err) {
			channel.nack(msg);
		}

	}, { noack: false});


	let id = 0;
	setinterval(() => {

		const order: order = {
			id: ++id,
			location: getrandomlocation()
		};

	}, 1000)


})();*/


