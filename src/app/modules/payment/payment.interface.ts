/* eslint-disable @typescript-eslint/no-explicit-any */

import { Types } from "mongoose";


export enum PAYMENT_STATUS {
    PAID = 'PAID',
    UNPAID = 'UNPAID',
    CANCELLED = 'CANCELLED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}

export enum SUBSCRIPTION_PLAN {
    MONTHLY = 'MONTHLY',
    YEARLY = 'YEARLY',
}

export interface IPayment {
    userId: Types.ObjectId;
    transactionId: string;
    amount: number;
    subscriptionPlan: SUBSCRIPTION_PLAN;
    subscriptionDuration: number; // in days
    expiresAt?: Date;
    phoneNumber?: string;
    paymentGatewayData?: any;
    status: PAYMENT_STATUS;
}