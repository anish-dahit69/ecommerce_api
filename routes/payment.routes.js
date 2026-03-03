import express from "express";
import { handleStripeWebHook } from "../controllers/stipe/webhook.controller.js";


export const paymentRouter = express.Router();

paymentRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebHook,
);
