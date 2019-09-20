
const MongoClient = require("mongodb").MongoClient;

const { waitForHost } = require("./utils");

const connect = async (config) => {
    await waitForHost(config.hostname, config.port, 10);

    const client = new MongoClient(config.url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    return client.db(config.dbName);
};

const close = async (db, logger) => {
    logger.info("Closing database connection...");
    db.close();
};

const find = async (db, collection, query) => {
    return db.collection(collection).find(query);
};

const findOne = async (db, collection, query) => {
    return db.collection(collection).findOne(query);
};

const insertOne = async (db, collection, data) => {
    return db.collection(collection).insertOne(data);
};

const deleteOne = async (db, collection, query) => {
    return db.collection(collection).deleteOne(query);
};

const updateOne = async (db, collection, query, data) => {
    return db.collection(collection).updateOne(query, { $set: data });
};

module.exports = {
    connect: connect,
    close: close,
    find: find,
    findOne: findOne,
    insertOne: insertOne,
    deleteOne: deleteOne,
    updateOne: updateOne,
};