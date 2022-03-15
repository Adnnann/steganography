import Image from '../models/image.model'
import _ from 'lodash'
import errorHandler from '../helpers/dbErrorHandler'
import fs from 'file-system'
import fsExtra from 'fs-extra'
import { embed, digUp } from '@mykeels/steganography'

const create = (req, res, next) => {


    const fileSizeLimit = 1024 * 1024 * 10

    if(!req.file){
        return res.send({error:'You forgot to upload file'})
    }
   
    const image = new Image({
        encryptedImage: req.file.filename,
        imageUrl: `http://localhost:5000/output/${req.file.originalname}`
        
    })
      
    if(req.file.size > fileSizeLimit){
        //REMOVE IF FROM FOLDER IF FILE SIZE IS HIGHER THAN TRESHOLD
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
            res.send({message: 
                req.file.mimetype.includes('text/plain') 
                ? 'Message uploaded successfuly' 
                : 'Cover image uploaded successfuly'})
        })
    }else{
        //REMOVE IF FROM FOLDER IF ANY OTHER EXTENSION IS SENT TO SERVER
        fs.fs.unlinkSync(`./${req.file.path}`)
        return res.send({Error:'Format of the file must be PNG|JPEG|JPG|TXT'})
    }

    }

        
}

const encryptImage = (req, res, next) => {
    
    const image = './output/coverImage.jpeg'
    const message = './output/message.txt'
  
    if(!fs.fs.existsSync('./output/coverImage.jpeg') && !fs.fs.existsSync('./output/coverImage.png') && !fs.fs.existsSync('./output/coverImage.jpg')){
        return res.send({error:'Please upload image to enable embeding'})
     }else if(!fs.fs.existsSync(message)){
        return res.send({error:'Please upload message to enable embeding'})
     }else{(async () => {
    

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
           const text = await digUp(
             './output/stegoImage.jpg'
            ).catch(err=>{
                //control error in case extracing message is not possible
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
        }else{
            const text = await digUp(
                './output/stegoImage.png'
               ).catch(err=>{
                   //REPORT ERROR IF EXTRACTING MESSAGE IS NOTE POSSIBLE
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