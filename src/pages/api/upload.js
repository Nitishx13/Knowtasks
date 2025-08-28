export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Simple file upload handler
      res.status(200).json({ 
        message: 'File upload endpoint working!',
        method: req.method,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(200).json({ 
      message: 'Upload endpoint working!',
      method: req.method,
      timestamp: new Date().toISOString()
    });
  }
}
