const jwt = require('jsonwebtoken');
const axios = require('axios');

async function main() {
  const secret = 'super-secret-key-123-medflow-enterprise-key-32';
  const caseId = '3cc89870-3df5-4e5b-9611-5efaf82a3391';
  const doctorId = '86dc100e-a67a-45dc-8325-d91717cf5af5';
  const branchId = '484cf7fd-fe57-471b-b8d0-1b492887e735';

  const payload = {
    email: 'doctor@clinic.com',
    sub: doctorId,
    role: 'DOCTOR',
    primaryBranchId: branchId,
    branchAccess: [branchId],
    permissions: [],
  };

  const token = jwt.sign(payload, secret);
  console.log('Generated JWT:', token);

  const url = `http://localhost:3001/api/consultation/${caseId}`;
  console.log('Sending GET request to:', url);

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-branch-id': branchId,
      },
    });
    console.log('SUCCESS Response status:', response.status);
    console.log('SUCCESS Response data:', JSON.stringify(response.data, null, 2));
  } catch (err) {
    console.log('ERROR RESPONSE DETECTED:');
    if (err.response) {
      console.log('Status Code:', err.response.status);
      console.log('Data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err);
    }
  }
}

main();
