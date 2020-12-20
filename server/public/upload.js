initialize();

function initialize() {
    console.log("test");
    const submit_button = document.getElementById("submit_button");
    submit_button.addEventListener("click", () => {
        const formData = new FormData();
        const photos = document.querySelector('input[type="file"][multiple]');

        formData.append("images", "target_then_style");
        for (let i = 0; i < photos.isDefaultNamespace.length; ++i) {
            formData.append('images', photos.files[i])
        }

        fetch('/stylize', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
            })
            .catch(error => {
                console.error('Error', error);
            });
    });
}
