const serverless = require('serverless-http');
const express = require('express')
const cron = require('node-cron')
const getBank = require('./controller/bankController')
const { transferToBank, webhook, initiatePay, del } = require("./controller/transferController")
const connect = require('./controller/db')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
const router = express.Router()

const PORT = process.env.PORT
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const db_name = process.env.DB_NAME

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const initialize = async () => {
try {

 await connect()
 

//get all bank and their success rate and settlement time
//transfer to know bank status before time(cron job)
//delete transaction all transaction from database
//webhook endpoint
router.get('/', getBank)
router.get('/transfer', transferToBank )
router.get('/del', del)
router.post('/webhook', webhook )

} catch (err) {
    console.log(err.message)
    }
}

initialize()

// path must route to netlify
app.use('/app/', router); 


module.exports = app
module.exports.handler = serverless(app)