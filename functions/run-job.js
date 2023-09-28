const axios = require("axios");

exports.handler = async function (event, context) {
  console.log("Running the scheduled job...");
  try {
    const response = await axios.get('https://transfer.fly.dev/app/transfer')

    console.log('Data:', response.data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Scheduled job completed" }),
    };
  } catch (error) {
    console.error('Error:', error);

    return {
      statusCode: 500, // You can choose an appropriate status code here
      body: JSON.stringify({ message: "Scheduled job failed" }),
    };
  }
};
