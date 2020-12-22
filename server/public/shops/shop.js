let imgIDs
let hash;
initialize();


function initialize() {

    hash = getCookie("hash");
    imgIDs = [257,260, 1];
    const album = document.getElementById('container');
    renderShop(album);
}

function doesFileExist(urlToFile) {
	    var xhr = new XMLHttpRequest();
	    xhr.open('HEAD', urlToFile, false);
	    xhr.send();
	     
	    if (xhr.status == "404") {
		            return false;
		        } else {
				        return true;
				    }
}

function getCookie(cname) {
	  var name = cname + "=";
	  var decodedCookie = decodeURIComponent(document.cookie);
	  var ca = decodedCookie.split(';');
	  for(var i = 0; i <ca.length; i++) {
		      var c = ca[i];
		      while (c.charAt(0) == ' ') {
			            c = c.substring(1);
			          }
		      if (c.indexOf(name) == 0) {
			            return c.substring(name.length, c.length);
			          }
		    }
	  return "";
}


function renderShop(element) {
    
    element.classList.add('col');
    for (let y = 0; y < 3; y++) {
        const row = document.createElement('div');
        row.classList.add('row');
        for (let x = 0; x < 3; x++) {
            const col = document.createElement('div');
            col.classList.add('col','grid-item');
            const img = document.createElement('img');
            img.classList.add('image-box');
	    let path = "./../output_images/" + hash + "/" + String(imgIDs[y]) + "_" + String(x) + ".jpg";
	    
	    if (doesFileExist(path)) {
	       img.setAttribute('src', path);
	    }
	    else {
               //img.setAttribute('src',"./images/test1.jpg");
	       continue;	
	    }
            img.setAttribute('id',"item" + x + "" + y);
            img.classList.add('img-with-text');
            
            const popupContainer = document.createElement('div');
            popupContainer.setAttribute('id',img.getAttribute('id') + "_Popup_container");

            img.addEventListener("mouseover",() => {
                drawPopup(popupContainer.getAttribute('id'));
            });
            img.addEventListener('mouseout',() => {
                undrawPopup(popupContainer.getAttribute('id'));
            });
            const text_box = document.createElement('div');
            text_box.className = "square";
            text_box.classList.add('box_text');
            
            popupContainer.appendChild(text_box);
            img.appendChild(popupContainer);
            col.appendChild(img);
            row.appendChild(col);
        }
        element.appendChild(row);
    }

}

function drawPopup(name){
    const popup = document.getElementById(name);
    console.log("moused over");
    popup.classList.add('show');
}
function undrawPopup(name){
    const popup = document.getElementById(name);
    console.log("moused out");
    popup.classList.remove('show');
}
