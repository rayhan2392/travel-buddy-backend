import { Types } from 'mongoose'

export interface IReview {
    host: Types.ObjectId
    travelPlan: Types.ObjectId
    rating: number
    comment?: string
    createdAt?: Date
    updatedAt?: Date
}
