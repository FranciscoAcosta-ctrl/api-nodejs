// src/models/userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^\S+@\S+\.\S+$/ },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: Date },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: mongoose.Schema.Types.ObjectId, ref: 'VerificationCode' },
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
