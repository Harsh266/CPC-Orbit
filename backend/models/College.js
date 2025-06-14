import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  code: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
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

// Update the updatedAt field before saving
collegeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const College = mongoose.model('College', collegeSchema);

export default College;
