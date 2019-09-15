
const MongoClient = require("mongodb").MongoClient;

const { waitForHost } = require("./utils");

const connect = async (config, logger) => {
    logger.info(`Connecting to database: ${config.hostanme}:${config.port}/${config.dbName}...`);
    await waitForHost(config.hostname, config.port, 10);

    const client = new MongoClient(config.url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    logger.info("Connected.");

    return client.db(config.dbName);
};

const close = async (db, logger) => {
    logger.info("Closing database connection...");
    db.close();
};

module.exports = {
    connect: connect,
    close: close,
};