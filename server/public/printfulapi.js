//const { post } = require("../routes");
const { printful_key } = require("../config.json");

/*
@input id - id of product
@return json of product or 1 if failed - should also catch errors
*/
async function getProduct(id) {
    await fetch("https://api.printful.com/products/" + id).then(response => response.json()).then((prod) => { return prod; }).catch((error) => { console.log("error" + error); });
    return 1
}

/*
@input id - product id
@input image - image to use for body
@output returns task_id for printful or 1 if failed
*/
async function makeTask(id, image) {
    let area_width_front, area_width_back, area_height_front, area_height_back,
        width_front, width_back, height_front, height_back, top_front, top_back, left_front, left_back, variants;
    await fetch('https://api.printful.com/mockup-generator/create-task/' + id, {
        method: 'POST',
        headers: {
            authorization: printful_key
        },
        body: generateBody(id, image)
    }).then(response => response.json()).then(result => { return result.task_key; }).catch(error => { console.log("error" + error); });
    return 1;
}

/*
@input task_key - task key generated via makeTask, used to get the task results
@output returns json object with lots of information returns 1 if error/timeout
*/
async function getTask(task_key) {
    let counter = 0;
    let loop = setInterval(function () {
        await fetch("https://api.printful.com/mockup-generator/task?task_key" + task_key).then(response => response.json()).then(result => {
        console.log(result.status + " timer:" +  counter)    
        if (result.status === "completed" || counter >= 60) {
                clearInterval(loop);
                return result;
            }
        counter++;
        });
    },1000);
}


// constant which is just generic default settings
const default_position = {
        "area_width": 1800,
        "area_height": 2400,
        "width": 1800,
        "height": 1800,
        "top": 300,
        "left": 0
    }

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