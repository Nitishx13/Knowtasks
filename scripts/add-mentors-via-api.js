// Script to add initial mentors via API endpoint (works without direct DB connection)
const fetch = require('node-fetch');

async function addMentorsViaAPI() {
  const mentors = [
    {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@knowtasks.com',
      password: 'physics123',
      subject: 'Physics',
      status: 'active'
    },
    {
      name: 'Prof. Michael Chen',
      email: 'michael.chen@knowtasks.com',
      password: 'math456',
      subject: 'Mathematics',
      status: 'active'
    },
    {
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@knowtasks.com',
      password: 'chem789',
      subject: 'Chemistry',
      status: 'pending'
    }
  ];

  console.log('Adding mentors via API...');

  for (const mentor of mentors) {
    try {
      const response = await fetch('http://localhost:3000/api/auth/mentor', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mentor)
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✓ Added mentor: ${mentor.name} (${mentor.email})`);
      } else {
        const error = await response.json();
        console.log(`✗ Failed to add ${mentor.name}: ${error.error}`);
      }
    } catch (error) {
      console.log(`✗ Network error adding ${mentor.name}: ${error.message}`);
    }
  }

  console.log('\nDone! Try logging in with any of these credentials:');
  mentors.forEach(mentor => {
    console.log(`- Email: ${mentor.email}, Password: ${mentor.password}`);
  });
}

addMentorsViaAPI();
