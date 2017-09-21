/*
* TODO separate dev and prod config
* */
export default {
    api: {
        token: '',
    },
    osrm: {
        url: 'http://localhost:5000',
    },
    rabbitmq: {
        prefetch: 10,
        queue: 'orders',
        url: 'amqp://localhost',
    },
};
