const https = require('https');

async function testAuthLoginAPI() {
  console.log('🧪 Testing /api/auth/login with mentor credentials...');
  
  const postData = JSON.stringify({
    email: 'nitish121@gmail.com',
    password: 'nitish@121'
  });

  const options = {
    hostname: 'knowtasks.vercel.app',
    port: 443,
    path: '/api/auth/login',
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

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`Response Length: ${data.length}`);
        
        if (data.trim() === '') {
          console.log('❌ Empty response');
        } else {
          console.log(`Response: ${data}`);
          try {
            const parsed = JSON.parse(data);
            console.log('✅ Parsed JSON:', JSON.stringify(parsed, null, 2));
            
            if (parsed.success) {
              console.log('🎉 Mentor login would succeed!');
              console.log('👤 User data:', parsed.user);
            } else {
              console.log('❌ Login would fail:', parsed.message || parsed.error);
            }
          } catch (error) {
            console.log('❌ JSON parse error:', error.message);
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

testAuthLoginAPI().catch(console.error);
