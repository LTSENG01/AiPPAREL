initialize();

function initialize() {

    // Document selectors
    const submitButton = document.getElementById("submit-button");
    const photoSelectors = document.querySelectorAll('input[type="file"]');

    const contentInput = document.getElementById("content-img-upload")
    const contentPreview = document.getElementById("content-preview")
    const styleInput = document.getElementById("style-img-upload")
    const stylePreview = document.getElementById("style-preview")

    // Provide uploading previews for the content image
    contentInput.addEventListener("change", () => {
        const reader = new FileReader();
        reader.readAsDataURL(contentInput.files[0]);

        reader.onload = function(e) {
            const { result } = e.target;
            contentPreview.setAttribute('src', result);
        }
    })

    // Provide uploading previews for the style image
    styleInput.addEventListener("change", () => {
        const reader = new FileReader();
        reader.readAsDataURL(styleInput.files[0]);

        reader.onload = function(e) {
            const { result } = e.target;
            stylePreview.setAttribute('src', result);
        }
    })

    // On submit
    submitButton.addEventListener("click", () => {
        const formData = new FormData();

        photoSelectors.forEach(selector => {
            formData.append('images', selector.files[0])
        })

        // POST the /stylize endpoint
        fetch('/stylize', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
            .then(result => {
                console.log('Success:', result)
                // Redirect to the processing page
                window.location.href = "/shops/redirect.html"
            })
            .catch(error => {
                console.error('Error', error)
                alert("There was an error uploading your images. Please try again later. " + error)
            });
    });
}
