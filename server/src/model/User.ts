import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { IProfile } from './Profile';
import { IAlbum } from './Album';

const SALT_FACTOR = 10;

export enum UserRole {
    Admin = 'admin',
    Artist = 'artist',
    Listener = 'listener'
}

interface IUser extends Document {
    email: string;
    name?: string;
    address?: string;
    nickname?: string;
    password: string;
    profileId?: mongoose.Types.ObjectId;
    albumIds?: mongoose.Types.ObjectId[];
    role?: UserRole;
    comparePassword: (candidatePassword: string, callback: (error: Error | null, isMatch: boolean) => void) => void;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: false },
    address: { type: String, required: false },
    nickname: { type: String, required: false },
    password: { type: String, required: true },
    profileId: { type: Schema.Types.ObjectId, ref: 'Profile', required: false },
    albumIds: { type: [Schema.Types.ObjectId], ref: 'Album', required: false },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.Listener }
});

// hook
UserSchema.pre<IUser>('save', function(next) {
    const user = this;
    
    // hash password
    bcrypt.genSalt(SALT_FACTOR, (error, salt) => {
        if (error) {
            return next(error);
        }
        bcrypt.hash(user.password, salt, (err, encrypted) => {
            if (err) {
                return next(err);
            }
            user.password = encrypted;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword: string, callback: (error: Error | null, isMatch: boolean) => void): void {
    const user = this;
    bcrypt.compare(candidatePassword, user.password, (error, isMatch) => {
        if (error) {
            callback(error, false);
        }
        callback(null, isMatch);
    });
}

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

/* THIS - JS - runtime binding
// explanation for this:
const test = {
    prop: 1,
    func: () => {
      return test.prop;
    },
};

const test = {
    prop: 1,
    func: function() {
        return this.prop;
    },
};

// Expected output: 1 */