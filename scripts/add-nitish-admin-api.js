const fetch = require('node-fetch');

async function addNitishAdmin() {
  try {
    console.log('Adding Nitish as SuperAdmin user via API...');
    
    const response = await fetch('http://localhost:3000/api/auth/superadmin', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Nitish Kumar',
        email: 'nitishx13@gmail.com',
        password: 'nitish@9899',
        status: 'active'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Nitish SuperAdmin created successfully!');
      console.log('Login credentials:');
      console.log('Email: nitishx13@gmail.com');
      console.log('Password: nitish@9899');
      console.log('Response:', data);
    } else {
      const error = await response.json();
      console.error('Error creating SuperAdmin:', error);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    console.log('\nAlternatively, you can create the user manually by:');
    console.log('1. Starting the development server: npm run dev');
    console.log('2. Making a PUT request to /api/auth/superadmin with the user data');
  }
}

addNitishAdmin();
