// Example script to add a mentor via API
const addMentor = async () => {
  try {
    const response = await fetch('/api/mentors/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@mentor.com',
        password: 'SecurePassword123!',
        subject: 'Chemistry',
        phone: '+1-555-0123',
        bio: 'Experienced chemistry teacher with 10+ years in education',
        specialization: 'Organic Chemistry, Biochemistry',
        experience: 10,
        status: 'active'
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Mentor created successfully:', data.mentor);
    } else {
      console.error('❌ Failed to create mentor:', data.error);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};

// Call the function
addMentor();
