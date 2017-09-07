
import * as amqp from 'amqplib';
import {AmqpOrder} from "./entity/Order";
import * as stream from "stream";
import { getRandomLocation } from './geo';

import * as flow from "./flow";


(async () => {

	const connection = await amqp.connect('amqp://localhost');
	const channel = await connection.createChannel();

	channel.assertQueue('orders', {
		durable: true
	});
	channel.prefetch(10);

	channel.consume('orders', async (msg) => {

		try {
			const payload: AmqpOrder = JSON.parse(msg.content);

			await process(payload);

			//orderPipe.push(payload);
			channel.ack(msg);
		} catch (err) {
			channel.nack(msg);
		}

	}, { noAck: false});


	let id = 0;
	setInterval(() => {

		const order: AmqpOrder = {
			id: ++id,
			location: getRandomLocation()
		};

	}, 1000)


})();


async function process(order: AmqpOrder): Promise<boolean> {

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




}