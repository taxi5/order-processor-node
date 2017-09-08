/*
* TODO separate dev and prod config
* */
export default {
    rabbitmq: {
        url: 'amqp://localhost',
        queue: 'orders',
        prefetch: 10,
    },
    api: {
        token: ''
    }
};