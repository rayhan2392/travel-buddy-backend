import { Request, Response } from 'express'
import { catchAsync } from '../../utils/catchAsync'
import { sendResponse } from '../../utils/sendResponse'
import { ReviewsService } from './reviews.service'

const createReview = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params // travelPlan id
    const decoded = req.user as any
    const userId = decoded?.userId

    const payload = req.body
    const review = await ReviewsService.createReview(id, userId, payload)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Review created successfully',
        data: review,
    })
})

const getReviewsByPlan = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20

    const result = await ReviewsService.getReviewsByPlan(id, page, limit)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Reviews retrieved successfully',
        data: result.data,
        meta: result.meta,
    })
})

const updateReview = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params // review id
    const decoded = req.user as any
    const userId = decoded?.userId

    const updated = await ReviewsService.updateReview(id, userId, req.body)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Review updated successfully',
        data: updated,
    })
})

const deleteReview = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const decoded = req.user as any
    const userId = decoded?.userId

    const deleted = await ReviewsService.deleteReview(id, userId)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Review deleted successfully',
        data: deleted,
    })
})

export const ReviewsController = {
    createReview,
    getReviewsByPlan,
    updateReview,
    deleteReview,
}
