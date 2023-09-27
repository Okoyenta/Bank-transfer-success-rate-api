const axios = require("axios");


exports.handler = async function (event, context) {
    console.log("Running the scheduled job...");
  
    // Add your job logic here
    // For example, if you want to execute the initiatePay() function:
    axios.get('https://transfer-rate.netlify.app/app/transfer')
  .then(function (response) {
    // Handle success (status code 2xx)
    console.log('Data:', response.data);
  })
  .catch(function (error) {
    // Handle error (status code 4xx or 5xx)
    console.error('Error:', error);
  });
  
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Scheduled job completed" }),
    };
  };