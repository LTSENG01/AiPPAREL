initialize();

function initialize() {
    console.log("test");
    const submit_button = document.getElementById("submit_button");
    submit_button.addEventListener("click", () => {
        const formData = new FormData();
        const photos = document.querySelector('input[type="file"][multiple]');

        for (let i = 0; i < photos.files.length; ++i) {
            formData.append('images', photos.files[i])
        }

        fetch('/stylize', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
                document.cookie += "hash=" + result.id;
            })
            .catch(error => {
                console.error('Error', error);
            });
    });
}
