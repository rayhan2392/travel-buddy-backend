import { Types } from "mongoose";

export interface ITravelPlan {
  host: Types.ObjectId; // The user who creates the plan
  destination: {
    country: string;
    city?: string;
  };
  startDate: Date;
  endDate: Date;
  budgetRange: {
    min: number;
    max: number;
  };
  travelType: "Solo" | "Family" | "Friends";
  description?: string;
  categories?: string[];
  participants: Types.ObjectId[]; // Multiple people who join the trip
  createdAt?: Date;
  updatedAt?: Date;
}
