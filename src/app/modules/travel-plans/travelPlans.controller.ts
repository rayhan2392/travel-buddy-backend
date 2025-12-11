import { Request, Response } from 'express'
import { catchAsync } from '../../utils/catchAsync'
import { sendResponse } from '../../utils/sendResponse'
import { TravelPlansService } from './travelPlans.service'


const createTravelPlan = catchAsync(async (req: Request, res: Response) => {
    // attach current user as host (set by checkAuth middleware)
    const decoded = req.user as any
    const payload = { ...req.body, host: decoded?.userId }

    const plan = await TravelPlansService.createTravelPlan(payload)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Travel plan created successfully',
        data: plan,
    })
})

const getAllTravelPlans = catchAsync(async (req: Request, res: Response) => {
    const plans = await TravelPlansService.getAllTravelPlans()
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Travel plans retrieved successfully',
        data: plans,
    })
})

const getSingleTravelPlan = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const plan = await TravelPlansService.getSingleTravelPlan(id)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Travel plan retrieved successfully',
        data: plan,
    })
})

const getMyTravelPlans = catchAsync(async (req: Request, res: Response) => {
    const decoded = req.user as any
    const userId = decoded?.userId
    const plans = await TravelPlansService.getUserTravelPlans(userId)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User travel plans retrieved successfully',
        data: plans,
    })
})

const updateTravelPlan = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const updated = await TravelPlansService.updateTravelPlan(id, req.body)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Travel plan updated successfully',
        data: updated,
    })
})

const matchTravelPlans = catchAsync(async (req: Request, res: Response) => {
    const { q, startDate, endDate, interest, page, limit } = req.query as any

    const pageNum = page ? parseInt(page, 10) : undefined
    const limitNum = limit ? parseInt(limit, 10) : undefined

    const result = await TravelPlansService.matchTravelPlans({
        q,
        startDate,
        endDate,
        interest,
        page: pageNum,
        limit: limitNum,
    })

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Matched travel plans retrieved successfully',
        data: result.data,
        meta: result.meta,
    })
})

const leaveTravelPlan = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const decoded = req.user as any
    const userId = decoded?.userId

    const plan = await TravelPlansService.leaveTravelPlan(id, userId)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Left travel plan successfully',
        data: plan,
    })
})

const joinTravelPlan = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const decoded = req.user as any
    const userId = decoded?.userId

    const plan = await TravelPlansService.joinTravelPlan(id, userId)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Joined travel plan successfully',
        data: plan,
    })
})

const deleteTravelPlan = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params

    const deleted = await TravelPlansService.deleteTravelPlan(id)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Travel plan deleted successfully',
        data: deleted,
    })
})

export const TravelPlansController = {
    createTravelPlan,
    getAllTravelPlans,
    getSingleTravelPlan,
    getMyTravelPlans,
    updateTravelPlan,
    deleteTravelPlan,
    joinTravelPlan,
    leaveTravelPlan,
    matchTravelPlans,
}
