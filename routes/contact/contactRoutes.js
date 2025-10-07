import express from "express";
import { createContact, getAllContacts } from "../../controllers/contact/contactController.js";
import authToken from "../../middleware/authToken.js";
import adminCheck from "../../middleware/adminCheck.js";

const router = express.Router();

router.post("/", createContact);   // POST -> /api/contact


export default router;
