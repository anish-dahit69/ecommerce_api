import cors from "cors";
import express from "express";
import { productRouter } from "./routes/product.routes.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import { categoryRouter } from "./routes/category.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { userRouter } from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import { orderRouter } from "./routes/order.routes.js";
import { cartRouter } from "./routes/cart.routes.js";
import { corsOptions } from "./services/cors.js";
import { paymentRouter } from "./routes/payment.routes.js";

export const app = express();

//midllewares
app.use("/api/payment", paymentRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
//routes
app.use("/api/auth/", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);

//error handling middleware
app.use(globalErrorHandler);
