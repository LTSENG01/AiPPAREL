const express = require("express");
const { spawn } = require("child_process");
const fs = require("fs");
const _ = require("lodash");
const { nanoid } = require("nanoid");
const router = express.Router();
const { IN_PROGRESS, ERROR, SUCCESS } = require("../../enums/status.js");
const path = require("path");

function writeProgress(progress) {
  if (!fs.existsSync("./server/status")) {
    fs.mkdirSync("./server/status");
  }
  fs.writeFileSync(
    `./server/status/${progress.id}.json`,
    JSON.stringify(progress)
  );
}

/* POST stylize listing. */
router.post("/", function (req, res, next) {
  let id = nanoid();
  // id: String, contentImage: String, styleImages: String[]
  let imageData = { id: id, contentImage: "", styleImages: [] };
  let progress = { status: IN_PROGRESS, id: id };
  try {
    // if no files attached, return error/failed
    if (!req.files) {
      res.send({
        status: false,
        message: "no images included",
      });
    } else {
      let data = [];
      req.files.images.forEach((photo) => {
        let imgFilename = nanoid() + path.extname(photo.name);
        photo.mv("./server/uploads/" + imgFilename);
        data.push({
          name: imgFilename,
          mimetype: photo.mimetype,
          size: photo.size,
          path: "./server/uploads/" + imgFilename,
        });
      });

      writeProgress(progress);
      console.log(1);
      // runScript(data[0].path, data[1].path);
      res.send({
        status: true,
        message: "successful upload",
        id: id,
        data: data,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
  function runScript(content, styles) {
    // create array
    let images = [content, styles[0]];
    // style.forEach(images.push);
    spawn("python", [
      "../python/stylize.py",
      "--id",
      `${id}`,
      `${images[0]}`,
      `${images[1]}`,
    ]);

    stylePyScript.stderr.on("data", (err) => {
      progress.status = ERROR;
      progress["message"] = "Failed to load image";
      console.log(err);
    });

    stylePyScript.on("close", (code) => {
      if (fs.existsSync("./server/result/" + progress.id + ".png")) {
        progress.status = SUCCESS;
      } else {
        progress.status = ERROR;
        progress["message"] = "Failed to load image";
      }
      writeProgress(progress);
    });
  }
});

module.exports = router;
