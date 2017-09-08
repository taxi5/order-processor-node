import * as amqp from 'amqplib';
import Connector from './connector'
import { Order } from "../entity/Order";
import config from '../config/config';

export default class AMPQ extends Connector {

    async connect() {
        const connection = await amqp.connect(config.rabbitmq.url);
        const channel = await connection.createChannel();

        channel.assertQueue(config.rabbitmq.queue, {
            durable: true
        });
        channel.prefetch(10);

        channel.consume(config.rabbitmq.queue, async (msg) => {
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