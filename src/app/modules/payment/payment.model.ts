
import { model, Schema } from 'mongoose';
import { IPayment, PAYMENT_STATUS, SUBSCRIPTION_PLAN } from './payment.interface';

const paymentSchema = new Schema<IPayment>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        transactionId: {
            type: String,
            required: true,
            unique: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        subscriptionPlan: {
            type: String,
            enum: Object.values(SUBSCRIPTION_PLAN),
            required: true,
        },
        subscriptionDuration: {
            type: Number,
            required: true,
        },
        expiresAt: {
            type: Date,
        },
        paymentGatewayData: {
            type: Schema.Types.Mixed,
        },
        status: {
            type: String,
            enum: Object.values(PAYMENT_STATUS),
            default: PAYMENT_STATUS.UNPAID,
        },
    },
    {
        timestamps: true,
    }
);

export const Payment = model<IPayment>('Payment', paymentSchema);

