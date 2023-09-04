const serverless = require('serverless-http');
const express = require('express')
const cron = require('node-cron')
const mongoose = require('mongoose')
const getBank = require('./controller/bankController')
const { transferToBank, webhook, initiatePay, del } = require("./controller/transferController")
require('dotenv').config()

const app = express()
const router = express.Router();

const PORT = process.env.PORT
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const db_name = process.env.DB_NAME


//database connection
mongoose.connect(`mongodb+srv://${user}:${password}@cluster0.0qxab0k.mongodb.net/${db_name}?retryWrites=true&w=majority`,
 { useNewUrlParser: true, useUnifiedTopology: true })

 const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
    console.log('connected to db')
    });

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//get all bank and their success rate and settlement time
//transfer to know bank status before time(cron job)
//delete transaction all transaction from database
//webhook endpoint
router.get('/', getBank)
router.get('/transfer', transferToBank )
router.get('/del', del)
router.post('/webhook', webhook )


//Cron job to perform transaction at a specific time of the day
/*cron.schedule("* * * * * *", () => {
    initiatePay()
})*/


// app.listen(PORT, () => {
//     console.log(`running port ${PORT}`)
// })

//close db
// app.use((req, res) => {
//     mongoose.disconnect();
// });


app.use('/app/', router); // path must route to lambda


module.exports = app
module.exports.handler = serverless(app)