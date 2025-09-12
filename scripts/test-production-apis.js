// Test production APIs for mentor system
const testProductionAPIs = async () => {
  const baseUrl = 'https://knowtasks.vercel.app';
  
  console.log('🧪 Testing production mentor APIs...\n');

  // Test 1: Check mentor authentication API
  console.log('1️⃣ Testing mentor authentication API...');
  try {
    const authResponse = await fetch(`${baseUrl}/api/mentors/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'nitish121@gmail.com',
        password: 'nitish123'
      })
    });

    console.log(`   Status: ${authResponse.status}`);
    
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('   ✅ Authentication API working');
      console.log(`   Mentor: ${authData.mentor?.name}`);
      console.log(`   Students: ${authData.mentor?.students?.length || 0}`);
    } else {
      const errorText = await authResponse.text();
      console.log('   ❌ Authentication API failed');
      console.log(`   Error: ${errorText}`);
    }
  } catch (error) {
    console.log('   ❌ Network error:', error.message);
  }

  // Test 2: Check mentor creation API
  console.log('\n2️⃣ Testing mentor creation API...');
  try {
    const createResponse = await fetch(`${baseUrl}/api/mentors/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Mentor API',
        email: 'test.api@mentor.com',
        password: 'TestPass123!',
        subject: 'Mathematics',
        phone: '+1-555-TEST',
        bio: 'Test mentor for API validation',
        specialization: 'Algebra, Calculus',
        experience: 5,
        status: 'active'
      })
    });

    console.log(`   Status: ${createResponse.status}`);
    
    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log('   ✅ Creation API working');
      console.log(`   Created: ${createData.mentor?.name}`);
    } else {
      const errorText = await createResponse.text();
      console.log('   ❌ Creation API failed');
      console.log(`   Error: ${errorText}`);
    }
  } catch (error) {
    console.log('   ❌ Network error:', error.message);
  }

  // Test 3: Check mentor list API
  console.log('\n3️⃣ Testing mentor list API...');
  try {
    const listResponse = await fetch(`${baseUrl}/api/mentors/list`);
    
    console.log(`   Status: ${listResponse.status}`);
    
    if (listResponse.ok) {
      const listData = await listResponse.json();
      console.log('   ✅ List API working');
      console.log(`   Total mentors: ${listData.mentors?.length || 0}`);
    } else {
      const errorText = await listResponse.text();
      console.log('   ❌ List API failed');
      console.log(`   Error: ${errorText}`);
    }
  } catch (error) {
    console.log('   ❌ Network error:', error.message);
  }

  // Test 4: Check if login page loads
  console.log('\n4️⃣ Testing login page...');
  try {
    const pageResponse = await fetch(`${baseUrl}/mentor/login-new`);
    console.log(`   Status: ${pageResponse.status}`);
    
    if (pageResponse.ok) {
      const pageText = await pageResponse.text();
      if (pageText.includes('Mentor Portal')) {
        console.log('   ✅ Login page loads correctly');
      } else {
        console.log('   ⚠️ Login page loads but content may be missing');
      }
    } else {
      console.log('   ❌ Login page failed to load');
    }
  } catch (error) {
    console.log('   ❌ Network error:', error.message);
  }

  console.log('\n📋 Summary:');
  console.log('• If APIs are working, the mentor system is functional');
  console.log('• If login page loads, frontend deployment is successful');
  console.log('• Check browser console for any JavaScript errors');
  console.log('\n🔗 Test URLs:');
  console.log('• Login: https://knowtasks.vercel.app/mentor/login-new');
  console.log('• Dashboard: https://knowtasks.vercel.app/mentor/dashboard-new');
};

// Run tests
testProductionAPIs().catch(console.error);
