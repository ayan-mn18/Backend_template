const express = require('express');
const morgan = require("morgan");
const bd = require("body-parser");
const colors = require("colors");
const dotenv = require("dotenv");
const { cloudinary } = require("./config/cloudinary");
const { upload } = require('./config/multer');
const cors = require("cors");
const db = require('./config/db.config');
const errorList = require('./config/errorList');

dotenv.config();

const PORT = process.env.PORT;

const app = express();

//middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(bd.urlencoded({ extended: false }));
app.use(bd.json());

app.get('/home', (req,res) =>{
    res.json("welcome");
})

app.post('/testcloudinary', upload.single("url") ,async (req,res) =>{
    try {
        if(!req.files) res.status(500).json({
            err: errorList.noFilesAttached
        });
        const image = req.file.path;
        console.log(image)
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
        };
        const result = await cloudinary.uploader.upload(image,options);
        res.json(result);
    } catch (err) {
        console.log(err.message);
    }
});

app.post('/testcloudinarymultiple', upload.array("urls") ,async (req,res) =>{
    try {
        if(!req.files) res.status(500).json({
            err: errorList.noFilesAttached
        });
        const images = req.files.map((file) => file.path);
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
        };
        let result = [];
        for(const image of images){
            const imgUrl = await cloudinary.uploader.upload(image,options);
            result.push(imgUrl);
        }
        await Promise.all(result)
        res.send(result);
    } catch (err) {
        console.log(err.message);
    }
});

app.listen(PORT, () => {
    console.log(`App running on PORT ${`${PORT}`.bold.yellow}`);
});