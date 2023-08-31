const mongoose = require('mongoose')

const bankSchema = new mongoose.Schema({
    timeOfCronJob : { type: Date },
    bank_name : { type: String, required: true },
    bank_code : { type: String, required: true },
    account_number : { type: String, required: true },
    success_rate : { type: String },
    settlement_time : { type: String }
})

module.exports = mongoose.model('bank', bankSchema)
