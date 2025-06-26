import express from 'express';
import Response from '../models/Response.js';
import Form from '../models/Form.js';

const router = express.Router();

// GET /api/responses/:formId - Get all responses for a form
router.get('/:formId', async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.formId })
      .sort({ submittedAt: -1 });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

// POST /api/responses/:formId - Submit a response to a form
router.post('/:formId', async (req, res) => {
  try {
    const { formId } = req.params;
    const { responses } = req.body;

    // Verify form exists
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Validate required fields
    const requiredFields = form.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !responses[field._id]);
    
    // if (missingFields.length > 0) {
    //   return res.status(400).json({ 
    //     error: 'Missing required fields',
    //     missingFields: missingFields.map(f => f.label)
    //   });
    // }

    // Create response
    const response = new Response({
      formId,
      responses
    });

    await response.save();

    // Increment response count
    await Form.findByIdAndUpdate(formId, { 
      $inc: { responseCount: 1 } 
    });

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit response' });
  }
});

export default router;