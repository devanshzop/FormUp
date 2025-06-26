import express from 'express';
import Form from '../models/Form.js';

const router = express.Router();

// GET /api/forms - Get all forms

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const [forms, total] = await Promise.all([
      Form.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('title description createdAt responseCount'),
      Form.countDocuments()
    ]);

    res.json({
      forms,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page < Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch forms' });
  }
});

// GET /api/forms/:id - Get a specific form
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch form' });
  }
});

// POST /api/forms - Create a new form
router.post('/', async (req, res) => {
  try {
    const { title, description, fields } = req.body;
    
    if (!title || !fields || fields.length === 0) {
      return res.status(400).json({ error: 'Title and fields are required' });
    }

    const form = new Form({
      title,
      description,
      fields
    });

    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create form' });
  }
});

// DELETE /api/forms/:id - Delete a form
router.delete('/:id', async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete form' });
  }
});

export default router;