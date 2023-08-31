const bank = require('../model/bank')


const getBank = async (req, res) => {
    try {

        const k1 = await bank.find({}).sort({ "timeOfCronJob": -1 })
        res.json({bank: k1})

    } catch (err) {
        console.log(err.message)
    }
}



module.exports =  getBank 

