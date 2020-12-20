const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const fileUpload = require("express-fileupload");

const indexRouter = require("./routes/index");
const stylizeRouter = require("./routes/stylize");
const designRouter = require("./routes/design");
const retrieveImageRouter = require("./routes/retrieveImage");
const shopRouter = require("./routes/shop");

const app = express();

app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/stylize", stylizeRouter);
app.use("/design/:hash", designRouter);
app.use("/result", retrieveImageRouter);
module.exports = app;
