const express = require('express');
const { spawn } = require('child_process');

const router = express.Router();

/* POST stylize listing. */
router.post('/', function(req, res, next) {
  // grab image link from request body
      // do we include raw images as well?

  // preprocess the image

  // store in a local directory

  // run the python script
  const stylePyScript = spawn("python3", ["../python/stylize.py", "originalImage", "styleImage"])

  stylePyScript.stdout.on('data', data => {
    // do something
  })

  stylePyScript.stderr.on('data', err => {

  })

  stylePyScript.on('close', code => {

  })

  // send the URL of the finished image back
  res.send('finished image URL goes here');
});

module.exports = router;
