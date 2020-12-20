const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/", function (req, res) {
  let validExtensions = [".jpg", ".JPG", ".png", ".PNG", ".jpeg", ".JPEG"];
  let ext;
  let filePath = "./server/result/" + req.query.hash;
  let fileExists = validExtensions.some((x) => {
    if (fs.existsSync(filePath + x)) {
      ext = x;
      return true;
    } else {
      return false;
    }
  });
  if (req.query.hash && fileExists) {
    res.sendFile(
      path.resolve(__dirname + "/../result/" + req.query.hash + ext)
    );
  } else {
    res.status(401).send("invalid hash or hash not given");
  }
});
module.exports = router;
