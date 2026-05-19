const axios = require('axios');

async function main() {
  try {
    console.log('Logging in as admin...');
    const loginRes = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@clinic.com',
      password: '123456',
    });
    
    const token = loginRes.data.data.token || loginRes.data.data.access_token || loginRes.data.data.accessToken;
    if (!token) {
      console.error('No token found in response:', loginRes.data);
      return;
    }
    console.log('Login successful! Token:', token.substring(0, 20) + '...');

    console.log('Making request to admin/api-usage/analytics...');
    try {
      const res = await axios.get('http://localhost:3001/api/admin/api-usage/analytics', {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-tenant-id': 'DEFAULT-CLINIC', // default tenant ID
        },
      });
      console.log('Request successful! Response Status:', res.status);
      console.log('Response Data:', JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.error('Request Failed with status:', err.response?.status);
      console.error('Response Data:', err.response?.data);
    }
  } catch (err) {
    console.error('Login Failed:', err.message, err.response?.data);
  }
}

main();
