import {Lock, LockOpen} from '@mui/icons-material'
import { ButtonGroup, Button, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { resetStore } from '../features/stegoSlice';
import { useDispatch } from 'react-redux';
const Buttons = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const extract = () => {
        dispatch(resetStore())
        navigate('/stego')
    }
    
    return (
   

            <Box
                sx={{
                    display: 'flex',
                    '& > *': {
                        m: 1,
                    },
                }}
    
            >
                <ButtonGroup
                    variant="text"
                    style={{ borderRadius: '0', borderBottomWidth: '0px', marginBottom:"40px" }}
                >
                    <Button onClick={()=>navigate('/')}
                    style={{ 
                        backgroundColor: window.location.pathname === '/' ? 'grey' :'white',
                        border: 'solid', 
                        borderBottomStyle:'none', 
                        fontSize: "24px", 
                        borderColor: "black", 
                        minWidth: '160px', 
                        textTransform:"none" }} key="two"><Lock /> Embed</Button>
                    <Button onClick={()=>extract()}
                    style={{ 
                        backgroundColor: window.location.pathname === '/stego' ? 'grey' :'white',
                        border: 'solid', 
                        borderBottomStyle:'none', 
                        minWidth: '160px', 
                        fontSize: "24px", 
                        borderColor: "black", 
                        borderLeftStyle: 'none', textTransform:"none" }} key="three"><LockOpen /> Extract</Button>
                </ButtonGroup>

            </Box>

    
    )
}

export default Buttons