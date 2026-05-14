const axios = require('axios');

async function testApi() {
  try {
    // We need to login first to get a token
    const loginRes = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@opd.com',
      password: 'admin123'
    });
    
    const token = loginRes.data.data.token;
    console.log('Login successful, token obtained');

    const res = await axios.get('http://localhost:3001/api/patients/search', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('API Response Structure:', JSON.stringify(res.data, null, 2));
  } catch (error) {
    console.error('API Test Failed:', error.response?.data || error.message);
  }
}

testApi();
