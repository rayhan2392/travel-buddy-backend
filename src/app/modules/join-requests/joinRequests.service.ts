import httpStatus from 'http-status-codes'
import AppError from '../../errorHelper/AppError'
import { JoinRequest } from './joinRequest.model'
import { TravelPlan } from '../travel-plans/travelPlans.model'

const createJoinRequest = async (travelPlanId: string, userId: string) => {
    const plan = await TravelPlan.findById(travelPlanId)
    if (!plan) {
        throw new AppError(httpStatus.NOT_FOUND, 'Travel plan not found')
    }

    // Host cannot request to join their own travel plan
    if (plan.host?.toString() === userId) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Host cannot request to join their own travel plan')
    }

    // Check if user is already a participant
    const alreadyJoined = plan.participants?.some((p: any) => p.toString() === userId)
    if (alreadyJoined) {
        throw new AppError(httpStatus.BAD_REQUEST, 'You are already a participant of this travel plan')
    }

    // Check if user already has a pending or accepted request
    const existingRequest = await JoinRequest.findOne({
        user: userId,
        travelPlan: travelPlanId,
        status: { $in: ['pending', 'accepted'] },
    })

    if (existingRequest) {
        if (existingRequest.status === 'pending') {
            throw new AppError(httpStatus.BAD_REQUEST, 'You already have a pending join request for this travel plan')
        }
        if (existingRequest.status === 'accepted') {
            throw new AppError(httpStatus.BAD_REQUEST, 'Your request has already been accepted')
        }
    }

    // Create join request
    const joinRequest = await JoinRequest.create({
        user: userId,
        travelPlan: travelPlanId,
        status: 'pending',
    })

    const populatedRequest = await JoinRequest.findById(joinRequest._id)
        .populate('user', 'fullName email profileImage')
        .populate('travelPlan', 'destination startDate endDate')

    return populatedRequest
}

const getJoinRequestsByPlan = async (travelPlanId: string, hostId: string, status?: string) => {
    const plan = await TravelPlan.findById(travelPlanId)
    if (!plan) {
        throw new AppError(httpStatus.NOT_FOUND, 'Travel plan not found')
    }

    // Only host can view join requests for their travel plan
    if (plan.host?.toString() !== hostId) {
        throw new AppError(httpStatus.FORBIDDEN, 'Only the host can view join requests for this travel plan')
    }

    const filter: any = { travelPlan: travelPlanId }
    if (status && ['pending', 'accepted', 'rejected'].includes(status)) {
        filter.status = status
    }

    const requests = await JoinRequest.find(filter)
        .sort({ createdAt: -1 })
        .populate('user', 'fullName email profileImage bio interests')
        .populate('travelPlan', 'destination startDate endDate')

    return requests
}

const getMyJoinRequests = async (userId: string) => {
    const requests = await JoinRequest.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate('travelPlan', 'destination startDate endDate host')
        .populate({
            path: 'travelPlan',
            populate: {
                path: 'host',
                select: 'fullName email profileImage',
            },
        })

    return requests
}

const acceptJoinRequest = async (requestId: string, hostId: string) => {
    const joinRequest = await JoinRequest.findById(requestId).populate('travelPlan')
    if (!joinRequest) {
        throw new AppError(httpStatus.NOT_FOUND, 'Join request not found')
    }

    if (joinRequest.status !== 'pending') {
        throw new AppError(httpStatus.BAD_REQUEST, 'This request has already been processed')
    }

    const plan = await TravelPlan.findById(joinRequest.travelPlan)
    if (!plan) {
        throw new AppError(httpStatus.NOT_FOUND, 'Travel plan not found')
    }

    // Only host can accept
    if (plan.host?.toString() !== hostId) {
        throw new AppError(httpStatus.FORBIDDEN, 'Only the host can accept join requests')
    }

    // Check if user is already a participant (edge case)
    const alreadyJoined = plan.participants?.some((p: any) => p.toString() === joinRequest.user.toString())
    if (alreadyJoined) {
        // Update request status anyway
        joinRequest.status = 'accepted'
        await joinRequest.save()
        throw new AppError(httpStatus.BAD_REQUEST, 'User is already a participant of this travel plan')
    }

    // Add user to participants
    await TravelPlan.findByIdAndUpdate(
        joinRequest.travelPlan,
        { $addToSet: { participants: joinRequest.user } },
        { new: true }
    )

    // Update request status to accepted
    joinRequest.status = 'accepted'
    await joinRequest.save()

    const updatedRequest = await JoinRequest.findById(requestId)
        .populate('user', 'fullName email profileImage')
        .populate('travelPlan', 'destination startDate endDate')

    return updatedRequest
}

const rejectJoinRequest = async (requestId: string, hostId: string) => {
    const joinRequest = await JoinRequest.findById(requestId)
    if (!joinRequest) {
        throw new AppError(httpStatus.NOT_FOUND, 'Join request not found')
    }

    if (joinRequest.status !== 'pending') {
        throw new AppError(httpStatus.BAD_REQUEST, 'This request has already been processed')
    }

    const plan = await TravelPlan.findById(joinRequest.travelPlan)
    if (!plan) {
        throw new AppError(httpStatus.NOT_FOUND, 'Travel plan not found')
    }

    // Only host can reject
    if (plan.host?.toString() !== hostId) {
        throw new AppError(httpStatus.FORBIDDEN, 'Only the host can reject join requests')
    }

    // Update request status to rejected
    joinRequest.status = 'rejected'
    await joinRequest.save()

    const updatedRequest = await JoinRequest.findById(requestId)
        .populate('user', 'fullName email profileImage')
        .populate('travelPlan', 'destination startDate endDate')

    return updatedRequest
}

const cancelJoinRequest = async (requestId: string, userId: string) => {
    const joinRequest = await JoinRequest.findById(requestId)
    if (!joinRequest) {
        throw new AppError(httpStatus.NOT_FOUND, 'Join request not found')
    }

    // Only the user who created the request can cancel it
    if (joinRequest.user.toString() !== userId) {
        throw new AppError(httpStatus.FORBIDDEN, 'You can only cancel your own join requests')
    }

    if (joinRequest.status !== 'pending') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Only pending requests can be cancelled')
    }

    await JoinRequest.findByIdAndDelete(requestId)

    return joinRequest
}

export const JoinRequestsService = {
    createJoinRequest,
    getJoinRequestsByPlan,
    getMyJoinRequests,
    acceptJoinRequest,
    rejectJoinRequest,
    cancelJoinRequest,
}
