import mongoose, { Schema, Document } from 'mongoose';
import { IProfile } from './Profile';
import { IReview } from './Review';

export interface ITrack extends Document {
  title: string;
  artistNickname: string;
  albumName?: string;
  fileId: mongoose.Types.ObjectId;
  releaseDate: Date;
  profileId?: mongoose.Types.ObjectId;
  reviewId?: mongoose.Types.ObjectId;
  isApproved: boolean;
  owner?: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' };
}

const TrackSchema = new Schema<ITrack>({
  title: { type: String, required: true },
  artistNickname: { type: String, required: true },
  albumName: { type: String, required: false },
  fileId: { type: Schema.Types.ObjectId, required: true },
  profileId: { type: Schema.Types.ObjectId, ref: 'Profile', required: false },
  reviewId: { type: Schema.Types.ObjectId, ref: 'Review', required: false },
  releaseDate: { type: Date, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'Album', required: false },
  isApproved: { type: Boolean, default: false }
});

export default mongoose.model<ITrack>('Track', TrackSchema);