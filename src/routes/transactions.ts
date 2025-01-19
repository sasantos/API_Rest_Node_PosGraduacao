import fastify, { FastifyInstance } from "fastify";
import { knex } from "../database";
import crypto from "node:crypto";
import { z } from "zod";
import { checkSessionIdExists } from "../middlewares/check-sessions-id-exists";

export async function transactionsRoutes(app: FastifyInstance) {
  //Rota para criar transacions
  //----------------------------------------------------------------

  app.post("/", async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body
    );

    let session_id = request.cookies.session_id;

    if (!session_id) {
      session_id = crypto.randomUUID();
      reply.cookie("session_id", session_id, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      });
    }

    await knex("transactions").insert({
      id: crypto.randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: session_id,
    });

    return reply.status(201).send();
  });

  // Listar as transactions
  //----------------------------------------------------------------

  app.get(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { session_id } = request.cookies;

      if (!session_id) {
        return reply.status(401).send({ error: "Unauthorized" });
      }
      const transacions = await knex("transactions")
        .where("session_id", session_id)
        .select("*");

      return { transacions };
    }
  );

  //Rota para listar transacions por id
  //----------------------------------------------------------------

  app.get(
    "/:id",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getTransactionsParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getTransactionsParamsSchema.parse(request.params);
      const { session_id } = request.cookies;

      const transacions = await knex("transactions")
        .where({
          id: id,
          session_id: session_id,
        })

        .first();

      return { transacions };
    }
  );

  //Rota para resumo das transaccions
  //----------------------------------------------------------------

  app.get(
    "/summary",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { session_id } = request.cookies;
      const summary = await knex("transactions")
        .sum("amount", { as: "amount" })
        .where("session_id", session_id)
        .first();

      return { summary };
    }
  );
}
