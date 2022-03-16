import Buttons from "./Buttons";
import { Grid, Input, Typography, Button} from "@mui/material";
import {uploadStegoImage,
        getStegoImage,
        downloadMessage,
        getDownloadMessageStatus,
        extractMessage,
        resetStore,
        removeFilesFromServer,
        getExtractMessage,
        getFiles
} from "../features/stegoSlice";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardMedia } from "@mui/material";
import {useState} from 'react'
import ImagePlaceholder from '../assets/images/imagePlaceholder.png'
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";



const ExtractImage = () => {

const dispatch = useDispatch()
const navigate = useNavigate()

const extractMessageStatus = useSelector(getExtractMessage)
const downloadStegoMessageStatus = useSelector(getDownloadMessageStatus)
const uploadImageStatus = useSelector(getStegoImage)

const [files, setFiles] = useState({
    stegoImage:'',
    fileExt:'',
    error:''
})



useEffect(()=>{
    if(downloadStegoMessageStatus.hasOwnProperty('message')){
        dispatch(resetStore())
        dispatch(removeFilesFromServer())
        navigate('/')
    }
},[downloadStegoMessageStatus.message])

const handleChange = name => event =>{
    if(event.target.files[0].type === 'image/jpeg'
    || event.target.files[0].type === 'image/jpg'
    || event.target.files[0].type === 'image/png'){

        setFiles({...files, 
            [name]:event.target.files[0],
            error:''})

    }else{

        setFiles({...files, error:'You must upload image in jpg, jpeg or png format'})  
    }
}

const upload = () => {
    if(files.stegoImage !== ''){
        let formData = new FormData()
        formData.append('encryptedImage',  files.stegoImage)
        setFiles({...files, error:''})
        dispatch(uploadStegoImage(formData))
    }else{
        setFiles({...files, error:'Please first upload file!'})
    }
    
}

const download = () => {
    if(files.stegoImage === ''){
        setFiles({...files, error:'Please first upload file!'})
    }else if(!extractMessageStatus.hasOwnProperty('message')){
        setFiles({...files, error:'No message was extracted'})
    }else{
        setFiles({...files, error:''})
        dispatch(downloadMessage())
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

        <Grid item xs={8} md={6} lg={6} xl={6} style={{marginBottom:'5px'}}>
                <Input type="file" id='stegoImage' onChange={handleChange('stegoImage')} /> 
        </Grid>  

        <Grid item xs={12} md={2} lg={2} xl={2} textAlign='left'>
            <Button 
            variant="contained" 
            style={{minWidth:'120px', marginBottom:'20px'}}
            onClick={upload}>UPLOAD</Button>
        </Grid> 
{/*  */}
        <Grid item xs={4} md={3} lg={3} xl={3} textAlign='right'>
            <Typography component={'p'} style={{marginRight:'2px', display:'inline-flex'}}>
                Message:
            </Typography>
        </Grid>  

        <Grid item xs={8} md={6} lg={6} xl={6}>
       <div style={{borderBottomStyle:"solid", 
       minHeight:'30px', 
       width:'75%', 
       fontSize:'20px',
       color:  Object.keys(extractMessageStatus).length !== 0 && extractMessageStatus.hasOwnProperty('error') 
       ? 'red' : 'green',
       marginBottom:'5px'}}>
       { //SUCCESS MESSAGE
        Object.keys(extractMessageStatus).length !== 0 
       ? extractMessageStatus.message
       :null
       }
    
       { //ERROR MESSAGE
        Object.keys(extractMessageStatus).length !== 0 && extractMessageStatus.hasOwnProperty('error')
       ? extractMessageStatus.error
       :null
       }
       </div>
        
    </Grid> 

        <Grid item xs={12} md={2} lg={2} xl={2} textAlign='left'>
            <Button 
            variant="contained" 
            style={{minWidth:'120px', marginBottom:'20px'}}
            onClick={download}>DOWNLOAD</Button>
        </Grid>



{ files.error !== '' 
    ? <Grid item xs={12} md={12} lg={12} xl={12} textAlign='center'>
    <Typography component={'p'} style={{marginRight:'2px', display:'inline-flex', color:'red'}}>
           {files.error} 
        </Typography>
    </Grid>
    : null
}

    <Grid container item xs={12} md={7} lg={7} xl={7} justifyContent='center'>
        <Button 
        variant='contained' 
        style={{width:'100%', minHeight:"60px"}}
        onClick={()=>dispatch(extractMessage())}>Extract</Button>
    </Grid>

</Grid>


    
    <Grid container item xs={12} md={4} lg={4} xl={4} justifyContent='center' style={{marginTop:"20px"}}>
    <Card style={{width:'250px', height:'250px'}}>
        <CardMedia 
        component={'img'}
        src={uploadImageStatus.hasOwnProperty('imageUrl') ? 
        uploadImageStatus.imageUrl
        : ImagePlaceholder}>

        </CardMedia>
    </Card>
</Grid>


</Grid>



    )
}

export default ExtractImage;