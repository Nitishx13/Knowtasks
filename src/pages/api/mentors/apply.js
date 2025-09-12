import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to the database
    const { db } = await connectToDatabase();
    
    // Get the form data from the request body
    const {
      name,
      email,
      phone,
      subject,
      specialization,
      experience,
      bio,
      status
    } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !subject || !experience || !bio) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if the email already exists in the mentor applications
    const existingMentor = await db.collection('mentors').findOne({ email });
    if (existingMentor) {
      return res.status(400).json({ error: 'A mentor with this email already exists' });
    }
    
    // Create a new mentor application document
    const mentorApplication = {
      name,
      email,
      phone,
      subject,
      specialization: specialization || '',
      experience,
      bio,
      status: 'pending', // Always set status to pending for new applications
      createdAt: new Date(),
      updatedAt: new Date(),
      verified: false, // Default to not verified
    };
    
    // Insert the mentor application into the database
    const result = await db.collection('mentors').insertOne(mentorApplication);
    
    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Mentor application submitted successfully',
      mentorId: result.insertedId,
    });
  } catch (error) {
    console.error('Error submitting mentor application:', error);
    return res.status(500).json({ error: 'Failed to submit mentor application' });
  }
}