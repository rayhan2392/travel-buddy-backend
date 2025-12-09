import mongoose, { model } from "mongoose";
import { IUser } from "./user.interface";

const userSchema = new mongoose.Schema<IUser>(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        profileImage: { type: String },
        photo_name: { type: String },
        bio: { type: String },
        interests: [{ type: String }], // ["hiking", "food tours"]
        visitedCountries: [{ type: String }],

        currentLocation: { type: String },

        // Rating Summary
        averageRating: { type: Number, default: 0 },
        ratingCount: { type: Number, default: 0 },

        isVerified: { type: Boolean, default: false }, // after subscription
    },
    { timestamps: true,versionKey:false }
);

export const User = model<IUser>("User", userSchema)
