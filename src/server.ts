import Connect from './connect';
const handler = (message) => {
    console.log(message);
    /*await process(payload);

    orderpipe.push(payload);*/
};

new Connect(handler).init();



import AMPQ from "./connectors/AMPQ";

/*import AMPO from './connectors/AMPQ';

const handler = (message) => {
    console.log(message);
    /!*await process(payload);

    orderpipe.push(payload);*!/
}
const ampq = new AMPO(handler);
ampq.connect();*/

/*while(true) {
    console.log(pipe.read());
}*/
/*pipe.push('{"id": 12}');
pipe.push('{"id": 13}');
pipe.push('{"id": 14}');
pipe.push(null);
console.log(pipe.read());
console.log(pipe.read());
console.log(pipe.read());*/
/*
import * as amqp from 'amqplib';
import {order} from "./entity/order";
//import * as stream from "stream";
import { getrandomlocation } from './geo';

//import * as flow from "./flow";


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

/*

async function process(order: Order): Promise<boolean> {

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
