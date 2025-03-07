import axios from "axios";
import { IDOSELL_PANEL, IDOSELL_API_KEY } from "../config/env.js";

const getOrdersIdosell = async () => {
  try {
    const response = await axios.get(
      `${IDOSELL_PANEL}/api/admin/v5/orders/orders?page=1`,
      {
        headers: {
          "X-API-KEY": `${IDOSELL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      return res.status(response.status).json({
        message: "There has been a problem with fetching orders.",
        details: response.data,
      });
    }

    const transformedOrders = response.data.Results.map((order) => ({
      orderID: order.orderId,
      products: order.orderDetails.productsResults.map((product) => ({
        productID: product.productId,
        quantity: product.productQuantity,
      })),
      orderWorth:
        order.orderDetails.payments.orderBaseCurrency.orderProductsCost,
    }));

    return transformedOrders;
  } catch (error) {
    console.error("There has been a problem with fetching orders:", error);
    res.status(500).json({
      message: "There has been a problem with API idoSell",
      error: error.message,
    });
  }
};

export default getOrdersIdosell;
