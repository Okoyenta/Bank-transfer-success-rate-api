const bank = require('../model/bank')


const getBank = async (req, res) => {
    try {

        //find the most recent bank data from database of each bank
        //sort by date and return the first
        //we have 2 different bank data
        //return the most recent for each bank
        const bank1 = await bank.find({}).sort({ "timeOfCronJob": -1 })

        //use filter method on bank by bank code and return the most recent
        //filter most recent by timeOfCronJob
        function run(code){
            const l1 = bank1.filter((item) => item.bank_code === code )
            const l3 = l1.sort((a, b) => b.timeOfCronJob - a.timeOfCronJob)[0]
            return l3
        }

        //bank codes 
        const code = ["044", "070", "305"]
        const l2 = code.map(x => run(x))

        res.json(l2)

    } catch (err) {
        console.log(err.message)
    }
}



module.exports =  getBank 

