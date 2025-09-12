export default async function handler(req, res) {
  console.log('Test SuperAdmin API called with method:', req.method);
  console.log('Request body:', req.body);
  
  if (req.method === 'POST') {
    const { email, password } = req.body;
    
    // Simple test response
    if (email === 'nitishx13@gmail.com' && password === 'nitish@9899') {
      res.status(200).json({
        success: true,
        message: 'Test login successful',
        data: {
          id: 1,
          name: 'Nitish Kumar',
          email: 'nitishx13@gmail.com',
          role: 'superadmin'
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid test credentials' });
    }
  } else {
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
