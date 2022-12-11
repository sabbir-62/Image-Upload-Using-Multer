const express = require('express');
const router = express.Router();
const multer = require('multer');

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

        upload(req, res, (err) => {
            console.log("req.fields", req.body);
            console.log("req.file", req.file);

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