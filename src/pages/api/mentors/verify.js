import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  // Only allow PUT method
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to the database
    const { db } = await connectToDatabase();
    
    // Get the mentor ID and verification status from the request body
    const { mentorId, verified } = req.body;
    
    // Validate required fields
    if (!mentorId) {
      return res.status(400).json({ error: 'Mentor ID is required' });
    }
    
    if (typeof verified !== 'boolean') {
      return res.status(400).json({ error: 'Verified status must be a boolean' });
    }
    
    // Check if the user is a superadmin (you'll need to implement your own auth check here)
    // This is a placeholder for your actual authentication logic
    const isAuthorized = await checkIfUserIsSuperAdmin(req);
    if (!isAuthorized) {
      return res.status(403).json({ error: 'Unauthorized. Only superadmins can verify mentors' });
    }
    
    // Update the mentor's verification status
    const result = await db.collection('mentors').updateOne(
      { _id: new ObjectId(mentorId) },
      { 
        $set: { 
          verified: verified,
          status: verified ? 'active' : 'pending',
          updatedAt: new Date() 
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Mentor not found' });
    }
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: `Mentor ${verified ? 'verified' : 'unverified'} successfully`,
    });
  } catch (error) {
    console.error('Error verifying mentor:', error);
    return res.status(500).json({ error: 'Failed to update mentor verification status' });
  }
}

// Placeholder function for checking if the user is a superadmin
// Replace this with your actual authentication logic
async function checkIfUserIsSuperAdmin(req) {
  // Get the session or token from the request
  // Check if the user has superadmin role
  // Return true if they are a superadmin, false otherwise
  
  // For now, we'll just return true for testing purposes
  // In a real application, you would implement proper authentication
  return true;
}