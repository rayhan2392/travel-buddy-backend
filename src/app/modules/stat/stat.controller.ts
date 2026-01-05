import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { StatService } from './stat.service';

const getStats = catchAsync(async (req: Request, res: Response) => {
    const result = await StatService.getStats();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Statistics retrieved successfully',
        data: result,
    });
});

export const StatController = {
    getStats,
};
