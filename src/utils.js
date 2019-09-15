const isPortReachable = require("is-port-reachable"); // used in waitForHost
const pino = require("pino");
const { config } = require("./config.js");
const mongoObjectId = require("mongodb").ObjectID;


const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const waitForHost = async (host, port, retries=5, retryInterval=1000) => {
    let isReachable = false;
    do {
        isReachable = await isPortReachable(port, { host: host});
        retries--;

        if (!isReachable) {
            await sleep(retryInterval);
        }
    } while (retries > 0 && !isReachable);

    if (!isReachable) {
        throw new Error(`Not able to reach host: ${host}:${port}`);
    }
};

const logger = pino({ level: config.server.logLevel });

// --- DB utils
const mongoHexIdToObjectId = (hexId) => mongoObjectId.createFromHexString(hexId);

// --- Error classes
class DomainError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        // Clips the constructor invocation from the stack trace.
        Error.captureStackTrace(this, this.constructor);
    }
}

class ResourceNotFoundError extends DomainError {
    constructor(resource, type) {
        super(`${type} ${resource} was not found.`);
        this.data = { resource, type };
    }
}

class InternalError extends DomainError {
    constructor(error) {
        super(error.message);
        this.data = { error };
    }
}

module.exports = {
    sleep,
    waitForHost,
    logger,
    mongoHexIdToObjectId,
    DomainError,
    ResourceNotFoundError,
    InternalError,
};