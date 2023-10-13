const flutterwave = require('flutterwave-node-v3')
const transfer = require('../model/transfer')
const bank = require('../model/bank')


//function to calculate success rate and settlement time of a bank
//store the success rate in the bank database
//store the settlement time in the bank database
async function run(bankCode, accountNumber, bankName ){

     // Fetch transactions for the recipient bank and sort them by timestamp in descending order
     // Sort in descending order based on timestamp to get the latest transactions first
     const l1 = await transfer.find({ "data.bank_code": bankCode }).sort({ "data.paymentConfirmationTime": -1 }).limit(4)
     //console.log(l1)

     const payTime = l1[0].data.paymentConfirmationTime
    
     // Filter out transactions that are not successful
     const l2 = l1.filter((item) => item.data.status === 'SUCCESSFUL')
    //  console.log("------------------------")
    //  console.log(l2)
    //  console.log("------------------------")

     // Calculate the number of successful transactions
     const l3 = l2.length
     const l4 = l1.length

     // Calculate the success rate
     const l5 = (l3 / l4) * 100
     const l51 = l5.toFixed(2)
     // console.log(l5)

     //calculate timestamp in hr 
     const hourAgo = new Date()
     hourAgo.setHours(hourAgo.getHours() - 1)

     let l7 = null;
    //calculate the settlement time of bank
    if (l2.length > 0) {
     //const l6i = l2.reduce((acc, item) => acc + Number(item.data.settlementTime), 0)
     const l6i = l2.reduce((acc, item) => acc + Number(item.data.settlementTime || 0), 0);
     const l7i = l6i / l3
           l7 = l7i.toFixed(2)
    } else {
        // Handle the case where l2 is empty (no 'SUCCESSFUL' items)
           l7 = 0.00;
      }

     //store the success rate in the bank database
     const l6 = await bank.findOneAndUpdate({ "timeOfCronJob": { $gte : hourAgo } , "bank_code": bankCode }, { "success_rate": l51 + "%", "bank_code": bankCode, "account_number": accountNumber, "timeOfCronJob" :  payTime, "settlement_time": l7, "bank_name" : bankName }, { upsert: true , new: true })
     //console.log(l6)
 }

 //endpoint to receive webhook from flutterwave
 //update transaction status and calculate settlement time
 //call run function to calculate success rate and settlement time of a bank
 const webhook = async (req, res) => {
     try {

         const k1 = req.body
         const payDate = new Date()
         //console.log(k1.data.id)

         //error handling
         if ( !k1.data.id ) {
             return res.sendStatus(404)
         }

         const lip = await transfer.findOne({ "data.id" : k1.data.id })
         //console.log(lip.data.status)
         if( lip.data.status == k1.data.status ) {
             return res.sendStatus(200)
         }

         const k2 = await transfer.findOneAndUpdate({ "data.id" : k1.data.id}, { "message": "transfer_Done", "data.paymentConfirmationTime" : payDate , "data.status" : k1.data.status, "data.complete_message": k1.data.complete_message }, { new: true })

         //calculate the settlement time of this transaction in milliseconds
         const settlementTime = new Date(k2.data.paymentConfirmationTime) - new Date(k2.data.paymentInitiationTime)

         //Convert settlement time to sec
         const settlementTimeMin = settlementTime / (1000 * 60 )
         k2.data.settlementTime = settlementTimeMin.toFixed(2)
         await k2.save()
         //console.log(k2)
         console.log("webhook called")

         const bankCode = k2.data.bank_code
         const accountNumber = k2.data.account_number
         const bankName = k2.data.bank_name

         run(bankCode, accountNumber, bankName)

         res.status(200).send(k2)

     } catch (err) {
         console.log(err.message)
     }
 }

//function to perform a single transfer to a bank
const kosi = async (CODE, NUM) => {
    try {
        const flw = new flutterwave(process.env.FLUTTER_PUBLIC_KEY, process.env.FLUTTER_SECRET_KEY)
        const details = {
            account_bank: CODE,
            account_number: NUM,
            amount: 100,
            narration: "TRANSACTION TO STUDY TRANSFER RATE AND SETTLEMENT TIME OF BANKS",
            currency: "NGN",
            callback_url: "https://ratek.fly.dev/app/webhook",
            debit_currency: "NGN"
        };

        const response = await flw.Transfer.initiate(details);
        const payDate = new Date()
         // Check if response.data is not null or undefined before setting properties
         if (response.data) {
            response.data.paymentInitiationTime = payDate;
            const lo = await transfer.create(response);
            console.log(lo);
            return lo;
        } else {
            console.log(response)
            console.log("Response data is null or undefined");
        }

    } catch (err) {
        console.log(err.message)
    }
}

// let lap = [
//{BankCode: '044', BankName: 'access bank', BankAccount: '0690000031'}
//{BankCode: '070', BankName: 'fidelity bank', BankAccount: process.env.FID },
// ]

//account to transfer to
let lap = [
    {BankCode: '305', BankName: 'opay', BankAccount: process.env.OPAY }
]

//function to initiate transfer
function initiatePay() {
     try{
         for(let i = 1; i <= 3 ; i++) {
            console.log("transfer to bank " + i)
             lap.forEach((item) => {
                kosi(item.BankCode, item.BankAccount)
             })
         }

     } catch (err) {
         console.log(err.message)
     }
 }

//endpoint to initiate transfer to serveral banks
const transferToBank = async (req, res) => {
    try {

        initiatePay()
        res.status(200).json( { message: "transfer done" } )

    } catch (err) {
        console.log(err.message)
    }
}

//delete all transaction on database
const del = async (req, res ) => {
    try {
        const fin = await transfer.deleteMany({})
        res.json({message: "done"})
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = { transferToBank, webhook, del }