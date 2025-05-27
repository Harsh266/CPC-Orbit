import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
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
  program: {
    type: String,
    required: true,
    enum: ['Bachelor', 'Master', 'PhD'],
    default: 'Bachelor'
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  rollNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  dateOfAdmission: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  parentContact: {
    fatherName: String,
    motherName: String,
    parentPhone: String,
    parentEmail: String
  }
}, {
  timestamps: true
});

// Virtual for full name
studentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Compound index to ensure unique roll number within a department
studentSchema.index({ rollNumber: 1, department: 1 }, { unique: true });

// Ensure virtual fields are serialized
studentSchema.set('toJSON', { virtuals: true });

const Student = mongoose.model('Student', studentSchema);

export default Student;
