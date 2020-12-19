const express = require("express");
const fs = require("fs");
const router = express.Router({ mergeParams: true });

/**
 * This route returns the status of the process (JSON file with hash)
 */
router.get("/", function (req, res, next) {
  // get the hash from the URL
  if (req.params && "hash" in req.params) {
    const hash = req.params["hash"];
    console.log(hash);
  } else {
    res.status(404).send("Error. Design not found!");
  }

  // read the JSON file synchronously from filesystem

  // parse the JSON file

  // send back a response

  res.send(req.params);
});

// todo CAN YOU HAVE A GET AND POST?
router.post("/", function (req, res, next) {});

module.exports = router;
