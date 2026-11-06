import { Router } from "express";
import {
  getBookingByID,
  createBooking,
  updateServiceForBooking
} from "../controllers/bookings.controller.js"

const router = Router();

router.get("/:bid", getBookingByID);

router.post("/", createBooking);

router.post("/:bid/services/:sid", updateServiceForBooking);

export default router;
