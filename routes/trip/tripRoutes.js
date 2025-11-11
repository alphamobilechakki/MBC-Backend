import express from "express";
import { getTrips } from "../../controllers/trip/tripController.js";

const router = express.Router();

router.get("/", getTrips);

export default router;



