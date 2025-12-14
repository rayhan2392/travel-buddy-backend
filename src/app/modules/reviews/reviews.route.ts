import { Router } from 'express'
import { ReviewsController } from './reviews.controller'
import { checkAuth } from '../../middlewares/checkAuth'
import { validateRequest } from '../../middlewares/validateRequest'
import { createReviewSchema, updateReviewSchema } from './review.validation'

const router = Router()


router.post('/plan/:id', checkAuth('user'), validateRequest(createReviewSchema), ReviewsController.createReview)
router.get('/plan/:id', ReviewsController.getReviewsByPlan)
router.patch('/:id', checkAuth('user'), validateRequest(updateReviewSchema), ReviewsController.updateReview)
router.delete('/:id', checkAuth('user'), ReviewsController.deleteReview)

export const ReviewsRoutes = router
