const mongoose = require('mongoose');

const connectToDB = async () => {
  try {

       mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0qxab0k.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
       { useNewUrlParser: true, useUnifiedTopology: true })
       
       const db = mongoose.connection;
          db.on('error', console.error.bind(console, 'connection error:'));
          db.once('open', function() {
          console.log('connected to db')
          });
  } catch (error) {
    console.log(error);
    console.log("mongoose Error");
  }
}

module.exports = connectToDB;