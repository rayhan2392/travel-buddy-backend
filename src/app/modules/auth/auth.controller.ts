/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { setAuthCookie } from "../../utils/setCookie"
import { authServices } from "./auth.service"
import httpStatus from "http-status-codes"


const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await authServices.credentialLogin(req.body)

    setAuthCookie(res, loginInfo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data: loginInfo,
    })
})

const logOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    

   res.clearCookie("accessToken",{
    
    httpOnly:true,
    secure:true,
    sameSite:"none"
   })
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged Out Successfully",
        data: null,
    })
})

export const authControllers = {
    credentialLogin,
    logOut
}