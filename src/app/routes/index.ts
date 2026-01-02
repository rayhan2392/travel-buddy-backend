import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { TravelPlansRoutes } from "../modules/travel-plans/travelPlans.route";
import { ReviewsRoutes } from "../modules/reviews/reviews.route";
import { JoinRequestsRoutes } from "../modules/join-requests/joinRequests.route";
import { PaymentRoutes } from "../modules/payment/payment.route";

const router = Router();


const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    }
    ,
    {
        path: "/travel-plans",
        route: TravelPlansRoutes
    }
    ,
    {
        path: "/reviews",
        route: ReviewsRoutes
    }
    ,
    {
        path: "/join-requests",
        route: JoinRequestsRoutes
    },
    {
        path: "/payment",
        route: PaymentRoutes
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

export default router;