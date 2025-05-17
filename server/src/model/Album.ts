import mongoose, { Schema, Document } from 'mongoose';
import { ITrack } from './Track';

export interface IAlbum extends Document {
  name: string;
  description?: string;
  trackIds?: mongoose.Types.ObjectId[];
  releaseDate: Date;
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' };
}

const AlbumSchema = new Schema<IAlbum>({
  name: { type: String, required: true },
  description: { type: String, required: false },
  trackIds: { type: [Schema.Types.ObjectId], ref: 'Track', required: false },
  releaseDate: { type: Date, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model<IAlbum>('Album', AlbumSchema);