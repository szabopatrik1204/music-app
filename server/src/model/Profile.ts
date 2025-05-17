import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  birthDate: Date;
  hobby?: string;
  genre?: string;
  location?: string;
  owner?: { type: mongoose.Schema.Types.ObjectId, ref: 'User' };
}

const ProfileSchema = new Schema<IProfile>({
  birthDate: { type: Date, required: true },
  hobby: { type: String, required: false },
  genre: { type: String, required: false },
  location: { type: String, required: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
});

export default mongoose.model<IProfile>('Profile', ProfileSchema);