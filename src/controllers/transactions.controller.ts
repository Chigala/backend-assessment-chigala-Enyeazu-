import { sendMoneyReturnProps } from "./../interfaces/transaction.interface";
import { NextFunction, Request, Response } from "express";
import { UserTransactionsDto } from "@/dtos/transactions.dto";
import { Transaction } from "@/interfaces/transaction.interface";
import TransactionServices from "@/services/transactionsService";

class TransactionsController {
  public transactionService = new TransactionServices();

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
      const accountId = req.params.id;
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

  public withdrawFund = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const accountId = req.params.id;
      const transactionData: UserTransactionsDto = req.body;
      const withdrawalTxnData: Transaction = await this.transactionService.withdrawMoney(
        accountId,
        transactionData.txnPassword,
        transactionData.amount,
      );

      res.status(200).json({ data: withdrawalTxnData, message: "withDrawFundsFromWallet" });
    } catch (error) {
      next(error);
    }
  };
  public fundAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const accountId = req.params.id;
      const transactionData: UserTransactionsDto = req.body;
      const txnData = await this.transactionService.fundAccount(accountId, transactionData.amount);

      res.status(200).json({ data: txnData, message: "fundWalletAccount" });
    } catch (error) {
      next(error);
    }
  };
  public sendMoney = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { senderId, receiverId } = req.params;
      const transactionData: UserTransactionsDto = req.body;
      const txnData: sendMoneyReturnProps = await this.transactionService.sendMoney(
        senderId,
        transactionData.txnPassword,
        receiverId,
        transactionData.amount,
      );

      res.status(200).json({ data: { ...txnData.debitTxn, ...txnData.creditTxn }, message: "TransferMoneyToWalletUser" });
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
