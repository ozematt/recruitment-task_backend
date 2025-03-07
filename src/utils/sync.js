import prisma from "../prismaClient.js";
import getOrdersIdosell from "./idosellApi.js";

const syncOrders = async () => {
  const ordersFromApi = await getOrdersIdosell();

  return prisma.$transaction(async (tx) => {
    for (const order of ordersFromApi) {
      try {
        await tx.order.upsert({
          where: { orderID: order.orderID },
          update: {
            orderWorth: order.orderWorth,
            lastUpdated: new Date(),
          },
          create: {
            orderID: order.orderID,
            orderWorth: order.orderWorth,
          },
        });

        for (const product of order.products) {
          await tx.product.upsert({
            where: {
              productID_order_id: {
                productID: product.productID,
                order_id: order.orderID,
              },
            },
            update: {
              quantity: product.quantity,
            },
            create: {
              productID: product.productID,
              quantity: product.quantity,
              order_id: order.orderID,
            },
          });
        }
        console.log(`Processed order ${order.orderID}`);
      } catch (error) {
        console.error(`Error with order ${order.orderID}:`, error);
        throw error; // stop transaction
      }
    }
  });
};

export default syncOrders;
