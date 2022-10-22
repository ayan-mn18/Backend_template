const express = require('express');
const morgan = require("morgan");
const bd = require("body-parser");
const colors = require("colors");
const dotenv = require("dotenv");
const cors = require("cors");

const router = require('./routes');
const { tokenVerification, db, e: errorList, cloudinary, upload } = require('./config');
const { imageUploaderMulti } = require('./services');


dotenv.config();

const PORT = process.env.PORT;

const app = express();

//middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(bd.urlencoded({ extended: false }));
app.use(bd.json());
app.use('/api', router);

app.get('/home', tokenVerification, async (req,res) =>{
    res.json("welcome");
})

app.post('/testcloudinary', tokenVerification, upload.single("url") ,async (req,res) =>{
    try {
        if(!req.file) res.status(500).json({
            err: errorList.file.noFilesAttached
        });
        const image = req.file.path;
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

app.post('/testcloudinarymultiple', tokenVerification, upload.array("urls") ,async (req,res) =>{
    try {
        if(!req.files) res.status(500).json({
            err: errorList.file.noFilesAttached
        });
        const result = await imageUploaderMulti(req);
        res.send(result);
    } catch (err) {
        console.log(err.message);
    }
});

app.listen(PORT, () => {
    console.log(`App running on PORT ${`${PORT}`.bold.yellow}`);
});