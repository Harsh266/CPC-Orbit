import mongoose from 'mongoose';

const programSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  code: { 
    type: String, 
    required: true,
    uppercase: true,
    trim: true 
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure unique program code within a college
programSchema.index({ code: 1, college: 1 }, { unique: true });

// Update the updatedAt field before saving
programSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Program = mongoose.model('Program', programSchema);

export default Program;
