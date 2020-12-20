const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/", function (req, res) {
  let validExtensions = [".jpg", ".JPG", ".png", ".PNG", ".jpeg", ".JPEG"];
  let ext;
  let filePath = "./server/images/" + req.query.hash;
  let imgFiles = [];
  let num = req.query.num;
  imgFiles = fs.readdirSync(filePath);
  console.log(req.query.hash);
  console.log(imgFiles);
  let file;
  let reg = new RegExp(
    "^[A-Za-z0-9_-]{21}_stylized_[A-Za-z0-9_-]{21}_" + num + "{1}"
  );
  imgFiles.forEach((x) => {
    console.log(x);
    if (x.match(reg)) {
      file = x;
    }
  });

  if (file) {
    res.sendFile(
      path.resolve(__dirname + "/../images/" + req.query.hash + "/" + file)
    );
  } else {
    res.status(401).send("invalid hash or hash not given");
  }
});
module.exports = router;
