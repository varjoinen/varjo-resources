const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    return res.json({"message": "hello"});
});

exports.router = router;