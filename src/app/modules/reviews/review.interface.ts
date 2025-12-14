import { Types } from 'mongoose'

export interface IReview {
    reviewer: Types.ObjectId
    travelPlan: Types.ObjectId
    rating: number
    comment?: string
    createdAt?: Date
    updatedAt?: Date
}
