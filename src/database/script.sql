CREATE TABLE "public.users" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL,
	"email" TEXT NOT NULL UNIQUE,
	"cpf" varchar(11) NOT NULL UNIQUE,
	"password" TEXT NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.sessions" (
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



CREATE TABLE "public.products_sold" (
	"int" serial NOT NULL,
	"request_id" int NOT NULL,
	"product_id" int NOT NULL,
	CONSTRAINT "products_sold_pk" PRIMARY KEY ("int")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.products" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	"category_id" int NOT NULL,
	"stock_total" int NOT NULL,
	"amount" int NOT NULL,
	CONSTRAINT "products_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.categories" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	CONSTRAINT "categories_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.requests" (
	"id" serial NOT NULL,
	"user_id" int NOT NULL,
	"code" uuid NOT NULL UNIQUE,
	"date" TIMESTAMP NOT NULL DEFAULT 'now()',
	CONSTRAINT "requests_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "products_sold" ADD CONSTRAINT "products_sold_fk0" FOREIGN KEY ("request_id") REFERENCES "requests"("id");
ALTER TABLE "products_sold" ADD CONSTRAINT "products_sold_fk1" FOREIGN KEY ("product_id") REFERENCES "products"("id");

ALTER TABLE "products" ADD CONSTRAINT "products_fk0" FOREIGN KEY ("category_id") REFERENCES "categories"("id");


ALTER TABLE "requests" ADD CONSTRAINT "requests_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");






