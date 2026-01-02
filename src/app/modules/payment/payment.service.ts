/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPayment, PAYMENT_STATUS, SUBSCRIPTION_PLAN } from './payment.interface';
import { User } from '../user/user.model';
import AppError from '../../errorHelper/AppError';
import httpStatus from 'http-status-codes';
import { SSLService } from '../sslCommerz/sslCommerz.service';
import { Payment } from './payment.model';

const initPayment = async (payload: Partial<IPayment>) => {

    const isUSerExists = await User.findById(payload.userId);
    if (!isUSerExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (isUSerExists.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User is already verified and cannot initiate a new payment');
    }

    const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    if (!payload.amount || !payload.subscriptionPlan) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Amount and subscription plan are required');
    }

    // Calculate subscription duration and expiry
    const subscriptionDuration =
        payload.subscriptionPlan === SUBSCRIPTION_PLAN.MONTHLY ? 30 : 365;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + subscriptionDuration);

    // Create payment record
    await Payment.create({
        userId: payload.userId,
        transactionId,
        amount: payload.amount,
        subscriptionPlan: payload.subscriptionPlan,
        subscriptionDuration,
        expiresAt,
        status: PAYMENT_STATUS.UNPAID,
    });

    const sslPayload = {
        amount: payload.amount,
        transactionId,
        name: isUSerExists.fullName,
        email: isUSerExists.email,
        phoneNumber: '01711111111',
        address: isUSerExists.currentLocation || 'N/A',
    }

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);

    // Check if SSL response is successful
    if (!sslPayment || sslPayment.status === 'FAILED') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            sslPayment?.failedreason || 'Payment initiation failed'
        );
    }

    return {
        paymentUrl: sslPayment.GatewayPageURL || '',
        transactionId,
    };
};

const successPayment = async (query: Record<string, string>) => {
    // Update Payment Status to PAID
    // Update User isVerified to true

    const session = await Payment.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            {
                status: PAYMENT_STATUS.PAID,
                paymentGatewayData: query,
            },
            { new: true, runValidators: true, session }
        );

        if (!updatedPayment) {
            throw new AppError(httpStatus.NOT_FOUND, 'Payment not found');
        }

        await User.findByIdAndUpdate(
            updatedPayment.userId,
            { isVerified: true },
            { runValidators: true, session }
        );

        await session.commitTransaction();
        session.endSession();
        return { success: true, message: 'Payment completed successfully' };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const failPayment = async (query: Record<string, string>) => {
    // Update Payment Status to FAILED

    const session = await Payment.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            {
                status: PAYMENT_STATUS.FAILED,
                paymentGatewayData: query,
            },
            { new: true, runValidators: true, session }
        );

        if (!updatedPayment) {
            throw new AppError(httpStatus.NOT_FOUND, 'Payment not found');
        }

        await session.commitTransaction();
        session.endSession();
        return { success: false, message: 'Payment failed' };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const cancelPayment = async (query: Record<string, string>) => {
    // Update Payment Status to CANCELLED

    const session = await Payment.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            {
                status: PAYMENT_STATUS.CANCELLED,
                paymentGatewayData: query,
            },
            { new: true, runValidators: true, session }
        );

        if (!updatedPayment) {
            throw new AppError(httpStatus.NOT_FOUND, 'Payment not found');
        }

        await session.commitTransaction();
        session.endSession();
        return { success: false, message: 'Payment cancelled' };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const PaymentService = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
};
