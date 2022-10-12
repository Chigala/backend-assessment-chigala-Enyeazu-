import { RequestWithUser } from "./../interfaces/auth.interface";
import { sendMoneyReturnProps } from "./../interfaces/transaction.interface";
import { NextFunction, Request, Response } from "express";
import { UserTransactionsDto } from "@/dtos/transactions.dto";
import { Transaction } from "@/interfaces/transaction.interface";
import TransactionServices from "@/services/transactionsService";
import AccountService from "@/services/accounts.service";

class TransactionsController {
  public transactionService = new TransactionServices();
  public accountService = new AccountService();

  public getAllTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const getAllTransactionData: Transaction[] = await this.transactionService.getAllTransactions();

      res.status(200).json({ data: getAllTransactionData, message: "findAllTransactions" });
    } catch (error) {
      next(error);
    }
  };

  public getAllTransactionByAccountId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const accountId = req.params.accountId;
      const getAllTransactionData: Transaction[] = await this.transactionService.getAllTransactionsByAccountId(accountId);

      res.status(200).json({ data: getAllTransactionData, message: "findAllTransactionsBelongingToAParticularId" });
    } catch (error) {
      next(error);
    }
  };

  public getTransactionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const transactionId = req.params.id;
      const getTransactionData: Transaction = await this.transactionService.getTransactionById(transactionId);

      res.status(200).json({ data: getTransactionData, message: "getTransactionByTransactionId" });
    } catch (error) {
      next(error);
    }
  };

  public withdrawFund = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const transactionData: UserTransactionsDto = req.body;
      const withdrawalTxnData: Transaction = await this.transactionService.withdrawMoney(req, transactionData.txnPassword, transactionData.amount);

      res.status(200).json({ data: withdrawalTxnData, message: "withDrawFundsFromWallet" });
    } catch (error) {
      next(error);
    }
  };
  public fundAccount = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const transactionData: UserTransactionsDto = req.body;
      const txnData = await this.transactionService.fundAccount(req, transactionData.amount);

      res.status(200).json({ data: txnData, message: "fundWalletAccount" });
    } catch (error) {
      next(error);
    }
  };
  public sendMoney = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { receiverId } = req.params;
      const userId = req.user.id;
      const transactionData: UserTransactionsDto = req.body;
      const txnData: sendMoneyReturnProps = await this.transactionService.sendMoney(
        userId,
        transactionData.txnPassword,
        receiverId,
        transactionData.amount,
      );

      res.status(200).json({ data: [txnData.debitTxn, txnData.creditTxn], message: "TransferMoneyToWalletUser" });
    } catch (error) {
      next(error);
    }
  };
  public deleteTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const txnId = req.params.id;
      await this.transactionService.deleteTransaction(txnId);

      res.status(200).json({ data: `transaction with this Id:${txnId} has been deleted`, message: "DeletedAParticularTransaction" });
    } catch (error) {
      next(error);
    }
  };
}

export default TransactionsController;
