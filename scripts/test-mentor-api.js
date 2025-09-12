const https = require('https');

async function testMentorAPI() {
  console.log('🧪 Testing mentor login API on production...');
  
  const postData = JSON.stringify({
    email: 'nitish121@gmail.com',
    password: 'nitish@121'
  });

  const options = {
    hostname: 'knowtasks.vercel.app',
    port: 443,
    path: '/api/auth/mentor',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Headers:`, res.headers);

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('✅ Response:', response);
          resolve(response);
        } catch (error) {
          console.log('📄 Raw response:', data);
          resolve(data);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Also test with fetch simulation
async function testWithFetch() {
  console.log('\n🌐 Testing with fetch simulation...');
  
  try {
    const response = await fetch('https://knowtasks.vercel.app/api/auth/mentor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'nitish121@gmail.com',
        password: 'nitish@121'
      })
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const data = await response.json();
    console.log('Response:', data);
    
  } catch (error) {
    console.error('❌ Fetch error:', error.message);
  }
}

async function runTests() {
  try {
    await testMentorAPI();
    
    // Test fetch if available
    if (typeof fetch !== 'undefined') {
      await testWithFetch();
    } else {
      console.log('\n⚠️ Fetch not available in Node.js environment');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

runTests();
