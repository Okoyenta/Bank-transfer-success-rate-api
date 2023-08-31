const mongoose = require('mongoose')

const transferSchema = new mongoose.Schema({
    status : { type: String },
    message : { type: String },
    data : {
        id : { type: String },
        account_number : { type: String },
        bank_code : { type: String },
        amount : { type: Number },
        fee: { type: Number },
        full_name : { type: String },
        created_at : { type: String },
        reference : { type: String },
        status : { type: String },
        complete_message : { type: String },
        bank_name : { type: String },
        paymentConfirmationTime : { type: Date },
        paymentInitiationTime : { type: Date},
        settlementTime : { type: String }
    }
})

module.exports = mongoose.model("transfer", transferSchema)