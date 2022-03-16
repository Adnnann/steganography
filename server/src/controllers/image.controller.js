import Image from '../models/image.model'
import _ from 'lodash'
import errorHandler from '../helpers/dbErrorHandler'
import fs from 'file-system'
import fsExtra from 'fs-extra'
import { embed, digUp } from '@mykeels/steganography'
import cpFile from 'cp-file'

const create = (req, res, next) => {

    let fileName = Date.now()
    //file size treshold
    const fileSizeLimit = 1024 * 1024 * 10
    //if no file sent to server report error. This is handled on frontend
    //but wanted to have additional check
    if(!req.file){
        return res.send({error:'You forgot to upload file'})
    }
   
    const image = new Image({
        encryptedImage: req.file.filename,
        imageUrl: `http://localhost:5000/output/${req.file.originalname}`
        
    })
      //if file size bigger than treshold remove file
    if(req.file.size > fileSizeLimit){
        fs.fs.unlinkSync(`./${req.file.path}`)
        return res.send({Error:'Allowed size of image is 10MB'})
    }else{
    if(req.file.mimetype.includes('image/jpeg')
    || req.file.mimetype.includes('image/png')
    || req.file.mimetype.includes('text/plain')){
        image.save((err, result) => {
            if(err) {
                return res.send({error: errorHandler.getErrorMessage(err)})
            }
            //create new file named with fileName (Date.now) only if message is not uploaded
            if(!req.file.mimetype.includes('text/plain')){
                //if file is coverImage then copy coverImage else copy stego image
                if(req.file.path.includes('coverImage')){
                    cpFile.sync(`output/coverImage.${req.file.originalname.split('.')[1]}`, 
                    `./output/${fileName}.${req.file.originalname.split('.')[1]}`)
                }else{
                    cpFile.sync(`output/stegoImage.jpg`, 
                    `./output/${fileName}.${req.file.originalname.split('.')[1]}`)
                }
                
            }
        
            //reduce added to control situation when user uploads text file
            //filter out stego and cover images to avoid errors
                const dir = fs.fs.readdirSync('./output').filter(item=>!item.includes('cover') 
                && !item.includes('stego')
                && !item.includes('message')
                && !item.includes('extracted'))
                .reduce(function (a, b){ return a > b ? a : b; })

            res.send({message: 
                req.file.mimetype.includes('text/plain') 
                ? 'Message uploaded successfuly' 
                : 'Cover image uploaded successfuly',
                imageUrl: `http://localhost:5000/output/${dir}`})
        })
        
    }else{
        //Multer is not preventing user to upload message but reports only error.
        //Code below unlinkes file if there is any error (for example wrong file format)
        fs.fs.unlinkSync(`./${req.file.path}`)
        return res.send({Error:'Format of the file must be PNG|JPEG|JPG|TXT'})
    }

    }

   
}

const encryptImage = (req, res, next) => {
    
    const image = './output/coverImage.jpeg'
    const message = './output/message.txt'
    //check if there is cover message uploaded. If not report error
    if(!fs.fs.existsSync('./output/coverImage.jpeg') && !fs.fs.existsSync('./output/coverImage.png') && !fs.fs.existsSync('./output/coverImage.jpg')){
        return res.send({error:'Please upload image to enable embeding'})
     }else if(!fs.fs.existsSync(message)){
        return res.send({error:'Please upload message to enable embeding'})
     }else{(async () => {
            //embed message in the image but first check which format was uploaded
            //by the user. Can be further simplified
            if(fs.fs.existsSync('./output/coverImage.jpeg')){
                const buffer = await embed(
                    './output/coverImage.jpeg', 
                    fs.fs.readFileSync('./output/message.txt', 
                    {encoding:'utf-8', flag:'r'})
                    
                    )
            
                    fs.fs.writeFileSync(
                        './output/stegoImage.jpg',
                        buffer
                    );
                return res.send({message:'Stego image created successfully'})     
            }else if(fs.fs.existsSync('./output/coverImage.png')){
                const buffer = await embed(
                    './output/coverImage.png', 
                    fs.fs.readFileSync('./output/message.txt', 
                    {encoding:'utf-8', flag:'r'})
                    
                    )
            
                    fs.fs.writeFileSync(
                        './output/stegoImage.jpg',
                        buffer
                    );
                return res.send({message:'Stego image created successfully'})     
            }else{
                const buffer = await embed(
                    './output/coverImage.jpg', 
                    fs.fs.readFileSync('./output/message.txt', 
                    {encoding:'utf-8', flag:'r'})
                    
                    )
            
                    fs.fs.writeFileSync(
                        './output/stegoImage.jpg',
                        buffer
                    );
                return res.send({message:'Stego image created successfully'})     
            }
    
           
            }    
        )()
    
    }  
    
}

const getMessageFromStegoImage = (req, res, next) => {

    if(!fs.fs.existsSync('./output/stegoImage.jpg') && !fs.fs.existsSync('./output/stegoImage.png')){
        return res.send({error:'Please upload image to extract message'})
     }else{
        (async() => {
        if(fs.fs.existsSync('./output/stegoImage.jpg')){
        //extract message from image
           const text = await digUp(
             './output/stegoImage.jpg'
            ).catch(err=>{
                //report error if no message is embeded in the image
                if(err){
                    return res.send({error:'Unable to extract message'})
                }else{
                //create text files with text extracted from the image
                 fs.fs.writeFileSync(
                     './output/extractedMessage.txt',
                      text
                 );
                 res.send({message:'Message extracted successfully. You can download it now.'})
                }
            })
            //needed to add this to resolve rather awkward message from the server
            if(typeof text === 'string'){
                fs.fs.writeFileSync(
                    './output/extractedMessage.txt',
                     text
                );
                res.send({message:'Message extracted successfully. You can download it now.'})
            }
        }else{
            const text = await digUp(
                './output/stegoImage.png'
               ).catch(err=>{
                   if(err){
                       return res.send({error:'Unable to extract message'})
                   }else{
                    fs.fs.writeFileSync(
                        './output/extractedMessage.txt',
                         text
                    );
                    res.send({message:'Message extracted successfully. You can download it now.'})
                   }
               })
               if(typeof text === 'string'){
                fs.fs.writeFileSync(
                    './output/extractedMessage.txt',
                     text
                );
                res.send({message:'Message extracted successfully. You can download it now.'})
               }
               
            }
            
        }
       
        )()         
     }    
}

const removeFiles = (req, res) => {

 let dir = './output'
 try {
    fsExtra.emptyDirSync(dir)
    res.send({message:'Output folder cleaned'})
  }catch(err){
    res.send({error:'Error while trying to clean folder'})
  }
}

export default {
    create,
    encryptImage,
    getMessageFromStegoImage,
    removeFiles
}