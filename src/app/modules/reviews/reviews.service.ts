import httpStatus from 'http-status-codes'
import mongoose from 'mongoose'
import AppError from '../../errorHelper/AppError'
import { Review } from './review.model'
import { TravelPlan } from '../travel-plans/travelPlans.model'
import { User } from '../user/user.model'

const createReview = async (travelPlanId: string, userId: string, payload: { rating: number; comment?: string }) => {
    const plan = await TravelPlan.findById(travelPlanId)
    if (!plan) throw new AppError(httpStatus.NOT_FOUND, 'Travel plan not found')

    // host cannot review own plan
    if (plan.host?.toString() === userId) throw new AppError(httpStatus.BAD_REQUEST, 'Host cannot review their own plan')

    // user must have joined
    const joined = plan.participants?.some((p: any) => p.toString() === userId)
    if (!joined) throw new AppError(httpStatus.FORBIDDEN, 'User must join the travel plan before reviewing')

    // must be after end date
    const now = new Date()
    if (plan.endDate && now < plan.endDate) throw new AppError(httpStatus.BAD_REQUEST, 'Cannot review before trip end date')

    const review = await Review.create({ host: userId, travelPlan: travelPlanId, rating: payload.rating, comment: payload.comment })

    // recompute host ratings (the host of the travel plan is plan.host)
    await recomputeHostRating(plan.host?.toString())

    return review
}

const getReviewsByPlan = async (travelPlanId: string, page = 1, limit = 20) => {
    const skip = (page - 1) * limit

    const filter = { travelPlan: travelPlanId }
    const total = await Review.countDocuments(filter)
    const data = await Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('host', 'fullName profileImage')
    const pages = Math.ceil(total / limit)
    return { meta: { total, page, limit, pages }, data }
}

const updateReview = async (reviewId: string, userId: string, payload: { rating?: number; comment?: string }) => {
    const review = await Review.findById(reviewId)
    if (!review) throw new AppError(httpStatus.NOT_FOUND, 'Review not found')
    if (review.host?.toString() !== userId) throw new AppError(httpStatus.FORBIDDEN, 'Not allowed to update this review')

    const updated = await Review.findByIdAndUpdate(reviewId, payload, { new: true, runValidators: true })

    // recompute host rating for the travel plan owner
    const plan = await TravelPlan.findById(updated?.travelPlan)
    if (plan) await recomputeHostRating(plan.host?.toString())

    return updated
}

const deleteReview = async (reviewId: string, userId: string) => {
    const review = await Review.findById(reviewId)
    if (!review) throw new AppError(httpStatus.NOT_FOUND, 'Review not found')
    if (review.host?.toString() !== userId) throw new AppError(httpStatus.FORBIDDEN, 'Not allowed to delete this review')

    const deleted = await Review.findByIdAndDelete(reviewId)

    // recompute host rating for the travel plan owner
    const plan = await TravelPlan.findById(deleted?.travelPlan)
    if (plan) await recomputeHostRating(plan.host?.toString())

    return deleted
}

async function recomputeHostRating(hostId?: string) {
    if (!hostId) return

    // aggregate reviews for travel plans where plan.host == hostId
    const agg = await Review.aggregate([
        {
            $lookup: {
                from: 'travelplans',
                localField: 'travelPlan',
                foreignField: '_id',
                as: 'plan',
            },
        },
        { $unwind: '$plan' },
        { $match: { 'plan.host': new mongoose.Types.ObjectId(hostId) } },
        { $group: { _id: '$plan.host', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ])

    const stats = agg[0]
    if (stats) {
        await User.findByIdAndUpdate(hostId, { averageRating: stats.avg, ratingCount: stats.count })
    } else {
        await User.findByIdAndUpdate(hostId, { averageRating: 0, ratingCount: 0 })
    }
}

export const ReviewsService = {
    createReview,
    getReviewsByPlan,
    updateReview,
    deleteReview,
}
