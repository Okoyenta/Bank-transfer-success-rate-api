const axios = require("axios");

exports.handler = async function (event, context) {
  console.log("Running the scheduled job...");
  try {
    const response = await axios.get('https://transfer-rate.netlify.app/app/transfer');
    // Handle success (status code 2xx)
    console.log('Data:', response.data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Scheduled job completed" }),
    };
  } catch (error) {
    // Handle error (status code 4xx or 5xx)
    console.error('Error:', error);

    return {
      statusCode: 500, // You can choose an appropriate status code here
      body: JSON.stringify({ message: "Scheduled job failed" }),
    };
  }
};
