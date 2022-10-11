import request from "supertest";
import App from "@/app";
import TransactionRoute from "@/routes/transactions.route";

const app = new App([new TransactionRoute()]);
afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe("Testing transactions", () => {
  describe("[Get] /transactions", () => {
    it("it should show all transactions", () => {
      const transactions = new TransactionRoute();
      request(app.getServer()).get(`${transactions.path}`).expect(200);
    });
    it("it should show one transaction", () => {
      const transactions = new TransactionRoute();
      request(app.getServer()).get(`${transactions.path}/1`).expect(200);
    });
    it("if no transaction found", () => {
      const transactions = new TransactionRoute();
      request(app.getServer()).get(`${transactions.path}/1000`).expect(404);
    });
  });

  describe("[Post] /transactions", () => {
    it("fund account", () => {
      const transactions = new TransactionRoute();
      request(app.getServer())
        .post(`${transactions.path}`)
        .send({
          type: "credit",
          amount: 1000,
          accountNumber: 1,
        })
        .expect(201);
    });
  });
});
