import express from "express";
import { Parser } from "@json2csv/plainjs";
import prisma from "../prismaClient.js";
import syncOrders from "../utils/sync.js";

const router = express.Router();

router.get("/csv", async (req, res) => {
  try {
    const minWorth = Number(req.query.minWorth) || 0;
    const maxWorth = Number(req.query.maxWorth) || Number.MAX_SAFE_INTEGER;

    const orderCount = await prisma.order.count();

    if (orderCount === 0) {
      await syncOrders();
    }

    const orders = await prisma.order.findMany({
      where: {
        orderWorth: {
          gte: minWorth,
          lte: maxWorth,
        },
      },
      include: {
        products: true,
      },
    });

    const parser = new Parser({
      fields: [
        {
          label: "Order ID",
          value: "orderID",
        },
        {
          label: "Products",
          value: (row) =>
            (row.products || [])
              .map((p) => `${p.productID} (${p.quantity})`)
              .join(", ") || "No products",
        },
        {
          label: "Total Value",
          value: (row) => `${row.orderWorth} PLN`,
        },
      ],
      delimiter: ";",
      withBOM: true,
    });

    res.header("Content-Type", "text/csv");
    res.attachment("orders.csv");
    res.send(parser.parse(orders));
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({
      message: "Internal Server Error",
      details: error.message,
      errorCode: error.code,
    });
  }
});

router.get("/:id", async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await prisma.order.findUnique({
      where: { orderID: orderId },
      include: {
        products: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        details: `No order with ID ${orderId}`,
      });
    }

    const parser = new Parser({
      fields: [
        {
          label: "Order ID",
          value: "orderID",
        },
        {
          label: "Products",
          value: (row) =>
            (row.products || [])
              .map((p) => `${p.productID} (${p.quantity})`)
              .join(", ") || "No products",
        },
        {
          label: "Total Value",
          value: (row) => `${row.orderWorth} PLN`,
        },
      ],
      delimiter: ";",
      withBOM: true,
    });
    res.header("Content-Type", "text/csv");
    res.attachment("orders.csv");
    res.send(parser.parse(order));
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({
      message: "Internal Server Error",
      details: error.message,
      errorCode: error.code,
    });
  }
});

export default router;
