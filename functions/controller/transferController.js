const flutterwave = require('flutterwave-node-v3')
const transfer = require('../model/transfer')
const bank = require('../model/bank')

//function to calculate settlement time
async function run(bankCode, accountNumber, bankName ){

     // Fetch transactions for the recipient bank and sort them by timestamp in descending order
     // Sort in descending order based on timestamp to get the latest transactions first
     const l1 = await transfer.find({ "data.bank_code": bankCode }).sort({ "data.paymentConfirmationTime": -1 }).limit(4)
     console.log(l1)

     const payTime = l1[0].data.paymentConfirmationTime
    
     // Filter out transactions that are not successful
     const l2 = l1.filter((item) => item.data.status === 'FAILED')
     console.log("------------------------")
     console.log(l2)
     console.log("------------------------")

     // Calculate the number of successful transactions
     const l3 = l2.length
     const l4 = l1.length

     // Calculate the success rate
     const l5 = (l3 / l4) * 100
     const l51 = l5.toFixed(2)
     console.log(l5)

     //calculate timestamp in hr 
     const hourAgo = new Date()
     hourAgo.setHours(hourAgo.getHours() - 1)

    
     const l6i = l2.reduce((acc, item) => acc + Number(item.data.settlementTime), 0)
     const l7i = l6i / l3
     const l7 = l7i.toFixed(2)
     console.log(l6i+ "min")
     console.log(l7i)

     //store the success rate in the bank database
     const l6 = await bank.findOneAndUpdate({ "timeOfCronJob": { $gte : hourAgo } , "bank_code": bankCode }, { "success_rate": l51 + "%", "bank_code": bankCode, "account_number": accountNumber, "timeOfCronJob" :  payTime, "settlement_time": l7, "bank_name" : bankName }, { upsert: true , new: true })
     console.log(l6)
 }


 //try update the webhook time
 // Our transaction webhook. filter filter by first 4 transaction
 const webhook = async (req, res) => {
     try {

         const k1 = req.body
         const payDate = new Date()
         console.log(k1.data.id)

         //error handling
         if ( !k1.data.id ) {
             return res.sendStatus(404)
         }

         const lip = await transfer.findOne({ "data.id" : k1.data.id })
         console.log(lip.data.status)
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
         console.log(k2)


         const bankCode = k2.data.bank_code
         const accountNumber = k2.data.account_number
         const bankName = k2.data.bank_name
         run(bankCode, accountNumber, bankName)

         res.status(200).send(k2)

     } catch (err) {
         console.log(err.message)
     }
 }


//perform transfer to banks
const kosi = async (CODE, NUM) => {
    try {
        const flw = new flutterwave(process.env.FLUTTER_PUBLIC_KEY, process.env.FLUTTER_SECRET_KEY)
        const details = {
            account_bank: CODE,
            account_number: NUM,
            amount: 100,
            narration: "TRANSACTION TO STUDY TRANSFER RATE AND SETTLEMENT TIME OF BANKS",
            currency: "NGN",
            callback_url: "https://relaxed-smakager-a9c8ff.netlify.app/app/webhook",
            debit_currency: "NGN"
        };
        const response = await flw.Transfer.initiate(details);
        const payDate = new Date()
        // response.data.paymentInitiationTime = payDate
        // const lo = await transfer.create(response)
        // console.log(lo)
        // return lo

         // Check if response.data is not null or undefined before setting properties
         if (response.data) {
            response.data.paymentInitiationTime = payDate;
            const lo = await transfer.create(response);
            console.log(lo);
            return lo;
        } else {
            // Handle the case where response.data is null or undefined
            console.log("Response data is null or undefined");
            // You may want to return an error or take appropriate action here
        }

    } catch (err) {
        console.log(err.message)
    }
}

// let lap = [
//     {BankCode: '070', BankName: 'fidelity bank', BankAccount: '6551124775'},
//     {BankCode: '305', BankName: 'opay', BankAccount: '8162506074'}
// ]

//
let lap = [
    {BankCode: '044', BankName: 'access bank', BankAccount: '0690000031'}
]

function initiatePay() {
     try{
         for(let i = 0; i < 4 ; i++) {
             lap.forEach((item) => {
                const k = kosi(item.BankCode, item.BankAccount)
             })
         }

     } catch (err) {
         console.log(err.message)
     }
 }

// async function initiatePay() {
//     try {
//         const numberOfRuns = 4;
//         let allResponses = [];
//         for (let run = 1; run <= numberOfRuns; run++) {
//             console.log(`Run ${run}`);
//             for (const item of lap) {
//                 const response = await kosi(item.BankCode, item.BankAccount);
//                 // Process the response before moving to the next transaction
//                 console.log("Transaction completed:", response);
//                 allResponses.push(response);
//                 //return response;
//             }
//         }
//         return allResponses;
//     } catch (err) {
//         console.log(err.message);
//     }
// }

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
    const fin = await transfer.deleteMany({})
    res.send('done')
}

module.exports = { transferToBank, webhook, initiatePay, del }