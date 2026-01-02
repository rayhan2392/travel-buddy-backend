import { Request, Response } from 'express'
import { catchAsync } from '../../utils/catchAsync'
import { sendResponse } from '../../utils/sendResponse'
import { JoinRequestsService } from './joinRequests.service'

const createJoinRequest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params // travelPlan id
    const decoded = req.user as any
    const userId = decoded?.userId

    const joinRequest = await JoinRequestsService.createJoinRequest(id, userId)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Join request sent successfully',
        data: joinRequest,
    })
})

const getJoinRequestsByPlan = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params // travelPlan id
    const decoded = req.user as any
    const hostId = decoded?.userId
    const status = req.query.status as string | undefined

    const requests = await JoinRequestsService.getJoinRequestsByPlan(id, hostId, status)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Join requests retrieved successfully',
        data: requests,
    })
})

const getMyJoinRequests = catchAsync(async (req: Request, res: Response) => {
    const decoded = req.user as any
    const userId = decoded?.userId

    const requests = await JoinRequestsService.getMyJoinRequests(userId)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Your join requests retrieved successfully',
        data: requests,
    })
})

const acceptJoinRequest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params // join request id
    const decoded = req.user as any
    const hostId = decoded?.userId

    const updatedRequest = await JoinRequestsService.acceptJoinRequest(id, hostId)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Join request accepted successfully',
        data: updatedRequest,
    })
})

const rejectJoinRequest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params // join request id
    const decoded = req.user as any
    const hostId = decoded?.userId

    const updatedRequest = await JoinRequestsService.rejectJoinRequest(id, hostId)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Join request rejected successfully',
        data: updatedRequest,
    })
})

const cancelJoinRequest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params // join request id
    const decoded = req.user as any
    const userId = decoded?.userId

    const deletedRequest = await JoinRequestsService.cancelJoinRequest(id, userId)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Join request cancelled successfully',
        data: deletedRequest,
    })
})

export const JoinRequestsController = {
    createJoinRequest,
    getJoinRequestsByPlan,
    getMyJoinRequests,
    acceptJoinRequest,
    rejectJoinRequest,
    cancelJoinRequest,
}
