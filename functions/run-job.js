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


exports.handler = async function (event, context) {
    console.log("Running the scheduled job...");
  
    // Add your job logic here
    // For example, if you want to execute the initiatePay() function:
    connect()
    initiatePay();
  
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Scheduled job completed" }),
    };
  };