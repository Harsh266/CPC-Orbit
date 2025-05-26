import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    sparse: true // allow null for legacy users
  },
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    required: [true, 'Role is required']
  },
  studentDetails: {
    phone: String,
    college: String,
    program: String,
    branch: String,
    semester: String
  },
  facultyDetails: {
    phone: String,
    isCoordinator: {
      type: Boolean,
      default: false
    }
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
