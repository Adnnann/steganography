import Image from '../models/image.model'
import _ from 'lodash'
import errorHandler from '../helpers/dbErrorHandler'

// works as intended
const create = (req, res, next) => {

    const fileSizeLimit = 1024 * 10
    
    const image = new Image({
        encryptedImage: req.file.filename,
        fileUrl: 'http://localhost:5000/' + req.file.destination + req.file.filename + '.' + req.file.mimetype.split('/')[1]
        
    })
   
    if(req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png'){
       
        return res.status(400).json({Error:'File needs to be jpg or png'})

    }else if(req.file.size > fileSizeLimit){

        return res.status(400).json({Error:'Allowed size of image is 10MB'})

    }else{
        image.save((err, result) => {
            if(err) {
                return res.status(400).json({error: errorHandler.getErrorMessage(err)})
            }
            res.status(200).json({message: 'Image uploaded successfully.'})
        })
    }
        
    
}
const list = (req, res) => {
    Image.find((err, users) => {
        if(err) {
            return res.status(400).json({error: errorHandler.getErrorMessage(err)})
        }
        res.status(200).json(users)
    }).select('_id encryptedImage fileUrl updated created')
}
const userByID = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user){
            return res.status(404).json({error:'User not found!'})
        }
    req.profile = user;
    next()
    })
}
const read = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    res.status(200).json(req.profile)
}
const update = (req, res, next) => {
    let user = req.profile
    user = _.extend(user, req.body);
    user.updated = Date.now()
    user.save(err=>{
        if(err){
            return res.status(400).json({error: errorHandler.getErrorMessage()})
        }
        user.hashed_password = undefined
        user.salt = undefined
        res.status(200).json(user)
    })
}
const remove = (req, res, next) => {
    let user = req.profile
    user.remove((err, deletedUser)=>{
        if(err){
            return res.status(400).json({error: errorHandler.getErrorMessage()})
        }
        deletedUser.hashed_password = undefined
        deletedUser.salt = undefined
        res.status(200).json(deletedUser)
    })
}
export default {
    create,
    list,
    userByID,
    read,
    update,
    remove
}