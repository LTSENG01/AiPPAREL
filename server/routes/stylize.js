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
  progress["timestamp"] = new Date();
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
        console.log(imgFilename);
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
    const images = [content, styles];
    // style.forEach(images.push);
    const stylePyScript = spawn(
      "python/venv/bin/python",
      [
        "python/stylize.py",
        "--checkpoint=python/magenta_folder/checkpoint/model.ckpt",
        `--output_dir=server/images/${id}`,
        `--style_images_paths=${images[0]}`,
        `--content_images_paths=${images[1]}`,
        "--image_size=256",
        "--content_square_crop=False",
        "--style_image_size=256",
        "--style_square_crop=False",
        "--interpolation_weights=[0.0,0.2,0.4,0.6,0.8,1.0]",
        "--logtostdout",
      ],
      {
        cwd: "/srv/hackumass",
      }
    );

    stylePyScript.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    stylePyScript.stderr.on("data", (err) => {
      progress.status = ERROR;
      progress["message"] = "Failed to load image";
      console.log(err.toString());
    });

    stylePyScript.on("close", (code) => {
      const files = fs.readdirSync(imgsPath + progress.id);
      let completed = files.some((file) =>
        /^[A-Za-z0-9_-]{21}_stylized_[A-Za-z0-9_-]{21}_[0-9]{1}/.match(file)
      );
      console.log(completed);
      if (completed) {
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
