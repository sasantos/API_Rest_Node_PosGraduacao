import {
  it,
  expect,
  test,
  beforeAll,
  afterAll,
  describe,
  beforeEach,
} from "vitest";
import { execSync } from "node:child_process";
import { app } from "../src/app";
import request from "supertest";

describe("Transactions routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  //----------------------------------------------------------------

  it("Should allow the user to create a new transaction", async () => {
    await request(app.server)
      .post("/transactions")
      .send({
        title: "Nova Transação",
        amount: 5000,
        type: "credit",
      })
      .expect(201);
  });

  //----------------------------------------------------------------

  it("Should be  able to list all transactions", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "Nova Transação",
        amount: 5000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    if (!cookies) {
      throw new Error("Cookies not set in the response");
    }

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    expect(listTransactionsResponse.body.transacions).toEqual([
      expect.objectContaining({
        title: "Nova Transação",
        amount: 5000,
      }),
    ]);
  });

  //----------------------------------------------------------------

  it("Should be able to get a especific transaction", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "Nova Transação",
        amount: 5000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    if (!cookies) {
      throw new Error("Cookies not set in the response");
    }

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    const transactionId = listTransactionsResponse.body.transacions[0].id;

    const getTransactionsResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(getTransactionsResponse.body.transacions).toEqual(
      expect.objectContaining({
        title: "Nova Transação",
        amount: 5000,
      })
    );
  });

  //----------------------------------------------------------------

  it("Should be  able to get the summary", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "Credit transaction",
        amount: 5000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");
    if (!cookies) {
      throw new Error("Cookies not set in the response");
    }

    await request(app.server)
      .post("/transactions")
      .set("Cookie", cookies)
      .send({
        title: "Debit Transaction",
        amount: 2000,
        type: "debit",
      });

    const summaryResponse = await request(app.server)
      .get("/transactions/summary")
      .set("Cookie", cookies)
      .expect(200);

    expect(summaryResponse.body.summary).toEqual({
      amount: 3000,
    });
  });

  //----------------------------------------------------------------
});
