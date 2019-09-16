const { addAsync } = require("@awaitjs/express");
const express = require("express");
const router = addAsync(express.Router());

const { allocation } = require("../validation/allocation");
const { getAllocations, getAllocation, createAllocation, updateAllocation, deleteAllocation } = require("../services/allocation");

/*
 * Sample response:
 *
 *  [
 *    {
 *      "id": "string",
 *      "allocation": "number",
 *      "allocationId": "string",
 *      "userId": "string",
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
    return res.json(await getAllocations(req.varjoResources.db));
});

/*
 * Sample request:
 *
 * {
 *   "allocation": "number",
 *   "allocationId": "string",
 *   "userId": "string",
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
 * 
 * Returns 200, with content.
 */
router.postAsync("/", async (req, res) => {
    const { error } = await allocation.validate(req.body);

    if (error) {
        throw error;
    }

    return res.json(await createAllocation(req.body, req.varjoResources.db));
});

/*
 *  Sample response:
 * 
 * {
 *   "id": "string",
 *   "allocation": "number",
 *   "allocationId": "string",
 *   "userId": "string",
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
 * Returns 200, with content.
 */
router.getAsync("/:id", async (req, res) => {
    return res.json(await getAllocation(req.params.id, req.varjoResources.db));
});

/*
 * Sample request:
 *
 * {
 *   "allocation": "number",
 *   "allocationId": "string",
 *   "userId": "string",
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
router.putAsync("/:id", async (req, res) => {
    const { error } = await allocation.validate(req.body);

    if ( error ) {
        throw error;
    }

    return res.status(204).json(await updateAllocation(req.params.id, req.body, req.varjoResources.db));
});

/*
 * Returns 204, no content.
 */
router.deleteAsync("/:id", async (req, res) => {
    await deleteAllocation(req.params.id, req.varjoResources.db);
    res.status(204).send();
});

module.exports = { router };