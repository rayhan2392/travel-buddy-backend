import mongoose, { model } from 'mongoose'
import { ITravelPlan } from './travelPlans.interface'

const travelPlanSchema = new mongoose.Schema<ITravelPlan>(
    {
        host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

        destination: {
            country: { type: String, required: true },
            city: { type: String },
        },

        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },

        budgetRange: {
            min: { type: Number, required: true },
            max: { type: Number, required: true },
        },

        travelType: { type: String, enum: ['Solo', 'Family', 'Friends'], required: true },

        description: { type: String },

        categories: [{ type: String }],

        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true, versionKey: false }
)

export const TravelPlan = model<ITravelPlan>('TravelPlan', travelPlanSchema)
