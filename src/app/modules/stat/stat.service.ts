import { User } from '../user/user.model';
import { TravelPlan } from '../travel-plans/travelPlans.model';
import { Review } from '../reviews/review.model';

const getStats = async () => {
    const verifiedTravelers = await User.countDocuments({ isVerified: true });
    const totalTravelPlans = await TravelPlan.countDocuments();
    const totalReviews = await Review.countDocuments();

    return {
        verifiedTravelers,
        totalTravelPlans,
        totalReviews,
    };
};

export const StatService = {
    getStats,
};
