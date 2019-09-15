(async () => {
    const { config } = require("./config");

    const { logger, ResourceNotFoundError } = require("./utils");

    const dbUtils = require("./db");

    const { addAsync } = require("@awaitjs/express");
    const express = require("express");
    const expressPino = require("express-pino-logger");
    const responseTime = require("response-time");

    try {    
        // --- REST API
        const expressLogger = expressPino({ logger });
        const app = addAsync(express());
        app.use(expressLogger);
        app.use(express.json());

        // --- Profiling
        app.use(responseTime());

        // --- Database
        const db = await dbUtils.connect(config.mongodb, logger);
        const dbMiddleware = function (req, _, next) {
            req.varjoResources = req.varjoResources || {};
            req.varjoResources.db = db;
            next();
        };
        app.use(dbMiddleware);

        // --- Routes
        const { router: projectRoutes } = require("./routes/project");
        app.use("/projects", projectRoutes);

        const { router: allocationRoutes } = require("./routes/allocation");
        app.use("/allocations", allocationRoutes);

        const { router: userRoutes } = require("./routes/user");
        app.use("/users", userRoutes);

        // --- Error handling
        app.useAsync(async (err, _, res, next) => {
            logger.fatal(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(404);
            }

            res.json({"error": err.message});
        });

        // --- Start server
        await app.listen(3000);
        logger.info(`Server listening on port ${config.server.port}`);
    } catch (err) {
        logger.fatal(err);
        process.exit(1);
    }
})();

