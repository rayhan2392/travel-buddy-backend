export interface IUser {
    _id?: string;

    fullName: string;
    email: string;
    password: string;

    role: "user" | "admin";

    profileImage?: string;
    bio?: string;
    interests?: string[];
    visitedCountries?: string[];

    currentLocation?: string;

    averageRating?: number;
    ratingCount?: number;

    isVerified?: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}
