import database from '../../../lib/database';
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req, res) {
  try {
    await database.initialize();

    const { userId } = getAuth(req);
    const testUserId = req.headers['x-test-user-id'] || 'test_user_123';
    const effectiveUserId = userId || (process.env.NEXT_PUBLIC_USE_TEST_AUTH === 'true' ? testUserId : null);
    
    if (!effectiveUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    switch (req.method) {
      case 'GET':
        const { id, subject: querySubject } = req.query;
        
        if (id) {
          // Get specific note (ensure user owns it)
          const notes = await database.getUserNotes(effectiveUserId);
          const note = notes.find(n => n.id === parseInt(id));
          if (!note) {
            return res.status(404).json({ error: 'Note not found' });
          }
          return res.status(200).json({ success: true, note });
        }
        
        // Get all user notes with optional subject filter
        const filters = querySubject ? { subject: querySubject } : {};
        const userNotes = await database.getUserNotes(effectiveUserId, filters);
        res.status(200).json({ success: true, notes: userNotes });
        break;

      case 'POST':
        const { title, content, subject, tags } = req.body;
        
        if (!title || !content) {
          return res.status(400).json({
            success: false,
            error: 'Title and content are required'
          });
        }
        
        const newNote = await database.createNote(effectiveUserId, {
          title,
          content,
          subject: subject || '',
          tags: tags || []
        });
        
        res.status(201).json({ success: true, note: newNote });
        break;

      case 'PUT':
        const { id: noteId } = req.query;
        const updates = req.body;
        
        if (!noteId) {
          return res.status(400).json({
            success: false,
            error: 'Note ID is required'
          });
        }
        
        const updatedNote = await database.updateNote(parseInt(noteId), effectiveUserId, updates);
        
        if (!updatedNote) {
          return res.status(404).json({ error: 'Note not found or unauthorized' });
        }
        
        res.status(200).json({ success: true, note: updatedNote });
        break;

      case 'DELETE':
        const { id: deleteId } = req.query;
        
        if (!deleteId) {
          return res.status(400).json({
            success: false,
            error: 'Note ID is required'
          });
        }
        
        const deleted = await database.deleteNote(parseInt(deleteId), effectiveUserId);
        
        if (!deleted) {
          return res.status(404).json({ error: 'Note not found or unauthorized' });
        }
        
        res.status(200).json({
          success: true,
          message: `Note ${deleteId} deleted successfully`
        });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Notes API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}