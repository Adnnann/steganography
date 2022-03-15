import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import fileDownload from 'js-file-download'


export const uploadFiles = createAsyncThunk('stego/uploadFiles', async(file)=>{
   return await axios.post('http://localhost:5000/', file)
    .then(response=>response.data)
    .catch(error=>error)
})

export const uploadStegoImage = createAsyncThunk('stego/uploadStegoImage', async(file)=>{
    return await axios.post('http://localhost:5000/message', file)
     .then(response=>response.data)
     .catch(error=>error)
 })

export const embedStegoImage = createAsyncThunk('stego/embedImage', async() => {
    return await axios.get('http://localhost:5000/',{
    headers:{
        'Accept':'application/json',
        'Content-Type':'application/json'
      }
    }) 
    .then(response=>response.data)
    .catch(error=>error)
})

export const downloadImage = createAsyncThunk('stego/downloadImage', async()=>{
    return await axios.get('http://localhost:5000/downloadImage',{
        responseType:'blob',
    })
    .then(response=> fileDownload(response.data, 'stegoImage.jpg'))
    .catch(error=>error)
})

export const downloadMessage = createAsyncThunk('stego/downloadMessage', async()=>{
    return await axios.get('http://localhost:5000/downloadMessage',{
        responseType:'blob',
    })
    .then(response=> fileDownload(response.data, 'extractedMessage.txt'))
    .catch(error=>error)
})

export const extractMessage = createAsyncThunk('stego/extractMessage', async()=>{
    return await axios.get('http://localhost:5000/message')
    .then(response=> response.data)
    .catch(error=>error)
})

export const removeFilesFromServer = createAsyncThunk('stego/removeFiles', async()=>{
    return await axios.delete('http://localhost:5000/')
    .then(response=> response.data)
    .catch(error=>error)
})



const initialState = {
    sendFiles:{},
    sendStegoImage:{},
    imageUrl:{},
    embedImage:{},
    downloadImage:{},
    extractMessage:{},
    downloadImageStatus:{},
    downloadMessageStatus:{},
    removeFiles:{}
}

const stegoSlice = createSlice({
    name:'stego',
    initialState,
    reducers:{
       setImageUrl:(state, action) => {
           state.imageUrl = action.payload
       },
       resetStore:()=> initialState
    },
    extraReducers:{
        [uploadFiles.fulfilled]:(state, {payload})=>{
            return {...state, sendFiles: payload}
        },
        [uploadStegoImage.fulfilled]: (state, {payload})=>{
            return {...state, sendStegoImage:payload}
        },
        [embedStegoImage.fulfilled]:(state, {payload})=>{
            return {...state, embedImage: payload}
        },
        [downloadImage.fulfilled]: (state, {payload})=>{
            state.downloadImage = {...state, downloadImage:payload }
            state.downloadImageStatus = {message:'Successful download'}
        },
        [downloadMessage.fulfilled]: (state, {payload})=>{
            state.downloadMessage = {...state, downloadMessage:payload }
            state.downloadMessageStatus = {message:'Successful download'}
        },
        [extractMessage.fulfilled]: (state, {payload})=>{
            return {...state, extractMessage:payload}
        },
        [removeFilesFromServer.fulfilled]: (state, {payload})=>{
            return {...state, removeFiles:payload}
        }


    }
})

export const getFiles = (state) => state.stego.sendFiles
export const getStegoImage = (state) => state.stego.sendStegoImage
export const getImageUrl = (state) => state.stego.imageUrl
export const getEmbedResponse = (state) => state.stego.embedImage
export const getDownloadImageStatus = (state) => state.stego.downloadImageStatus
export const getExtractMessage = (state) => state.stego.extractMessage
export const getDownloadMessageStatus = (state) => state.stego.downloadMessageStatus

export const {setImageUrl, resetStore } = stegoSlice.actions

export default stegoSlice.reducer