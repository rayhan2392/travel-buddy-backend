import multer from "multer";
import path from "path";
import fs from 'fs/promises';
import { v2 as cloudinary } from 'cloudinary';
import { envVars } from "../config/env";

// Configure Cloudinary once
cloudinary.config({
    cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY_API_SECRET,
});

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const sanitized = file.originalname
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-.]/g, '');

        const uniqueFileName =
            Math.random().toString(36).substring(2) +
            '-' +
            Date.now() +
            '-' +
            sanitized;

        cb(null, uniqueFileName);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 512 * 1024, // 512KB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept JPEG and PNG images only
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG and PNG images are allowed. Maximum file size is 512KB.'));
        }
    }
});

const uploadToCloudinary = async (file: Express.Multer.File) => {
    try {
        // Generate public_id from filename or use timestamp
        const publicId = file.filename
            ? file.filename.split('.')[0]
            : `image-${Date.now()}`;

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: 'service64_uploads',
            public_id: publicId,
            resource_type: 'image',
        });

        // Delete local file after successful upload
        await fs.unlink(file.path);

        return {
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
            resource_type: uploadResult.resource_type,
        };
    } catch (error) {
        // Clean up local file even if upload fails
        try {
            await fs.unlink(file.path);
        } catch (unlinkError) {
            // eslint-disable-next-line no-console
            console.error('Failed to delete local file:', unlinkError);
        }
        throw error;
    }
};

// Helper to delete from Cloudinary
const deleteFromCloudinary = async (publicId: string) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to delete from Cloudinary:', error);
        throw error;
    }
};

export const fileUploader = {
    upload,
    uploadToCloudinary,
    deleteFromCloudinary
}