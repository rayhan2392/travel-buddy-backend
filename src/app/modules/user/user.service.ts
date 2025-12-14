import httpStatus from "http-status-codes"
import { envVars } from '../../config/env';
import AppError from '../../errorHelper/AppError';
import { IUser } from './user.interface';
import { User } from './user.model';
import bcrypt from 'bcrypt';
import { fileUploader } from "../../utils/fileUploader";


const createUser = async (payload: Partial<IUser>) => {
    const { fullName, email, password, ...rest } = payload;

    const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))

    const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        ...rest
    });
    return user;

}

const getAllUsers = async () => {
    const users = await User.find();
    return users;
}

const getSingleUser = async (id: string) => {
    const user = await User.findById(id);
    return user;
}

const updateMyProfile = async (userId: string, payload: Partial<IUser> & { file?: Express.Multer.File }) => {
    const isUserExist = await User.findById(userId)
    if (!isUserExist) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'User not found'
        );
    }

    if (payload.role) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are not permitted to update your role')
    }

    if (payload.password) {
        payload.password = await bcrypt.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND))
    }

    // Handle file upload to Cloudinary if new file exists
    if (payload.file) {
        try {
            const cloudinaryResult = await fileUploader.uploadToCloudinary(payload.file);

            // Delete old image from Cloudinary if exists
            if (isUserExist.profileImage) {
                try {
                    await fileUploader.deleteFromCloudinary(isUserExist.profileImage);
                } catch (deleteError) {
                    // eslint-disable-next-line no-console
                    console.log('Failed to delete old image from Cloudinary:', deleteError);
                }
            }

            // Update payload with new Cloudinary URLs
            payload.profileImage = cloudinaryResult.url;
            payload.photo_name = cloudinaryResult.public_id;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Cloudinary upload error:', error);
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Failed to upload image'
            );
        }
    }

    // Remove file property before updating (not part of User schema)
    delete payload.file;

    const updatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return updatedUser;

}



export const UserService = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateMyProfile
}