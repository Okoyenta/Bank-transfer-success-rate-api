const serverless = require('serverless-http');
const express = require('express')
const cron = require('node-cron')
const getBank = require('./controller/bankController')
const { transferToBank, webhook, initiatePay, del } = require("./controller/transferController")
const connectToDB = require('./controller/db')
require('dotenv').config()

const app = express()
const router = express.Router();

const PORT = process.env.PORT
//const user = process.env.DB_USER
//const password = process.env.DB_PASSWORD
//const db_name = process.env.DB_NAME

//connect to db
connectToDB()


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

// const handler = serverless(app);
// module.exports.handler = async (event, context) => {
//   const result = await handler(event, context);
//   return result;
// };