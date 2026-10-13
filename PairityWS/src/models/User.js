import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
      index: true,
    },
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
      default: null,
      // Optional — display only, never sent to AI
    },
    plan: {
      type: String,
      enum: ['spark', 'bond', 'align'],
      default: 'spark',
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
      // Soft delete — hard purge runs as a scheduled job
    },
  },
  {
    timestamps: true,
    collection: 'users',
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Active users lookup (excludes soft-deleted)
UserSchema.index({ email: 1, deletedAt: 1 });

// Helper: check if user is soft-deleted
UserSchema.methods.isDeleted = function () {
  return this.deletedAt !== null;
};

// Helper: safe public profile (never expose deletedAt internally)
UserSchema.methods.toPublic = function () {
  return {
    _id:        this._id,
    email:      this.email,
    name:       this.name,
    plan:       this.plan,
    timezone:   this.timezone,
    isVerified: this.isVerified,
    createdAt:  this.createdAt,
  };
};

export default model('User', UserSchema);
