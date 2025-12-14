import { Router } from 'express'
import { TravelPlansController } from './travelPlans.controller'
import { checkAuth } from '../../middlewares/checkAuth'

const router = Router()

// Only create endpoint implemented as requested
router.post('/', checkAuth('user', 'admin'), TravelPlansController.createTravelPlan)
router.get('/', TravelPlansController.getAllTravelPlans)
router.get('/my', checkAuth('user', 'admin'), TravelPlansController.getMyTravelPlans)
router.get('/joined', checkAuth('user', 'admin'), TravelPlansController.getJoinedTravelPlans)
router.get('/past-joined', checkAuth('user', 'admin'), TravelPlansController.getPastJoinedTravelPlans)
router.patch('/:id', checkAuth('user', 'admin'), TravelPlansController.updateTravelPlan)
router.delete('/:id', checkAuth('user', 'admin'), TravelPlansController.deleteTravelPlan)
router.post('/:id/join', checkAuth('user'), TravelPlansController.joinTravelPlan)
router.post('/:id/leave', checkAuth('user'), TravelPlansController.leaveTravelPlan)
router.get('/match', TravelPlansController.matchTravelPlans)

// Single travel plan
router.get('/:id', TravelPlansController.getSingleTravelPlan)

export const TravelPlansRoutes = router
