const { post } = require("../routes");

let printful_api;
if (!process.env.printful) {
    printful_key = require('./secrets.json');
    printful_api = printful_key.key;
} else {
    printful_api = process.env.printful;
}

async function getProduct(id) {
    await fetch("https://api.printful.com/products/" + id).then(response => response.json()).then((prod) => { console.log(prod); }).catch((error) => { console.log("error" + error); });
}

async function makeTask(id, image) {
    let area_width_front, area_width_back, area_height_front, area_height_back,
        width_front, width_back, height_front, height_back, top_front, top_back, left_front, left_back, variants;


    await fetch('https://api.printful.com/mockup-generator/create-task/' + id, {
        method: 'POST',
        headers: {
            authorization: printful_api
        },
        body: generateBody(id, image)
    }).then(response => response.json()).then(result => { return result.task_key; });
}

async function getTask(task_key){
    await fetch("https://api.printful.com/mockup-generator/task?task_key" + task_key).then(response => response.json()).then(result => {
        if(result.status === "completed"){
        console.log(result);
        console.log(result.mockups[0].mockup_url);
        }});
        return 2;
}

function generateBody(id, image) {
    let body = {};
    for (i = 0; i < products.length; i++) {
        if (products[i].id = id) {
            body.variant_ids = [];
            for (ids in variants) {
                body.variant_ids.append(ids.id);
            }
            body.format = "jpg";
            body.files = [];
            for (file in products[i].files) {
                body.files.append({ "placement": file.id, "image_url": image, "position": default_position });
            }
        }
        return body
    }
    return 1;
}

const products = [
    {
        "name": "All-Over Print Men's Crew Neck T-Shirt", "id": "257", "files": [
            {
                "id": "default",
                "type": "default",
                "title": "Print file",
                "additional_price": null
            },
            {
                "id": "back",
                "type": "back",
                "title": "Back print",
                "additional_price": null
            },
            {
                "id": "sleeve_left",
                "type": "sleeve_left",
                "title": "Left sleeve",
                "additional_price": null
            },
            {
                "id": "sleeve_right",
                "type": "sleeve_right",
                "title": "Right sleeve",
                "additional_price": null
            },
            {
                "id": "preview",
                "type": "mockup",
                "title": "Mockup",
                "additional_price": null
            }
        ]
    },
    { "name": "test", "id": "test1" }
];
