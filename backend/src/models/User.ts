import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        name: String,
        password: String,
        googleId: String,
        picture: String,
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        authProviders: {
            type: [String],
            enum: ['local', 'google'],
            default: []
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User', UserSchema);

export default User