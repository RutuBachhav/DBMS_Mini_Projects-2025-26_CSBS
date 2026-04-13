async function replicateError() {
  try {
    // 1. Login
    const loginRes = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'fix@test.com', password: 'Password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    
    if (!token) {
      console.log('Login failed:', loginData);
      return;
    }

    console.log('Logged in. Attempting to add product...');

    // 2. Add Product
    const prodRes = await fetch('http://localhost:5001/api/products', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Debug Product',
        sku: 'DB-001-' + Date.now(),
        description: 'Test',
        quantity: 10,
        price: 9.99,
        category_id: '', // Empty category
        supplier_id: ''  // Empty supplier
      })
    });
    
    const prodData = await prodRes.json();
    console.log('Status:', prodRes.status);
    console.log('Body:', JSON.stringify(prodData, null, 2));

  } catch (err) {
    console.error('Replication Error:', err);
  }
}

replicateError();
