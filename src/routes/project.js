const { addAsync } = require("@awaitjs/express");
const express = require("express");
const router = addAsync(express.Router());

const { project } = require("../validation/project");
const { getProjects,
        getProject,
        createProject,
        updateProject,
        deleteProject,
        getProjectAllocations } = require("../services/project");

/*
 * Sample response:
 *
 *  [
 *    {
 *      "id": "string",
 *      "name": "string",
 *      "description": "string",
 *      "start": "date",
 *      "end": "date",
 *      "tags": [
 *        {
 *          "key": "string",
 *          "value": "string"
 *        }
 *      ]
 *    },
 *    ...
 *  ]
 * 
 * Returns 200, with content.
 */
router.getAsync("/", async (req, res) => {
    return res.json(await getProjects(req.varjoResources.db));
});

/*
 * Sample request:
 *
 * {
 *   "name": "string",
 *   "description": "string",
 *   "start": "date",
 *   "end": "date",
 *   "tags": [
 *     {
 *       "key": "string",
 *       "value": "string"
 *     }
 *   ]
 * }
 * 
 *  Sample response:
 * 
 * {
 *   "id": "string"
 * }
 * 
 * Returns 200, with content.
 */
router.postAsync("/", async (req, res) => {
    const { error } = await project.validate(req.body);

    if ( error ) {
        throw error;
    }

    return res.json(await createProject(req.body, req.varjoResources.db));
});

/*
 *  Sample response:
 * 
 * {
 *   "id": "string",
 *   "name": "string",
 *   "description": "string",
 *   "start": "date",
 *   "end": "date"
 *   "tags": [
 *     {
 *       "key": "string",
 *       "value": "string"
 *     }
 *   ]
 * }
 * 
 * Returns 200, with content
 */
router.getAsync("/:id", async (req, res) => {
    return res.json(await getProject(req.params.id, req.varjoResources.db));
});

/*
 * Sample request:
 *
 * {
 *   "name": "string",
 *   "description": "string",
 *   "start": "date",
 *   "end": "date",
 *   "tags": [
 *     {
 *       "key": "string",
 *       "value": "string"
 *     }
 *   ]
 * }
 * 
 * Returns 204, no content.
 */
// TODO
router.putAsync("/:id", async (req, res) => {
    const { error } = await project.validate(req.body);

    if ( error ) {
        throw error;
    }

    return res.status(204).json(await updateProject(req.params.id, req.body, req.varjoResources.db));
});

/*
 * Returns 204, no content.
 */
router.deleteAsync("/:id", async (req, res) => {
    await deleteProject(req.params.id, req.varjoResources.db);
    res.status(204).send();
});

/*
 *  Sample response:
 * 
 * [{
 *   "id": "string",
 *   "allocation": number,
 *   "description": "string",
 *   "start": "YYYY-MM-DD",
 *   "end": "YYYY-MM-DD",
 *   "tags": [
 *     {
 *       "key": "string",
 *       "value": "string"
 *     }
 *   ],
 *   "user": {
 *     "id": "string",
 *     "name": "string"
 *   }
 * }]
 * 
 * Returns 200, with content.
 */
router.getAsync("/:id/allocations", async (req, res) => {
    return res.json(await getProjectAllocations(req.params.id, req.varjoResources.db));
});

module.exports = { router };