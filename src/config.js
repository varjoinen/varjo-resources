const config = {};

config.mongodb = {
    hostname: process.env.MONGODB_HOSTNAME || "mongodb",
    port: process.env.MONGODB_PORT || 27017,
    user: process.env.MONGODB_USERNAME || "varjo",
    pass: process.env.MONGODB_PASSWORD || "resources",
    dbName: process.env.MONGODB_COLLECTION || "varjo-resources",
    connectionOptions: [
        { name: "authSource", value: "admin" },
    ],
};

const mongoUrlParams = config.mongodb.connectionOptions.reduce((array, option) => {
    array.push(`${option.name}=${option.value}`);
    return array;
},[]).join("&");

config.mongodb.url = `mongodb://${config.mongodb.user}:${config.mongodb.pass}@${config.mongodb.hostname}:${config.mongodb.port}?${mongoUrlParams}`;

config.server = {
    port: process.env.SERVER_PORT || 3000,
    logLevel: process.env.SERVER_LOG_LEVEL || "info",
};

exports.config = config;
