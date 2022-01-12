const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const socket = require('./socket');
const Grid = require('gridfs-stream')

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then((db) => {
    logger.info('Connected to MongoDB');
    server = app.listen(config.port, () => {
        logger.info(`Listening to port ${config.port} and running on ${config.env}`);
    });
    socket(server)

});
mongoose.set('useFindAndModify', false);
mongoose.set('toJSON', {
    virtuals: true
});

// const exitHandler = () => {
//     if (server) {
//         server.close(() => {
//             logger.info('Server closed');
//             process.exit(1);
//         });
//     } else {
//         process.exit(1);
//     }
// };

// const unexpectedErrorHandler = (error) => {
//     logger.error(error);
//     exitHandler();
// };

// process.on('uncaughtException', unexpectedErrorHandler);
// process.on('unhandledRejection', unexpectedErrorHandler);

// process.on('SIGTERM', () => {
//     logger.info('SIGTERM received');
//     if (server) {
//         server.close();
//     }
// });