import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  like?: string[];
  comment?: string[];
  shared?: string[];
  owner?: mongoose.Types.ObjectId;
}

const ReviewSchema = new Schema<IReview>({
  like: { type: [String], required: false },
  comment: { type: [String], required: false },
  shared: { type: [String], required: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Track', required: false }
});

export default mongoose.model<IReview>('Review', ReviewSchema);