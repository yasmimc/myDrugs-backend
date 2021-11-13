CREATE TABLE "users" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL,
	"email" TEXT NOT NULL UNIQUE,
	"cpf" varchar(11) NOT NULL UNIQUE,
	"password" TEXT NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "sessions" (
	"id" serial NOT NULL,
	"user_id" serial NOT NULL,
	"token" uuid NOT NULL UNIQUE,
	"device" TEXT NOT NULL UNIQUE,
	"created_at" TIMESTAMP NOT NULL DEFAULT 'now()',
	"is_expired" bool NOT NULL DEFAULT 'false',
	CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "cart_products" (
	"int" serial NOT NULL,
	"cart_id" int NOT NULL,
	"product_id" int NOT NULL,
	"amount" int NOT NULL,
	CONSTRAINT "cart_products_pk" PRIMARY KEY ("int")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "products" (
	"id" serial NOT NULL,
	"category_id" int NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	"description" TEXT NOT NULL,
	"image" TEXT NOT NULL,
	"stock_total" int NOT NULL,
	"price" DECIMAL NOT NULL,
	CONSTRAINT "products_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "categories" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	CONSTRAINT "categories_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "carts" (
	"id" serial NOT NULL,
	"user_id" int NOT NULL,
	CONSTRAINT "carts_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "payment_ways" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "payment_ways_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "checkouts" (
	"id" serial NOT NULL,
	"cart_id" int NOT NULL,
	"payment_id" int NOT NULL,
	"code" uuid NOT NULL,
	"cep" varchar(8) NOT NULL,
	"address_number" int NOT NULL,
	"checkout_date" TIMESTAMP NOT NULL DEFAULT 'now()',
	"user_id" integer NOT NULL,
	CONSTRAINT "checkouts_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "cart_products" ADD CONSTRAINT "cart_products_fk0" FOREIGN KEY ("cart_id") REFERENCES "carts"("id");
ALTER TABLE "cart_products" ADD CONSTRAINT "cart_products_fk1" FOREIGN KEY ("product_id") REFERENCES "products"("id");
ALTER TABLE "products" ADD CONSTRAINT "products_fk0" FOREIGN KEY ("category_id") REFERENCES "categories"("id");
ALTER TABLE "carts" ADD CONSTRAINT "carts_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_fk0" FOREIGN KEY ("cart_id") REFERENCES "carts"("id");
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_fk1" FOREIGN KEY ("payment_id") REFERENCES "payment_ways"("id");
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_fk2" FOREIGN KEY ("user_id") REFERENCES "users"("id");