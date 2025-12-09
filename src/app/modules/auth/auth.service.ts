import AppError from "../../errorHelper/AppError"
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import httpStatus from "http-status-codes"
import bcrypt from "bcrypt"
import { createUserTokens } from "../../utils/userTokens"

const credentialLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload
    const isUserExist = await User.findOne({ email })
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
    }

    const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password as string)

     if(!isPasswordMatched){
         throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password")
     }

     const userTokens = createUserTokens(isUserExist)

     // eslint-disable-next-line @typescript-eslint/no-unused-vars
     const {password:pass,...rest}=isUserExist.toObject() 

     return {
        accessToken : userTokens.accessToken,
        user:rest
     }
}

export const authServices = {
    credentialLogin
}