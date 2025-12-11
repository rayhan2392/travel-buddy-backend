import { Router } from 'express'
import { TravelPlansController } from './travelPlans.controller'
import { checkAuth } from '../../middlewares/checkAuth'
import { ReviewsController } from '../reviews/reviews.controller'
import { validateRequest } from '../../middlewares/validateRequest'
import { createReviewSchema } from '../reviews/review.validation'

const router = Router()

// Only create endpoint implemented as requested
router.post('/', checkAuth('user', 'admin'), TravelPlansController.createTravelPlan)
router.get('/', TravelPlansController.getAllTravelPlans)
router.get('/my', checkAuth('user', 'admin'), TravelPlansController.getMyTravelPlans)
router.patch('/:id', checkAuth('user', 'admin'), TravelPlansController.updateTravelPlan)
router.delete('/:id', checkAuth('user'), TravelPlansController.deleteTravelPlan)
router.post('/:id/join', checkAuth('user'), TravelPlansController.joinTravelPlan)
router.post('/:id/leave', checkAuth('user'), TravelPlansController.leaveTravelPlan)
router.get('/match', TravelPlansController.matchTravelPlans)
// Reviews for a travel plan (plan-scoped endpoints)
router.post('/:id/reviews', checkAuth('user'), validateRequest(createReviewSchema), ReviewsController.createReview)
router.get('/:id/reviews', ReviewsController.getReviewsByPlan)

// Single travel plan
router.get('/:id', TravelPlansController.getSingleTravelPlan)

export const TravelPlansRoutes = router
