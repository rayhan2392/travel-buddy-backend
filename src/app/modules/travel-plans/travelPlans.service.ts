import httpStatus from 'http-status-codes'
import AppError from '../../errorHelper/AppError'
import { ITravelPlan } from './travelPlans.interface'
import { TravelPlan } from './travelPlans.model'


const createTravelPlan = async (payload: Partial<ITravelPlan>) => {
    if (!payload.host) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Host is required')
    }

    const travelPlan = await TravelPlan.create(payload)
    return travelPlan
}

const getAllTravelPlans = async () => {
    const plans = await TravelPlan.find().populate('host', 'fullName email profileImage')
    return plans
}

const getSingleTravelPlan = async (id: string) => {
    const plan = await TravelPlan.findById(id).populate('host', 'fullName email profileImage')
    if (!plan) {
        throw new AppError(httpStatus.NOT_FOUND, 'Travel plan not found')
    }
    return plan
}

const getUserTravelPlans = async (userId: string) => {
    const plans = await TravelPlan.find({ host: userId }).populate(
        'host',
        'fullName email profileImage'
    )
    return plans
}

const updateTravelPlan = async (id: string, payload: Partial<ITravelPlan>) => {
    const plan = await TravelPlan.findById(id)
    if (!plan) {
        throw new AppError(httpStatus.NOT_FOUND, 'Travel plan not found')
    }

    const updated = await TravelPlan.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    }).populate('host', 'fullName email profileImage')

    return updated
}

const deleteTravelPlan = async (id: string) => {
    const plan = await TravelPlan.findById(id)
    if (!plan) {
        throw new AppError(httpStatus.NOT_FOUND, 'Travel plan not found')
    }

    const deleted = await TravelPlan.findByIdAndDelete(id).populate('host', 'fullName email profileImage')
    return deleted
}

const joinTravelPlan = async (id: string, userId: string) => {
    const plan = await TravelPlan.findById(id)
    if (!plan) {
        throw new AppError(httpStatus.NOT_FOUND, 'Travel plan not found')
    }

    // host cannot join their own travel plan
    if (plan.host?.toString() === userId) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Host cannot join their own travel plan')
    }

    // prevent duplicate joins
    const alreadyJoined = plan.participants?.some((p: any) => p.toString() === userId)
    if (alreadyJoined) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User already joined this travel plan')
    }

    const updated = await TravelPlan.findByIdAndUpdate(
        id,
        { $addToSet: { participants: userId } },
        { new: true }
    ).populate('host', 'fullName email profileImage')

    return updated
}

const leaveTravelPlan = async (id: string, userId: string) => {
    const plan = await TravelPlan.findById(id)
    if (!plan) {
        throw new AppError(httpStatus.NOT_FOUND, 'Travel plan not found')
    }

    // host cannot leave their own travel plan
    if (plan.host?.toString() === userId) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Host cannot leave their own travel plan')
    }

    const isParticipant = plan.participants?.some((p: any) => p.toString() === userId)
    if (!isParticipant) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User is not a participant of this travel plan')
    }

    const updated = await TravelPlan.findByIdAndUpdate(
        id,
        { $pull: { participants: userId } },
        { new: true }
    ).populate('host', 'fullName email profileImage')

    return updated
}

export const TravelPlansService = {
    createTravelPlan,
    getAllTravelPlans,
    getSingleTravelPlan,
    getUserTravelPlans,
    updateTravelPlan,
    deleteTravelPlan,
    joinTravelPlan,
    leaveTravelPlan,
    matchTravelPlans,
}

async function matchTravelPlans(params: {
    q?: string
    startDate?: string
    endDate?: string
    interest?: string
    page?: number
    limit?: number
}) {
    const { q, startDate, endDate, interest } = params
    const page = params.page && params.page > 0 ? params.page : 1
    const limit = params.limit && params.limit > 0 ? params.limit : 20
    const skip = (page - 1) * limit

    const filter: any = {}

    if (q) {
        const regex = new RegExp(q, 'i')
        filter.$or = [
            { 'destination.country': { $regex: regex } },
            { 'destination.city': { $regex: regex } },
        ]
    }

    if (startDate && endDate) {
        const s = new Date(startDate)
        const e = new Date(endDate)
        // overlap: plan.startDate <= endDate AND plan.endDate >= startDate
        filter.startDate = { $lte: e }
        filter.endDate = { $gte: s }
    }

    if (interest) {
        const escaped = interest.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        filter.categories = { $in: [new RegExp(`^${escaped}$`, 'i')] }
    }

    const total = await TravelPlan.countDocuments(filter)
    const data = await TravelPlan.find(filter)
        .sort({ startDate: 1 })
        .skip(skip)
        .limit(limit)
        .populate('host', 'fullName email profileImage')

    const pages = Math.ceil(total / limit)

    return {
        meta: { total, page, limit, pages },
        data,
    }
}
