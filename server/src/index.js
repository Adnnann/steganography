import config from "./config/config";
import app from "./app";
import mongoose from 'mongoose'


app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })
app.listen(config.port, err=>{
    if(err) return console.log(err)
    console.log(`Server started on port ${config.port}`)
})

mongoose.Promise = global.Promise
mongoose.connect(config.mongo)
.then(() => console.log('MongoDB successfully connected...'))
.catch(() => console.log(`Error connecting to MongoDB ${config.mongo}!!!`))