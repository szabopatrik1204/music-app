import mongoose, { Schema, Document } from 'mongoose';

export interface ITrack extends Document {
  title: string;
  artistNickname: string;
  albumName?: string;
  fileId: mongoose.Types.ObjectId;
  releaseDate: Date;
  isApproved: boolean;
}

const TrackSchema = new Schema<ITrack>({
  title: { type: String, required: true },
  artistNickname: { type: String, required: true },
  albumName: { type: String, required: false },
  fileId: { type: Schema.Types.ObjectId, required: true }, // GridFS file id
  releaseDate: { type: Date, required: true },
  isApproved: { type: Boolean, default: false }
});

export default mongoose.model<ITrack>('Track', TrackSchema);