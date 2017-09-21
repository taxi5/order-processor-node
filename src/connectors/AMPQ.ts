import * as amqp from 'amqplib';
import config from '../config/config';
import Connector from '../entity/connector';
import { InterfaceOrder } from '../entity/interfaces';

export default class AMPQ extends Connector {

    public async connect() {
        const connection = await amqp.connect(config.rabbitmq.url);
        const channel = await connection.createChannel();

        channel.assertQueue(config.rabbitmq.queue, {
            durable: true,
        });
        channel.prefetch(config.rabbitmq.prefetch);

        channel.consume(config.rabbitmq.queue, async (msg) => {
            try {

                const order: InterfaceOrder = JSON.parse(msg.content);
                this.handler(order);
                channel.ack(msg);
            } catch (err) {
                // tslint:disable-next-line no-console
                console.log(err);
                /* TODO Handle invalid json */
                /*channel.nack(msg);*/
                channel.ack(msg);
            }

        }, {noAck: false});
    }

}
