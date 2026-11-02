import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const passwordResetOTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    hashedOTP: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: '5m' }, // TTL index auto-deletes document after expiry
    },
    attempts: {
      type: Number,
      default: 0,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

passwordResetOTPSchema.methods.verifyOTP = async function (enteredOtp) {
  return await bcrypt.compare(enteredOtp, this.hashedOTP);
};

const PasswordResetOTP =
  mongoose.models.PasswordResetOTP ||
  mongoose.model('PasswordResetOTP', passwordResetOTPSchema);

export default PasswordResetOTP;
