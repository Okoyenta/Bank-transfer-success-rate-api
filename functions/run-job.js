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


 connect()
 initiatePay()
 console.log('cron job started')
 
// path must route to netlify
app.use('/app/', router); 


module.exports = app
module.exports.handler = serverless(app)