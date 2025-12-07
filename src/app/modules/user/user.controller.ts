import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { UserService } from "./user.service"

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = await UserService.createUser(req.body)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'user created successfully',
        data: user

    })

    //
})

export const UserController = {
    createUser,
}