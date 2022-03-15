import mongoose from 'mongoose'
import crypto from 'crypto'


const ImageSchema = new mongoose.Schema({
    fileName:{
        type:String
    },
    encryptedImage:{
        type: String
    },
    fileUrl:{
        type:String
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    message: {
        type: String,
    },
    salt: String,
})


ImageSchema.methods = {
  encryptMessage: function(message){
        try{
            return crypto
            .createHmac('sha1', this.salt)
            .update(message)
            .digest('hex')
        } catch(err){
            return ''
        }
    },
    makeSalt: function(){
        return Math.round((new Date().valueOf() * Math.random())) + ''
    }
}

export default mongoose.model('Image', ImageSchema);