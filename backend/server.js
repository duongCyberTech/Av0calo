const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const authRoute = require('./routes/auth.route')
const subRoute = require('./routes/subcriptions.route')
require('dotenv').config()

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: '*',
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use('/auth', authRoute)
app.use('/subcriptions', subRoute)

app.listen(process.env.PORT, () => {
    console.log("Av0Calo server is running on port: ", process.env.PORT)
})