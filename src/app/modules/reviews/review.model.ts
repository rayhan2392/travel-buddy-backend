import mongoose, { model } from 'mongoose'
import { IReview } from './review.interface'

const reviewSchema = new mongoose.Schema<IReview>(
    {
        host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        travelPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'TravelPlan', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String },
    },
    { timestamps: true, versionKey: false }
)

// One review per user per plan
reviewSchema.index({ host: 1, travelPlan: 1 }, { unique: true })
reviewSchema.index({ travelPlan: 1 })

export const Review = model<IReview>('Review', reviewSchema)
