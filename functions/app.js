const express = require('express')
const serverless = require('serverless-http');
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

//require with context
const getBank = require('./controller/bankController')
const { transferToBank, webhook, del } = require("./controller/transferController")
const connect = require('./controller/db')

const app = express()
const router = express.Router()

const PORT = process.env.PORT
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const db_name = process.env.DB_NAME

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//connect to database
// connect()
// initiatePay()

async function con() {
    try {

        await connect()
        //await initiatePay()

        router.get('/', getBank)
        router.get('/transfer', transferToBank )
        router.get('/del', del)
        router.post('/webhook', webhook )

    } catch (error) {
        console.log(error);
    }
    }

    con()

//get all bank and their success rate and settlement time
//transfer to know bank status before time(cron job)
//delete transaction all transaction from database
//webhook endpoint
// router.get('/', getBank)
// router.get('/transfer', transferToBank )
// router.get('/del', del)
// router.post('/webhook', webhook )

// path must route to netlify
app.use('/app/', router); 

module.exports = app
module.exports.handler = serverless(app)