import Buttons from "./Buttons";
import { Grid, Input, Typography, Button} from "@mui/material";
import { uploadFiles, 
        embedStegoImage, 
        getEmbedResponse,
        getFiles,
        downloadImage,
        removeFilesFromServer,
        resetStore,
        getDownloadImageStatus
 } from "../features/stegoSlice";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardMedia } from "@mui/material";
import { useState } from "react";
import ImagePlaceholder from '../assets/images/imagePlaceholder.png'
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EmbedImage = () => {

const [files, setFiles] = useState({
    coverImageValue:'',
    messageValue:'',
    coverImageFile:'',
    messageFile:'',
    error:''
})

const dispatch = useDispatch()
const navigate = useNavigate()
const embedImageStatus = useSelector(getEmbedResponse)
const uploadFilesStatus = useSelector(getFiles)
const downloadStatus = useSelector(getDownloadImageStatus)

useEffect(()=>{
    if(downloadStatus.hasOwnProperty('message')){
        document.getElementById('coverImage').value = ''
        document.getElementById('message').value = ''
        dispatch(resetStore())
        dispatch(removeFilesFromServer())
        navigate('/stego')
    }
},[downloadStatus.message])

const uploadCoverImage = () => {
    if(files.coverImage !== ''){
        dispatch(uploadFiles(files.coverImage))
        setFiles({...files, error:''})
    }else{
        setFiles({...files, error:'Please first select cover image for uploading'})
    }
}

const uploadMessage = () => {
    if(files.message !== ''){
        dispatch(uploadFiles(files.message))
        setFiles({...files, error:''})
    }else{
        setFiles({...files, error:'Please first message for uploading'})
    }
}

const download = () => {
    if(files.coverImage !== '' && files.message !== '' && embedImageStatus.hasOwnProperty('message')){
        dispatch(downloadImage())
        setFiles({...files, error:''})
    }else{
        setFiles({...files, error:'You have to upload both message and cover image!'})
    }   
}

const handleChange = name => event =>{
    //create file for uploading
    let formData = new FormData()
    formData.append('encryptedImage',  event.target.files[0])

    //check if upload image is of the type jpeg, jpg, png
    if(name === 'coverImage' 
    && (
        event.target.files[0].type === 'image/jpeg'
    || event.target.files[0].type === 'image/jpg'
    || event.target.files[0].type === 'image/png')){
        setFiles({...files,
            changeImage:false, 
            coverImageValue: event.target.value,
            coverImage: formData,
            error:''
        })
    //check if uploaded message is of type .txt
    }else if(name === 'message' && event.target.files[0].type === 'text/plain'){
        setFiles({...files, 
            coverImageValue:event.target.value,
            message:formData,
            error:''
        })
    //create errors
    }else{
        setFiles({...files, 
            error: 'Please upload png, jpg or jpeg format for cover image or txt for message'})
    }    
}


return(

<Grid container item xs={12} md={12} lg={12} xl={12}>
    {/* Embed and Extract buttons */}
    <Grid container item xs={12} md={12} lg={12} xl={12} justifyContent='flex-start'>
        <Buttons />
    </Grid>
    {/* input fields for files and Cover image */}

    
    <Grid container item xs={12} md={8} lg={6} xl={6} justifyContent='center'>

        {/* Cover image */}
        <Grid item xs={4} md={3} lg={3} xl={3} textAlign='right'>
                <Typography component={'p'} style={{marginRight:'2px', display:'inline-flex'}}>
                    Cover image:
                </Typography>
        </Grid>

        <Grid item xs={8} md={6} lg={6} xl={6}>
                <Input type="file" id='coverImage' 
                onChange={handleChange('coverImage')}
                defaultValue={files.coverImageValue ? files.coverImageValue : ''} /> 
        </Grid>  

        <Grid item xs={12} md={2} lg={2} xl={2} textAlign='left'>
            <Button 
            variant="contained" 
            style={{minWidth:'120px'}}
            onClick={uploadCoverImage}>UPLOAD</Button>
        </Grid> 
{/*  */}
        <Grid item xs={4} md={3} lg={3} xl={3} textAlign='right'>
            <Typography component={'p'} style={{marginRight:'2px', display:'inline-flex'}}>
                Message:
            </Typography>
        </Grid>  

        <Grid item xs={8} md={6} lg={6} xl={6}>
            <Input type="file" id='message' onChange={handleChange('message')} /> 
        </Grid> 

        <Grid item xs={12} md={2} lg={2} xl={2} textAlign='left'>
            <Button 
            variant="contained" 
            style={{minWidth:'120px'}} 
            onClick={uploadMessage}>UPLOAD</Button>
        </Grid>
{/* OUTPUT IMAGE */}
    <Grid item xs={4} md={3} lg={3} xl={3} textAlign='right'>

        <Typography component={'p'} style={{marginRight:'2px', display:'inline-flex'}}>
            Output image:
        </Typography>

        </Grid>  

    <Grid item xs={8} md={6} lg={6} xl={6}>
       <div style={{borderBottomStyle:"solid", minHeight:'30px', width:'65%', color:'green'}}>
       { Object.keys(embedImageStatus).length !== 0 && embedImageStatus.hasOwnProperty('message') 
        ?  embedImageStatus.message
        : null
       }
       </div>
        
    </Grid> 

    <Grid item xs={12} md={2} lg={2} xl={2} textAlign='left'>
       <Button 
       variant="contained" 
       style={{minWidth:'120px', marginBottom:'20px'}}
       onClick={download}>DOWNLOAD</Button>
    </Grid>
    {/* EMPTY FIELDS ERRORS. VALIDATION FRONTEND */}
    { 
    files.error !== '' ? <Grid item xs={12} md={12} lg={12} xl={12} textAlign='center'>
    <Typography component={'p'} style={{marginRight:'2px', display:'inline-flex', color:'red'}}>
           {files.error} 
        </Typography>
    </Grid>
    : null
    }
    {/* EMBED MESSAGE IN COVER IMAGE ERRORS */}
    { 
        Object.keys(embedImageStatus).length !== 0 && embedImageStatus.hasOwnProperty('error') 
    ? <Grid item xs={12} md={12} lg={12} xl={12} textAlign='center'>
    <Typography component={'p'} style={{marginRight:'2px', display:'inline-flex', color:'red'}}>
           {embedImageStatus.error} 
        </Typography>
    </Grid>
    : null
    }
    {/* UPLOAD FILES ERRORS */}
    { Object.keys(uploadFilesStatus).length !== 0 && uploadFilesStatus.hasOwnProperty('error') 
    ? <Grid item xs={12} md={12} lg={12} xl={12} textAlign='center'>
    <Typography component={'p'} style={{marginRight:'2px', display:'inline-flex', color:'red'}}>
           {uploadFilesStatus.error} 
        </Typography>
    </Grid>
    : null
    }

    <Grid container item xs={12} md={7} lg={7} xl={7} justifyContent='center'>
        <Button variant='contained' style={{width:'100%', minHeight:"60px"}} onClick={()=>dispatch(embedStegoImage())}>EMBED</Button>
    </Grid>

    
</Grid>


    
    <Grid container item xs={12} md={4} lg={4} xl={4} justifyContent='center' style={{marginTop:"20px"}}>
    <Card
    style={{width:'250px', height:'250px'}}>
        <CardMedia 
        component={'img'}
        src={
            //display uploaded user cover image
            uploadFilesStatus.hasOwnProperty('imageUrl') ?
             uploadFilesStatus.imageUrl
            : ImagePlaceholder }>

        </CardMedia>
    </Card>
</Grid>



</Grid>


    )
}

export default EmbedImage;