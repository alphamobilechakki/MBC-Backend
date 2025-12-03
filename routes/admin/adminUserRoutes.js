import express from "express";
import { getAllUsers } from "../../controllers/user/adminUserController.js";
import authToken from "../../middleware/authToken.js";
import adminCheck from "../../middleware/adminCheck.js";

const router = express.Router();

router.get("/all-users", authToken, adminCheck, getAllUsers);

export default router;
