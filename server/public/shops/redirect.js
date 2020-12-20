
// This handler runs every seconds
setInterval(() => {
    // Check if the internal processing is complete
    let hash = getCookie("hash")
    fetch(`/design/${hash}`)
        .then(response => console.log(response.text()))
        .then(response => {
            switch (response.status) {
                case 200:
                    window.location.href = "/shop.html"
                    return
                case 202:
                    console.log("Still processing!")
                    break
                case 400:
                case 404:
                case 500:
                default:
                    alert("There was an error with processing!")
                    break
            }
        })
        .catch(error => {
            alert("There was an error with this page! " + error)
        })
}, 1000)

// Grabs a cookie value (from w3schools.com)
function getCookie(cname) {
    const name = cname + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
