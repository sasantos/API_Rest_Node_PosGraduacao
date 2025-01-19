import fastify from "fastify";
import { knex } from "./database";
import crypto from "node:crypto";
import { env } from "./env";
import { transactionsRoutes } from "./routes/transactions";
import cookie from "@fastify/cookie";

export const app = fastify();

app.register(cookie);

app.addHook("preHandler", async (request, reply) => {
  console.log(`[${request.method}] ${request.url}`);
});

app.register(transactionsRoutes, {
  prefix: "/transactions",
});
