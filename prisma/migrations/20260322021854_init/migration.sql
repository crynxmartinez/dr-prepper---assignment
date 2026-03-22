-- CreateTable
CREATE TABLE "super_categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "super_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "super_category_id" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_hidden" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "weight" VARCHAR(50),
    "bags_per_case" VARCHAR(50),
    "cases_per_pallet" INTEGER NOT NULL DEFAULT 60,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 25.00,
    "category_id" INTEGER NOT NULL,
    "super_category_id" INTEGER NOT NULL,
    "image_url" VARCHAR(512),
    "sku" VARCHAR(100),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_hidden" BOOLEAN NOT NULL DEFAULT false,
    "is_oos" BOOLEAN NOT NULL DEFAULT false,
    "show_price" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" VARCHAR(50) NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "contact_name" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "address_line1" VARCHAR(255),
    "address_line2" VARCHAR(255),
    "city" VARCHAR(100),
    "state" VARCHAR(50),
    "zip" VARCHAR(20),
    "country" VARCHAR(100),
    "view_preset" VARCHAR(50) NOT NULL DEFAULT 'full',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_overrides" (
    "id" SERIAL NOT NULL,
    "customer_id" VARCHAR(50) NOT NULL,
    "product_id" VARCHAR(50) NOT NULL,
    "is_hidden" BOOLEAN NOT NULL DEFAULT false,
    "is_oos" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "customer_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_cat_hidden" (
    "id" SERIAL NOT NULL,
    "customer_id" VARCHAR(50) NOT NULL,
    "super_category_id" INTEGER NOT NULL,

    CONSTRAINT "customer_cat_hidden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" VARCHAR(50) NOT NULL,
    "customer_id" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'Pending',
    "total_cases" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "order_id" VARCHAR(50) NOT NULL,
    "product_id" VARCHAR(50) NOT NULL,
    "qty" INTEGER NOT NULL,
    "unit" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" SERIAL NOT NULL,
    "customer_id" VARCHAR(50) NOT NULL,
    "product_id" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_log" (
    "id" SERIAL NOT NULL,
    "customer_id" VARCHAR(50) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "detail" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pending_registrations" (
    "id" VARCHAR(50) NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "contact_name" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "password_hash" VARCHAR(255) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pending_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "key" VARCHAR(255) NOT NULL,
    "value" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" VARCHAR(50) NOT NULL,
    "product_id" VARCHAR(50) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "super_categories_name_key" ON "super_categories"("name");

-- CreateIndex
CREATE INDEX "categories_is_hidden_idx" ON "categories"("is_hidden");

-- CreateIndex
CREATE INDEX "products_category_id_idx" ON "products"("category_id");

-- CreateIndex
CREATE INDEX "products_super_category_id_idx" ON "products"("super_category_id");

-- CreateIndex
CREATE INDEX "products_created_at_idx" ON "products"("created_at");

-- CreateIndex
CREATE INDEX "products_category_id_is_hidden_idx" ON "products"("category_id", "is_hidden");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE INDEX "customer_overrides_customer_id_idx" ON "customer_overrides"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_overrides_customer_id_product_id_key" ON "customer_overrides"("customer_id", "product_id");

-- CreateIndex
CREATE INDEX "customer_cat_hidden_customer_id_idx" ON "customer_cat_hidden"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_cat_hidden_customer_id_super_category_id_key" ON "customer_cat_hidden"("customer_id", "super_category_id");

-- CreateIndex
CREATE INDEX "orders_customer_id_idx" ON "orders"("customer_id");

-- CreateIndex
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");

-- CreateIndex
CREATE INDEX "favorites_customer_id_idx" ON "favorites"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_customer_id_product_id_key" ON "favorites"("customer_id", "product_id");

-- CreateIndex
CREATE INDEX "activity_log_customer_id_idx" ON "activity_log"("customer_id");

-- CreateIndex
CREATE INDEX "activity_log_type_idx" ON "activity_log"("type");

-- CreateIndex
CREATE INDEX "activity_log_created_at_idx" ON "activity_log"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "pending_registrations_email_key" ON "pending_registrations"("email");

-- CreateIndex
CREATE INDEX "carts_customer_id_idx" ON "carts"("customer_id");

-- CreateIndex
CREATE INDEX "carts_created_at_idx" ON "carts"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "carts_customer_id_product_id_key" ON "carts"("customer_id", "product_id");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_super_category_id_fkey" FOREIGN KEY ("super_category_id") REFERENCES "super_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_super_category_id_fkey" FOREIGN KEY ("super_category_id") REFERENCES "super_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_overrides" ADD CONSTRAINT "customer_overrides_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_overrides" ADD CONSTRAINT "customer_overrides_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_cat_hidden" ADD CONSTRAINT "customer_cat_hidden_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_cat_hidden" ADD CONSTRAINT "customer_cat_hidden_super_category_id_fkey" FOREIGN KEY ("super_category_id") REFERENCES "super_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
