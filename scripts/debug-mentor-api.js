const https = require('https');

async function debugMentorAPI() {
  console.log('🔍 Debugging mentor API response...');
  
  const postData = JSON.stringify({
    email: 'nitish121@gmail.com',
    password: 'nitish@121'
  });

  const options = {
    hostname: 'knowtasks.vercel.app',
    port: 443,
    path: '/api/mentor/login',
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
          console.log('❌ Empty response - this causes JSON parse error');
        } else {
          try {
            const parsed = JSON.parse(data);
            console.log('✅ Valid JSON:', parsed);
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

debugMentorAPI().catch(console.error);
