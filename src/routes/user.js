const { addAsync } = require("@awaitjs/express");
const express = require("express");
const router = addAsync(express.Router());

const { user } = require("../validation/user");
const { getUsers,
        getUser,
        createUser,
        updateUser,
        deleteUser,
        getUserAllocations } = require("../services/user");

/*
 * Sample response:
 *
 *  [
 *    {
 *      "id": "string",
 *      "name": "string",
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
    return res.json(await getUsers(req.varjoResources.db));
});

/*
 * Sample request:
 *
 * {
 *   "name": "string",
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
    const { error } = await user.validate(req.body);

    if (error) {
        throw error;
    }

    return res.json(await createUser(req.body, req.varjoResources.db));
});

/*
 *  Sample response:
 * 
 * {
 *   "id": "string",
 *   "name": "string",
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
    return res.json(await getUser(req.params.id, req.varjoResources.db));
});

/*
 * Sample request:
 *
 * {
 *   "id": "string",
 *   "name": "string",
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
    const { error } = await user.validate(req.body);

    if ( error ) {
        throw error;
    }

    return res.status(204).json(await updateUser(req.params.id, req.body, req.varjoResources.db));
});

/*
 * Returns 204, no content.
 */
router.deleteAsync("/:id", async (req, res) => {
    await deleteUser(req.params.id, req.varjoResources.db);
    res.status(204).send();
});

// TODO description
router.getAsync("/:id/allocations", async (req, res) => {
    return res.json(await getUserAllocations(req.params.id, req.varjoResources.db));
});

module.exports = { router };