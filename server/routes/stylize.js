const express = require("express");
const { spawn } = require("child_process");
const fs = require("fs");
const _ = require("lodash");
const { nanoid } = require("nanoid");
const router = express.Router();
const { IN_PROGRESS, ERROR, SUCCESS } = require("../../enums/status.js");
const path = require("path");
const validExtensions = [".jpg", ".JPG", ".png", ".PNG", ".jpeg", ".JPEG"];
const imgsPath = "./server/images/";

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
  let progress = { status: IN_PROGRESS, id: id };
  try {
    // if no files attached, return error/failed
    if (!req.files) {
      console.log(files);
      res.send({
        status: false,
        message: "no images included",
      });
    } else {
      let data = [];

      if (!fs.existsSync(imgsPath)) {
        fs.mkdirSync(imgsPath);
      }

      if (!fs.existsSync(imgsPath + id)) {
        fs.mkdirSync(imgsPath + id);
      }

      req.files.images.forEach((photo) => {
        let imgFilename = nanoid() + path.extname(photo.name);
        photo.mv(imgsPath + id + "/" + imgFilename);
        data.push({
          name: imgFilename,
          mimetype: photo.mimetype,
          size: photo.size,
          path: imgsPath + id + "/" + imgFilename,
        });
      });

      writeProgress(progress);
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
    let images = [content, styles];
    console.log(images);
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
      if (fs.existsSync(imgsPath + progress.id)) {
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
