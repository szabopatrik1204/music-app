import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  like: string[]; // nickname tömb
  comment: Array<{ nickname: string; text: string; createdAt: Date }>;
  shared: string[]; // nickname tömb
  owner: mongoose.Types.ObjectId;
}

const ReviewSchema = new Schema<IReview>({
  like: { type: [String], required: false, default: [] },
  comment: [{
    nickname: { type: String, required: false },
    text: { type: String, required: false },
    createdAt: { type: Date, default: Date.now }
  }],
  shared: { type: [String], required: false, default: [] },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Track', required: true }
});

export default mongoose.model<IReview>('Review', ReviewSchema);