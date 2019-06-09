const express = require("express");
const router = express.Router();

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
router.get("/", (req, res) => {
    return res.json({"message": "List projects"});
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
 *   "id": "string",
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
 * Returns 200, with content.
 */
router.post("/", (req, res) => {
    return res.json({"message": "Create project"});
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
router.get("/:id", (req, res) => {
    return res.json({"message": `Get project ${req.params.id}`});
});

/*
 * Sample request:
 *
 * {
 *   "id": "string",
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
 *   "id": "string",
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
 * Notes:
 * 
 * Id is a required field, other are optional.
 * 
 * Existing fields will be updated, new tags are appended to the list of
 * tags, tags cannot be removed.
 * 
 * Returns 204, no content.
 */
router.put("/:id", (req, res) => {
    return res.json({"message": `Update project ${req.params.id}`});
});

/*
 * Returns 204, no content.
 */
router.delete("/:id", (req, res) => {
    return res.json({"message": `Delete project ${req.params.id}`});
});

exports.router = router;