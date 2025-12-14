import { TGenericErrorResponse } from "../interfaces/error.types"

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handlerDuplicateError = (err: any): TGenericErrorResponse => {
    const matchedArray = err.message.match(/"([^"]*)"/)

    const extractedMessage = matchedArray ? matchedArray[1] : 'Duplicate key'

    return {
        statusCode: 400,
        message: `${extractedMessage} already exists!!`
    }
}