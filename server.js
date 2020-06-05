const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require('cors');
const app = express();

app.use(cors())
app.use(fileUpload());

// Upload Endpint
app.post("/upload", (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.files.file;

    file.mv(`${__dirname}/public/uploads/${file.name}`, err => {
        if (err) {
            console.error(err);
            res.status(500).send(err);
        }

        res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
    });
});

app.listen(5000, () => console.log("Server started..."));