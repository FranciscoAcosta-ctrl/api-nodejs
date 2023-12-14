// src/models/verificationCodeModel.js
import mongoose from 'mongoose';

const verificationCodeSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  code: { type: String, required: true },
  expiration: { type: Date, required: true },
});

const VerificationCodeModel = mongoose.model('VerificationCode', verificationCodeSchema);

export default VerificationCodeModel;
