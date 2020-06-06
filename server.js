const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const app = express();

app.use(express.static('public'));

app.use(cors())
app.use(fileUpload());

const uri = process.env.DB_PATH;

let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
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

        // res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
        // //demo  ***for testing perpose***
        client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect(err => {
            // const profile = req.body;
            const collection = client.db("TeachersProfile").collection("images");
            collection.insertOne({ filePath: `/uploads/${file.name}` }, (err, result) => {
                if (err) {
                    console.log(err)
                    res.status(500).send({ message: err });
                }
                else {
                    res.send(result);
                    console.log("success", result)
                }
            });
            client.close();
        });
    });
});

app.listen(5000, () => console.log("Server started..."));