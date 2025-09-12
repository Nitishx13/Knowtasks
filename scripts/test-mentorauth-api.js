const https = require('https');

async function testMentorAuthAPI() {
  console.log('🔍 Testing /api/mentorauth endpoint...');
  
  const postData = JSON.stringify({
    email: 'nitish121@gmail.com',
    password: 'nitish@121'
  });

  const options = {
    hostname: 'knowtasks.vercel.app',
    port: 443,
    path: '/api/mentorauth',
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
        console.log(`Response: "${data}"`);
        
        if (data.trim() === '') {
          console.log('❌ Empty response - JSON parse will fail');
        } else {
          try {
            const parsed = JSON.parse(data);
            console.log('✅ Valid JSON response:', JSON.stringify(parsed, null, 2));
            
            if (parsed.success) {
              console.log('🎉 Login would succeed!');
            } else {
              console.log('❌ Login would fail:', parsed.message);
            }
          } catch (error) {
            console.log('❌ Invalid JSON:', error.message);
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

testMentorAuthAPI().catch(console.error);
