import { NextFunction, Response } from "express";
import AccountService from "@/services/accounts.service";
import { RequestWithUser } from "@/interfaces/auth.interface";
import { Account } from "@/interfaces/account.interface";

class AccountController {
  public accountService = new AccountService();

  public getUserAccount = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user.id;
      const accountData: Account = await this.accountService.getAccountByUserId(userId);

      res.status(200).json({ data: accountData, message: "getAccount" });
    } catch (error) {
      next(error);
    }
  };
  public getAccountByUserId = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      const accountData: Account = await this.accountService.getAccountByUserId(userId);

      res.status(200).json({ data: accountData, message: "getAccountByUserId" });
    } catch (error) {
      next(error);
    }
  };
}

export default AccountController;
