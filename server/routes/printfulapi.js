//const { post } = require("../routes");
const { printful_key } = require("../config.json");
const fetch = require("node-fetch");
const request = require("request");
const fs = require("fs");
const download = (url, path, callback) => {
  request.head(url, (err, res, body) => {
    request(url).pipe(fs.createWriteStream(path)).on("close", callback);
  });
};
let thash = "hello";
/*
@input id - id of product
@return json of product or 1 if failed - should also catch errors
*/
async function getProduct(id, image, hash) {
  thash = hash;
  let urls = [];
  await fetch("https://api.printful.com/products/" + id)
    .then((response) => response.json())
    .then((prod) => {
      console.log(prod);

      urls = makeTask(id, image, prod);
    })
    .catch((error) => {
      console.log("error" + error);
    });
  console.log(urls);
}

/*
@input id - product id
@input image - image to use for body
@output returns task_id for printful or 1 if failed
*/
async function makeTask(id, image, prod) {
  let out;
  await fetch("https://api.printful.com/mockup-generator/create-task/" + id, {
    method: "POST",
    headers: {
      Authorization: printful_key,
      "Content-Type": "text/plain",
    },
    body: generateBody(id, image, prod),
  })
    .then((response) => response.json())
    .then((result) => {
      out = getTask(result.result.task_key, id);
      console.log("ugh");
      return out;
    })
    .catch((error) => {
      console.log("error" + error);
    });
}

/*
@input task_key - task key generated via makeTask, used to get the task results
@output returns json object with lots of information returns 1 if error/timeout
*/
async function getTask(task_key, id) {
  let mockups = [];
  let counter = 0;
  console.log(task_key);
  let loop = setInterval(async function () {
    await fetch(
      "https://api.printful.com/mockup-generator/task?task_key=" + task_key,
      {
        method: "POST",
        headers: {
          Authorization: printful_key,
          "Content-Type": "text/plain",
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result.result.status + " timer:" + counter);
        if (result.result.status === "completed" || counter >= 90) {
          let extras = result.result.mockups[0].extra;
          mockups = [
            result.result.mockups[0].mockup_url,
            extras[extras.length - 2].url,
            extras[extras.length - 1].url,
          ];
          saveImages(mockups, id);
          clearInterval(loop);
	  fs.writeFileSync("./server/status/" + thash + ".json", JSON.stringify({status: 2}));	
          return mockups;
        }
        counter++;
      });
  }, 1000);
}

// constant which is just generic default settings
const default_position = {
  area_width: 1800,
  area_height: 2400,
  width: 1800,
  height: 1800,
  top: 300,
  left: 0,
};

/*
    Generates a json body for use in creating tasks for printful API to assemble mockup images
    @input id - product id from printful
    @input image - image obtained through stylize
    @output body - json body used for task requests structure is:
    {
        variant_ids: []
        format: "jpg"
        files: [{
            placement:
            image_url:
            position: {}
        }]
    }
    */
function generateBody(id, image, prod) {
  let body = {};
  body["variant_ids"] = prod.result.variants.map((x) => x.id);
  body["format"] = "jpg";
  body["files"] = prod.result.product.files.map((file) => {
    return { placement: file.id, image_url: image, position: default_position };
  });
  body["files"] = body["files"].filter((file) => file.placement != "preview");

  return JSON.stringify(body);
}

const products = [
  {
    name: "All-Over Print Men's Crew Neck T-Shirt",
    id: "257",
    files: [
      {
        id: "default",
        type: "default",
        title: "Print file",
        additional_price: null,
      },
      {
        id: "back",
        type: "back",
        title: "Back print",
        additional_price: null,
      },
      {
        id: "sleeve_left",
        type: "sleeve_left",
        title: "Left sleeve",
        additional_price: null,
      },
      {
        id: "sleeve_right",
        type: "sleeve_right",
        title: "Right sleeve",
        additional_price: null,
      },
      {
        id: "preview",
        type: "mockup",
        title: "Mockup",
        additional_price: null,
      },
    ],
  },
  { name: "test", id: "test1" },
];

function saveImages(urls, id) {
  let co = 0;
  urls.forEach((x) => {
    console.log(x);
    download(
      x,
      "./server/images/" + thash + "/" + id + "_" + co + ".jpg",
      () => 1
    );
    co++;
  });
}

module.exports = { getProduct };
