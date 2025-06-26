import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['text', 'paragraph', 'options', 'checkbox']
  },
  label: {
    type: String,
    required: false
  },
  required: {
    type: Boolean,
    default: false
  },
  options: [{
    type: String
  }]
});

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  fields: [fieldSchema],
  responseCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Form', formSchema);