const https = require('https');

async function testAuthMentorAPI() {
  console.log('🔍 Testing /api/auth/mentor endpoint...');
  
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
      console.log(`Status Text: ${res.statusMessage}`);
      console.log(`Headers:`, JSON.stringify(res.headers, null, 2));

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`Raw Response Length: ${data.length}`);
        console.log(`Raw Response: "${data}"`);
        
        if (data.trim() === '') {
          console.log('❌ Empty response');
        } else {
          try {
            const parsed = JSON.parse(data);
            console.log('✅ Parsed JSON:', JSON.stringify(parsed, null, 2));
          } catch (error) {
            console.log('❌ JSON parse error:', error.message);
            console.log('Raw data:', data);
          }
        }
        resolve(data);
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

testAuthMentorAPI().catch(console.error);
