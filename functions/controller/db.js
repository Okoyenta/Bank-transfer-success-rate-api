const mongoose = require('mongoose');
require('dotenv').config()

let conn = null;

const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const db_name = process.env.DB_NAME

const uri = `mongodb+srv://${user}:${password}@cluster0.0qxab0k.mongodb.net/${db_name}?retryWrites=true&w=majority`
// serverSelectionTimeoutMS: 5000
const connect = async function() {
  if (conn == null) {
    conn = mongoose.connect(uri, {
      useNewUrlParser: true, useUnifiedTopology: true
    }).then(() => mongoose);

    // `await`ing connection after assigning to the `conn` variable
    // to avoid multiple function calls creating new connections
    await conn;

    // Log a message when the database is connected
    console.log('DB connected');
  }

  return conn;
};

module.exports = connect