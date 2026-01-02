import { Types } from 'mongoose'

export interface IJoinRequest {
    user: Types.ObjectId
    travelPlan: Types.ObjectId
    status: 'pending' | 'accepted' | 'rejected'
    createdAt?: Date
    updatedAt?: Date
}
