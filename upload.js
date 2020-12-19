

const port = process.env.PORT || 3000;

app.listen(port, ()=>{console.log("listening on port " + port)});

// let uploadForm = '<form action="/upload" method="post" enctype="multipart/form-data">'
// uploadForm += '\n<input type="file" accept="image/*" name="photo" >';
// uploadForm += '\n        <input type="submit" value="upload">'
// uploadForm += '\n</form>';

// module.exports = {uploadForm : uploadForm};
app.post('/upload-photos', async (req, res) => {
    // creating ID code for the series of images and the transaction
    // adding that to an images object that carries the id and an array of photos
    // for stylizing

    
});
