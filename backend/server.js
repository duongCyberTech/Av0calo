const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const authRoute = require('./routes/auth.route')
const subRoute = require('./routes/subcriptions.route')
const userRoute = require('./routes/user.route')
const cartRoute = require('./routes/cart.route')
const orderRoute = require('./routes/orders.route')
const shipmentRoute = require('./routes/shipment.route')
const addressRoute = require('./routes/addresses.route')
const promotionsRoute = require('./routes/promotions.route')
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
app.use('/users', userRoute)
app.use('/cart', cartRoute)
app.use('/orders', orderRoute)
app.use('/shipments', shipmentRoute)
app.use('/addresses', addressRoute)
app.use('/promotions', promotionsRoute)

app.listen(process.env.PORT, () => {
    console.log("Av0Calo server is running on port: ", process.env.PORT)
})