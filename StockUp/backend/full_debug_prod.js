async function replicateAndDebug() {
  const EMAIL = `debug_${Date.now()}@test.com`;
  const PASSWORD = 'Password123';

  try {
    // 1. Register User
    console.log('Registering User...');
    const regRes = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Debug', email: EMAIL, password: PASSWORD, role: 'admin' })
    });
    console.log('Register Status:', regRes.status);
    
    // 2. Login
    console.log('Logging in...');
    const loginRes = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    
    // 3. Add Product with typical data
    console.log('Adding Product...');
    const prodRes = await fetch('http://localhost:5001/api/products', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Debug Product',
        sku: 'SKU-' + Math.random(),
        description: 'Testing',
        quantity: 10,
        price: 99.99,
        category_id: '',
        supplier_id: ''
      })
    });
    
    const prodData = await prodRes.json();
    console.log('Product Status:', prodRes.status);
    console.log('Product Response:', JSON.stringify(prodData, null, 2));

  } catch (err) {
    console.error('Test Failed:', err);
  }
}

replicateAndDebug();
