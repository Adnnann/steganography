import { Image } from "@mui/icons-material"
import { getImageUrl } from "../features/stegoSlice"
import {useSelector} from 'react-redux'

const CoverImage = () => {

    const imageUrl = useSelector(getImageUrl)


    return(
        <Image 
            src='https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.ipcc.ch%2Fsrocc%2Fchapter%2Fchapter-3-2%2F3-1-introduction-polar-regions-people-and-the-planet%2Fimg-placeholder%2F&psig=AOvVaw3zxGtgwEsrfyMtj2bU38s7&ust=1647207054198000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCIiWztHCwfYCFQAAAAAdAAAAABAD' 
            style={{height:"80%", width:'80%'}}

        />
    )
}

export default CoverImage