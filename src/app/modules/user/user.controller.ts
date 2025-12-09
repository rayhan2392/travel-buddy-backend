import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { UserService } from "./user.service"
import { User } from "./user.model"
import { IUser } from "./user.interface"
import { JwtPayload } from "jsonwebtoken"

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

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const users = await UserService.getAllUsers()

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'users retrieved successfully',
        data: users

    })

    //
})

const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = await UserService.getSingleUser(req.params.id)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'user retrieved successfully',
        data: user

    })

    //
})

const getMyProfile = catchAsync(async (req: Request, res: Response, nex: NextFunction) => {

    const userId = req.user.userId;
    console.log("request from controller",userId);
    const user = await User.findById(userId)
    console.log("user from controller",user);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'user profile retrived successfully',
        data: user

    })

    //
})

const updateMyProfile = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {



    const payload: IUser = {
      ...req.body,
      file: req.file
    }

    const decodedToken = req.user as JwtPayload;
    const user = await UserService.updateMyProfile(decodedToken.userId, payload);
    console.log("user from controller", user);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Profile updated successfully from controller',
      data: user
    });
  }
);


export const UserController = {
    createUser,
    getAllUsers,
    getSingleUser,
    getMyProfile,
    updateMyProfile
}