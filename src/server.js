import express, { json } from "express";
import { PORT } from "./config/env.js";
import ordersRoutes from "./routes/orders.js";

const app = express();
app.use(express.json());
app.use("/orders", ordersRoutes);

app.listen(PORT, () => {
  console.log(`Server has started on port: ${PORT}`);
});
