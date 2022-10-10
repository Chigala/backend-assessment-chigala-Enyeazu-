import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import AccountController from "@/controllers/accounts.controller";
import authMiddleware from "@/middlewares/auth.middleware";

class AccountsRoute implements Routes {
  public path = "/account";
  public router = Router();
  public accountController = new AccountController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.accountController.getUserAccount);
    this.router.get(`${this.path}/:id`, authMiddleware, this.accountController.getAccountByUserId);
  }
}

export default AccountsRoute;
