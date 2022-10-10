import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import { UserTransactionsDto } from "@/dtos/transactions.dto";
import TransactionsController from "@/controllers/transactions.controller";
import authMiddleware from "@/middlewares/auth.middleware";

class TransactionRoute implements Routes {
  public path = "/transactions";
  public router = Router();
  public transactionController = new TransactionsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.transactionController.getAllTransactions);
    this.router.get(`${this.path}/:accountId`, this.transactionController.getAllTransactionByAccountId);
    this.router.get(`${this.path}/:id`, this.transactionController.getTransactionById);
    this.router.post(
      `${this.path}/withdrawal`,
      validationMiddleware(UserTransactionsDto, "body"),
      authMiddleware,
      this.transactionController.withdrawFund,
    );
    this.router.post(
      `${this.path}/fund`,
      validationMiddleware(UserTransactionsDto, "body", true),
      authMiddleware,
      this.transactionController.fundAccount,
    );
    this.router.post(
      `${this.path}/send/:receiverId`,
      validationMiddleware(UserTransactionsDto, "body"),
      authMiddleware,
      this.transactionController.sendMoney,
    );
    this.router.delete(`${this.path}/:id`, this.transactionController.deleteTransaction);
  }
}

export default TransactionRoute;
