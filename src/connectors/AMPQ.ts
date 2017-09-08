import * as amqp from 'amqplib';
import Connector from './connector'
import { Order } from "../entity/Order";

export default class AMPQ extends Connector {

    async connect() {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        channel.assertQueue('orders', {
            durable: true
        });
        channel.prefetch(10);

        channel.consume('orders', async (msg) => {
            try {

                const order: Order = JSON.parse(msg.content);
                this.handler(order);
                channel.ack(msg);
            } catch (err) {
                console.log(err);
                /* TODO Handle invalid json */
                /*channel.nack(msg);*/
                channel.ack(msg);
            }

        }, { noAck: false});
    }

}