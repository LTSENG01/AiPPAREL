const express = require('express');
const fs = require('fs');
const {IN_PROGRESS, ERROR, SUCCESS} = require('../../enums/status.js');

const router = express.Router({ mergeParams : true });

/**
 * This route returns the status of the process (JSON file with hash)
 */
router.get('/', function(req, res, next) {

    // get the hash from the URL
    let hash
    if (typeof req.params == "object" && "hash" in req.params) {
        hash = req.params["hash"]

        // regex the hash, toss if fails!
        console.log(hash)
    } else {
        return res.status(404).send("Error. Design not found!")
    }

    // read the JSON file synchronously from filesystem (migrate to DB later)
    const path = `../status/${hash}.json`
    if (fs.existsSync(path)) {
        let jsonContents = fs.readFileSync(path)
        let designStatus = JSON.parse(jsonContents.toString())

        // parse the JSON file
        if ("status" in designStatus) {
            switch (parseInt(designStatus["status"])) {
                case IN_PROGRESS:
                    return res.status(202).send("Processing...")
                case SUCCESS:
                    return res.status(200).send(designStatus["status"])
                case ERROR:
                    return res.status(500).send("Internal Server Error. Unable to Process Your Design.")
            }
        } else {
            return res.status(500).send("Internal Server Error. Design Status Unavailable.")
        }
    } else {
        // json file does NOT exist
        return res.status(404).send("Design Status Not Found.")
    }
});


module.exports = router;
