-- CreateTable
CREATE TABLE "Order" (
    "orderID" TEXT NOT NULL PRIMARY KEY,
    "orderWorth" REAL NOT NULL,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productID" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "order_id" TEXT NOT NULL,
    CONSTRAINT "Product_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("orderID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Product_order_id_idx" ON "Product"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Product_productID_order_id_key" ON "Product"("productID", "order_id");
