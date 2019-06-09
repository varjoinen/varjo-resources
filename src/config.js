const config = {};

config.mongodb = {
    connectionOptions: {
        useNewUrlParser: true,
        auth: {
            authdb: "admin"
        },
        reconnectTries: 5,
        reconnectInterval: 10000, // 10s
        user: process.env.MONGODB_USERNAME || "varjo",
        pass: process.env.MONGODB_PASSWORD || "resources",
        dbName: process.env.MONGODB_COLLECTION || "varjo-resources",
    },
    hostname: process.env.MONGODB_HOSTNAME || "mongodb",
    port: process.env.MONGODB_PORT || 27017,
};

config.mongodb.url = `mongodb://${config.mongodb.hostname}:${config.mongodb.port}`;

config.server = {
    port: process.env.SERVER_PORT || 3000,
    logLevel: process.env.SERVER_LOG_LEVEL || "info",
};

exports.config = config;