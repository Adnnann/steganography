import React from "react";
import { AppBar, Toolbar, Box, Typography } from "@mui/material";

const Header = () => {
  
        return(

        <AppBar position="static" style={{backgroundColor:'black'}}>
            
            <Toolbar style={{marginBottom:'2%', marginTop:'5%'}}>
            
            <Box
                component="img"
                sx={{height:  58}}
                alt="Steganography"
                src="https://cdn.slidesharecdn.com/ss_thumbnails/steganography-170203175329-thumbnail-4.jpg?cb=1486147776"
            />
                <Typography variant='h4' style={{marginLeft:'1%'}}>
                    Steganography
                </Typography>
                
            </Toolbar>

            <Typography variant='h6' style={{marginLeft:"2%"}}>
                The art of hidding
            </Typography>
                
    </AppBar>
    
    )
}

export default Header;