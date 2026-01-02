import { Router } from 'express'
import { JoinRequestsController } from './joinRequests.controller'
import { checkAuth } from '../../middlewares/checkAuth'

const router = Router()

// User creates a join request for a travel plan
router.post('/travel-plan/:id', checkAuth('user', 'admin'), JoinRequestsController.createJoinRequest)

// Get all join requests for a specific travel plan (host only)
router.get('/travel-plan/:id', checkAuth('user', 'admin'), JoinRequestsController.getJoinRequestsByPlan)

// Get user's own join requests
router.get('/my-requests', checkAuth('user', 'admin'), JoinRequestsController.getMyJoinRequests)

// Host accepts a join request
router.patch('/:id/accept', checkAuth('user', 'admin'), JoinRequestsController.acceptJoinRequest)

// Host rejects a join request
router.patch('/:id/reject', checkAuth('user', 'admin'), JoinRequestsController.rejectJoinRequest)

// User cancels their own pending join request
router.delete('/:id', checkAuth('user', 'admin'), JoinRequestsController.cancelJoinRequest)

export const JoinRequestsRoutes = router
