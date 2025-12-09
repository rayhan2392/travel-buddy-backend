import { z } from "zod";

export const createUserZodSchema = z.object({
    fullName: z
        .string()
        .min(3, { message: "Full name must be at least 3 characters long." }),

    email: z
        .email({ message: "Invalid email address." }).optional(),

    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long." })
        .optional(),

    

    role: z
        .enum(["user","admin"], {
            error: "invalid role"
        }),
   profile_image: z.string().optional(),
   bio: z.string().optional(),
   interests: z.array(z.string()).optional(),
   visitedCountries: z.array(z.string()).optional(),
   currentLocation: z.string().optional(),
   isVerified: z.boolean().optional(),  
});

export const updateUserZodSchema = z.object({
    fullName: z
        .string()
        .min(3, { message: "Full name must be at least 3 characters long." })
        .optional(),
    email: z
        .email({ message: "Invalid email address." })
        .optional(),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long." })
        .optional(),
    bio: z.string().optional(),
    interests: z.array(z.string()).optional(),
    visitedCountries: z.array(z.string()).optional(),
    currentLocation: z.string().optional(),
});