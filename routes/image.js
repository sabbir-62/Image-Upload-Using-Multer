// Requirements
const express = require('express');
const router = express.Router();
const multer = require('multer');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');


router.post("/image-upload", async(req,res) => {
    try{
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'public/media')
            },
            filename: (req, file, cb) => {
                cb(null, file.originalname)
            }
        })
        const maxSize = 5 * 1024 * 1024;
        const upload = multer({
            storage: storage,
            fileFilter: (req, file, cb) => {
                if(file.mimetype === "image/jpg" ||
                   file.mimetype === "image/png" ||
                   file.mimetype === "image/jpeg" ||
                   file.mimetype === "image/webp"
                ){
                    cb(null, true)
                }
                else{
                    cb(null, false);
                    return cb(new Error("Only jpg, png, jpeg and webp format is allowed"))
                }
            },
            limits: {fileSize: maxSize}
        }).single('myfile')

        upload(req, res, async(err) => {
            console.log("Fields Test", req.body);
            console.log("File Test", req.file);

            const file = await imagemin(['public/media/*.{jpg,png,jpeg,webp}'], {
                destination: 'public/media',
                plugins: [
                    imageminJpegtran(),
                    imageminPngquant({
                        quality: [0.6, 0.8]
                    })
                ]
            });
            console.log("======>", file[0]);

            res.download(file[0].destinationPath);

            if(err instanceof multer.MulterError){
                res.status(400).json({
                    status: "Fail",
                    message: err.message
                })
            }
            else if(err){
                res.status(400).json({
                    status: "Fail",
                    message: err.message
                })
            }
        })
    }

    catch(err){
        console.log(err);
    }
})

module.exports = router