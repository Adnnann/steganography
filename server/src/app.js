
import express from 'express'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet';
import imageRoutes from './routes/image.routes'


const app = express();


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(compress())
app.use(helmet())
app.use(cors())

//create publicly available folder to store encrypted images
app.use('/output', express.static('output'));
app.use('/', imageRoutes)


export default app;