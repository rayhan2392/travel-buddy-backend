import express, { Request, Response } from "express";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandlers";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
import cors from 'cors'
import cookieParser from "cookie-parser";
import { envVars } from "./app/config/env";

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}))

app.use("/api/v1",router)


app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Trip Mate system backend"
    })
})

app.use(globalErrorHandler)

app.use(notFound)

export default app