import express from "express";
import imageCtrl from '../controllers/image.controller'
import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './output/')
    },
    filename: (req, file, callback) => {
        callback(null, 'encrypted_' + file.originalname)
    }, 
})


const upload = multer({
    storage:storage,
    limits: {
        fileSize: 1024 * 1024 * 10,
    },
})

const router = express.Router()

router.route('/')
.get(imageCtrl.list)
.post(upload.single('encryptedImage', function(err){
    if(err instanceof multer.MulterError){
       return res.send(err)
    }
}), imageCtrl.create)



router.param('userId', imageCtrl.userByID)
export default router;