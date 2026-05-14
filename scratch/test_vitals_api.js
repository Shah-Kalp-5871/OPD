const axios = require('axios');

async function test() {
  try {
    const response = await axios.get('http://localhost:3001/patients/29a58566-d884-4904-b901-aff758aee9bf');
    console.log('Patient Vitals:', JSON.stringify(response.data.vitals, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
