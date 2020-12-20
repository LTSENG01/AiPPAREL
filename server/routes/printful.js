const express = require("express");
const router = express.Router();
const { getProduct } = require("./printfulapi.js");

/* GET home page. */
router.get("/", function (req, res, next) {
  let hash = req.query.hash;
  let itemNum = req.query.itemNum;

  res.send(
    getProduct(itemNum, `https://aipparel.online/result?hash=${hash}&num=3`)
  );
});

module.exports = router;
