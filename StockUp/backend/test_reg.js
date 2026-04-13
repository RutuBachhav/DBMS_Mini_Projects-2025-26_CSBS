const axios = require('axios');

async function testRegister() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'admin'
    });
    console.log('Registration Success:', res.data);
  } catch (err) {
    if (err.response) {
      console.log('Registration Failed (Response):', err.response.status, err.response.data);
    } else {
      console.log('Registration Failed (Error):', err.message);
    }
  }
}

testRegister();
