const isPortReachable = require("is-port-reachable"); // used in waitForHost 

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

module.exports = {
    sleep,
    waitForHost
};