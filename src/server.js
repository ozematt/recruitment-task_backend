import express from "express";
import { PORT } from "./config/env.js";
import ordersRoutes from "./routes/orders.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();
app.use(express.json());

// we could add cors for security

app.use("/orders", authMiddleware, ordersRoutes);

app.listen(PORT, () => {
  console.log(`Server has started on port: ${PORT}`);
});
