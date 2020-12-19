const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const shortid = require('shortid')
const app = express();
const router = express.Router();
const {IN_PROGRESS, ERROR, SUCCESS} = require('../../enums/status.js');

app.use(fileUpload({createParentPath: true}));
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('dev'));

function writeProgress(progress) {
  fs.writeFile(`./status/${progress.id}.json`, JSON.stringify(progress));
}

/* GET stylize listing. */
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
          Object.keys(req.files.photos).forEach((key) => {
              let photo = req.files.photos[key];
              photo.mv('./uploads/' + photos.name);
              data.push({name: photo.name, mimetype: photo.mimetype, size: photo.size})
          })
          writeProgress(progress);
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

  
  // send the URL of the finished image back
  res.send('finished image URL goes here');
});

module.exports = router;
