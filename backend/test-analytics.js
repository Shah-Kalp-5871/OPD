const axios = require('axios');

async function main() {
  try {
    console.log('Logging in as admin...');
    const loginRes = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@clinic.com',
      password: '123456',
    });
    
    const token = loginRes.data.data.access_token;
    console.log('Login successful! Token prefix:', token ? token.substring(0, 20) : 'none');
    console.log('Response data structure:', JSON.stringify(loginRes.data, null, 2));

    const bearerToken = token;

    console.log('Making request to analytics dashboard stats...');
    try {
      const statsRes = await axios.get('http://localhost:3001/api/analytics/dashboard/stats', {
        headers: {
          Authorization: `Bearer ${bearerToken || token}`,
        },
      });
      console.log('Stats Response:', statsRes.data);
    } catch (err) {
      console.error('Stats Request Failed with status:', err.response?.status);
      console.error('Stats Response Data:', err.response?.data);
    }
  } catch (err) {
    console.error('Login Failed:', err.message, err.response?.data);
  }
}

main();
