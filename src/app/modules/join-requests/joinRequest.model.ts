import mongoose, { model } from 'mongoose'
import { IJoinRequest } from './joinRequest.interface'

const joinRequestSchema = new mongoose.Schema<IJoinRequest>(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        travelPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'TravelPlan', required: true },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
            required: true,
        },
    },
    { timestamps: true, versionKey: false }
)

// One request per user per travel plan
joinRequestSchema.index({ user: 1, travelPlan: 1 }, { unique: true })
joinRequestSchema.index({ travelPlan: 1, status: 1 })

export const JoinRequest = model<IJoinRequest>('JoinRequest', joinRequestSchema)
