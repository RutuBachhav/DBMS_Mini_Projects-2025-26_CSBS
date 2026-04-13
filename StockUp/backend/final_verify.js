const axios = require('axios');

async function testFullFlow() {
  const EMAIL = `test_${Date.now()}@example.com`;
  const PASSWORD = 'password123';
  
  try {
    console.log(`--- Testing Registration: ${EMAIL} ---`);
    const regRes = await axios.post('http://localhost:5001/api/auth/register', {
      name: 'Test Auth User',
      email: EMAIL,
      password: PASSWORD,
      role: 'admin'
    });
    console.log('Registration Status:', regRes.status, regRes.data.message);

    console.log('--- Testing Login ---');
    const loginRes = await axios.post('http://localhost:5001/api/auth/login', {
      email: EMAIL,
      password: PASSWORD
    });
    console.log('Login Status:', loginRes.status);
    console.log('Token Received:', loginRes.data.token ? 'YES' : 'NO');
    console.log('User ID:', loginRes.data.user.id);
    
    console.log('--- TEST PASSED ---');
    process.exit(0);
  } catch (err) {
    if (err.response) {
      console.log('Test Failed (Response):', err.response.status, err.response.data);
    } else {
      console.log('Test Failed (Error):', err.message);
    }
    process.exit(1);
  }
}

testFullFlow();
