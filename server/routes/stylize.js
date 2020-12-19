const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const _ = require('lodash');
const shortid = require('shortid')
const router = express.Router();
const {IN_PROGRESS, ERROR, SUCCESS} = require('../../enums/status.js');


function writeProgress(progress) {
  
  fs.writeFileSync(`./status/${progress.id}.json`, JSON.stringify(progress));
}

/* POST stylize listing. */
router.post('/', function(req, res, next) {
  let id = shortid.generate();

    // id: String, contentImage: String, styleImages: String[]
  let images = {id: id, contentImage: "", styleImages: []};
  let progress = { status: IN_PROGRESS, id: id };
  try {
    // if no files attached, return error/failed
      if(!req.files) {
          res.send({
              status: false,
              message: 'no images included'
          });
      } else {
          let data = [];
          req.files.photos.forEach((photo) => {
              photo.mv('./uploads/' + photo.name);
              data.push({name: photo.name, mimetype: photo.mimetype, size: photo.size, path: "./uploads/" + photo.name})
          })
          writeProgress(progress);
          console.log(1);
          res.send({
              status: true,
              message: 'successful upload',
              id: id, 
              data: data,
          });
      }
  } catch (err) {
      res.status(500).send(err);
  }
  // const stylePyScript = spawn("python3 ../python/stylize.py", ["originalImage", "styleImage"])

  // stylePyScript.stdout.on('data', data => {
  //   progress.status = ERROR;
  //   progress['data'] = data;
  //   writeProgress(progress);
  // })

  // stylePyScript.stderr.on('data', err => {

  // })

  // stylePyScript.on('close', code => {

  // })

});

module.exports = router;
