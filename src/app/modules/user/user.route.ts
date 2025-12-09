import { Router } from "express";
import { UserController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { fileUploader } from "../../utils/fileUploader";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateUserZodSchema } from "./user.validation";


const router = Router();

router.post("/register",UserController.createUser);
router.get("/", UserController.getAllUsers);

router.get("/me",checkAuth("user","admin"), UserController.getMyProfile);
router.get("/:id", UserController.getSingleUser);
router.patch("/me",fileUploader.upload.single("file"),validateRequest(updateUserZodSchema), checkAuth("user","admin"), UserController.updateMyProfile);




export const UserRoutes = router;