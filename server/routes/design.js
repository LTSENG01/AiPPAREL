const express = require("express");
const fs = require("fs");
const router = express.Router({ mergeParams: true });
const { IN_PROGRESS, ERROR, SUCCESS } = require("../../enums/status.js");

/**
 * This route returns the status of the process (JSON file with hash)
 */
router.get("/", function (req, res, next) {
  // get the hash from the URL
  let hash;
  if (typeof req.params === "object" && "hash" in req.params) {
    hash = req.params["hash"];

    // regex the hash, toss if fails!
    const regex = /^[A-Za-z0-9_-]{21}$/;
    if (!regex.test(hash)) {
      return res.status(400).send("Invalid hash.");
    }
  } else {
    return res.status(400).send("Error. Bad Hash!");
  }

  // read the JSON file synchronously from filesystem (migrate to DB later)
  const path = `./status/${hash}.json`;
  console.log(path + " " + fs.existsSync(path));
  if (fs.existsSync(path)) {
    let jsonContents = fs.readFileSync(path);
    let designStatus = JSON.parse(jsonContents.toString());

    // parse the JSON file
    if ("status" in designStatus) {
      switch (parseInt(designStatus["status"])) {
        case IN_PROGRESS:
          return res.status(202).send("Processing...");
        case SUCCESS:
          return res.status(200).send("Success!");
        case ERROR:
        default:
          return res
            .status(500)
            .send("Internal Server Error. Unable to Process Your Design.");
      }
    } else {
      return res
        .status(500)
        .send("Internal Server Error. Design Status Unavailable.");
    }
  } else {
    // json file does NOT exist
    return res.status(404).send("Error. Design Status is Missing!");
  }
});

module.exports = router;
