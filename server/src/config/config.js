require('dotenv').config();

const config = {
    port: process.env.PORT || 4400,
    secret: process.env.JWT_SECRET || 'Your secret key',
    mongo: process.env.MONGO || 'mongodb://localhost:27017/mernproject'
}

export default config;