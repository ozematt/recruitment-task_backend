import schedule from "node-schedule";
import syncOrders from "./sync.js";

// run everyday at 2:00
const job = schedule.scheduleJob("0 2 * * *", async () => {
  console.log("Daily synchronization started...");
  try {
    await syncOrders();
    console.log("Synchronization completed successfully");
  } catch (error) {
    console.error("Synchronization error:", error);
  }
});

export default job;
