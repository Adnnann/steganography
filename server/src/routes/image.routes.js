import express from "express";
import imageCtrl from '../controllers/image.controller'
import multer from "multer";
import fsExtra from 'fs-extra'

const storageCoverImage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './output/')
    },
    filename: (req, file, callback) => {
        callback(null, 
            file.originalname.split('.')[1] === 'txt' 
            ? 'message.txt' 
            : `coverImage.${file.originalname.split('.')[1]}`)
    }, 
})

const storageStegoImage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './output/')
    },
    filename: (req, file, callback) => {
        callback(null, 
            file.originalname.split('.')[1] === 'txt' 
            ? 'message.txt' 
            : `stegoImage.jpg`)
    }, 
})
const uploadCoverImage = multer({
    storage:storageCoverImage,
})

const uploadStegoImage = multer({
    storage:storageStegoImage,
   
})


const router = express.Router()

router.route('/')
.get(imageCtrl.encryptImage)
.post(uploadCoverImage.single('encryptedImage'), imageCtrl.create)
.delete(imageCtrl.removeFiles)
router.route('/downloadImage')
.get((req, res)=>{
        res.download('./output/stegoImage.jpg', (err)=>{
            if(err){
               return res.send({error:err})
            }
          
            
        })   
})

router.route('/downloadMessage')
.get((req, res)=>{
        res.download('./output/extractedMessage.txt', (err)=>{
            if(err){
               return res.send({error:err})
            }
          
            
        })   
})

router.route('/message')
.get(imageCtrl.getMessageFromStegoImage)
.post(uploadStegoImage.single('encryptedImage'), imageCtrl.create)

export default router;