import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../config/env';
import { verifyToken } from '../utils/jwt';
import { User } from '../modules/user/user.model';
import httpStatus from 'http-status-codes';
import AppError from '../errorHelper/AppError';


export const checkAuth =
  (...authRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authHeader = req.headers.authorization;
        const cookieToken = req.cookies?.accessToken;

        

        if (!authHeader && !cookieToken) {
          throw new AppError(403, 'No Token Received');
        }

        let accessToken = cookieToken;

        if (authHeader) {
          // If authorization header exists and starts with "Bearer "
          if (authHeader.startsWith('Bearer ')) {
            accessToken = authHeader.split(' ')[1];
            
          } else {
            accessToken = authHeader;
            
          }
        }

        const verifiedToken = verifyToken(
          accessToken,
          envVars.JWT_ACCESS_SECRET
        ) as JwtPayload;

        const isUserExist = await User.findOne({ email: verifiedToken.email });

        if (!isUserExist) {
          throw new AppError(httpStatus.NOT_FOUND, "user not found")
        }


        if (!authRoles.includes(verifiedToken.role)) {
          throw new AppError(403, 'You are not permitted to view this route!!!');
        }
        req.user = verifiedToken;
        next();
      } catch (error) {
        next(error);
      }
    };