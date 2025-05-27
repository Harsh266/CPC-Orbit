import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  description: {
    type: String,
    trim: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  credits: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  type: {
    type: String,
    required: true,
    enum: ['Theory', 'Practical', 'Theory + Practical'],
    default: 'Theory'
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  program: {
    type: String,
    required: true,
    enum: ['Bachelor', 'Master', 'PhD'],
    default: 'Bachelor'
  },
  isElective: {
    type: Boolean,
    default: false
  },
  prerequisite: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
  },
  syllabus: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique subject code within a department
subjectSchema.index({ code: 1, department: 1 }, { unique: true });

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
