(async () => {
    const { config } = require("./config");
    const { waitForHost } = require("./utils");

    const pino = require("pino");

    const mongoose = require("mongoose");

    const express = require("express");
    const expressPino = require("express-pino-logger");

    const logger = pino({ level: config.server.logLevel });

    try {

        // --- Database
        logger.info(`Connecting to database: ${config.mongodb.url}`);
        await waitForHost(config.mongodb.hostname, config.mongodb.port, 10);
        await mongoose.connect(config.mongodb.url, config.mongodb.connectionOptions);

        // --- REST API
        const expressLogger = expressPino({ logger });
        const app = express();
        app.use(expressLogger);

        // --- Routes
        const { router: projectRoutes } = require("./routes/project");
        app.use("/projects", projectRoutes);

        const { router: allocationRoutes } = require("./routes/allocation");
        app.use("/allocations", allocationRoutes);

        const { router: userRoutes } = require("./routes/user");
        app.use("/users", userRoutes);

        // --- Start server
        app.listen(config.server.port , () => {
            logger.info(`Server listening on port ${config.server.port}`);
        });
    } catch (err) {
        logger.fatal(err);
        process.exit(1);
    }
})();

