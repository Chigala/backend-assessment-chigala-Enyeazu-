import { RequestWithUser } from "@/interfaces/auth.interface";
import { sendMoneyReturnProps } from "@/interfaces/transaction.interface";
import { Purpose, TxnType } from "@/dtos/transactions.dto";
import { Transaction } from "@/interfaces/transaction.interface";
import { Transactions } from "@/models/transactions.model";
import { isEmpty } from "@/utils/util";
import { HttpException } from "@exceptions/HttpException";
import { compare } from "bcrypt";
import AccountService from "@/services/accounts.service";

class TransactionServices {
  public accountService = new AccountService();

  public async sendMoney(senderUserId: string, password: string, receiverId: string, amount: number): Promise<sendMoneyReturnProps> {
    if (senderUserId === receiverId) {
      throw new HttpException(400, "Sender and receiver cannot be same");
    }
    const sender = await this.accountService.getAccountByUserId(senderUserId);
    const receiver = await this.accountService.getAccountById(receiverId);
    const verifyTxnPassword = await compare(password, sender.txnPassword);
    if (!verifyTxnPassword) {
      throw new HttpException(400, "Transaction password is not matching");
    }
    const senderId = sender.id;
    const senderBalance = sender.balance;
    const receiverBalance = receiver.balance;

    if (senderBalance < amount) {
      throw new HttpException(400, "Insufficient balance");
    }
    const creditTxn = await this.creditTransaction(receiverId, senderId, amount, receiverBalance);
    const debitTxn = await this.debitTransaction(senderId, receiverId, amount, senderBalance);
    await this.accountService.computeNewAccountBalance(senderId);
    await this.accountService.computeNewAccountBalance(receiverId);
    return {
      creditTxn,
      debitTxn,
    };
  }

  public async creditTransaction(accountId: string, senderId: string, amount: number, balanceBefore: number): Promise<Transaction> {
    const txn = await Transactions.query().insert({
      account_id: accountId,
      amount,
      balanceBefore,
      to: accountId,
      from: senderId,
      balanceAfter: balanceBefore + amount,
      purpose: Purpose.TRANSFER,
      txnType: TxnType.CREDIT,
    });
    return txn;
  }

  public async debitTransaction(accountId: string, receiverId: string, amount: number, balanceBefore: number): Promise<Transaction> {
    const txn = await Transactions.query().insert({
      account_id: accountId,
      amount,
      balanceBefore,
      to: receiverId,
      from: accountId,
      balanceAfter: balanceBefore - amount,
      purpose: Purpose.TRANSFER,
      txnType: TxnType.DEBIT,
    });
    return txn;
  }

  public async withdrawalTransaction(accountId: string, amount: number, balanceBefore: number): Promise<Transaction> {
    const transaction: Transaction = await Transactions.query().insert({
      account_id: accountId,
      amount,
      balanceBefore,
      balanceAfter: balanceBefore - amount,
      purpose: Purpose.WITHDRAWAL,
      txnType: TxnType.DEBIT,
    });
    return transaction;
  }

  public async fundingTransaction(accountId: string, amount: number, balanceBefore: number): Promise<Transaction> {
    const transaction = await Transactions.query().insert({
      account_id: accountId,
      amount,
      balanceBefore,
      balanceAfter: balanceBefore + amount,
      purpose: Purpose.DEPOSIT,
      txnType: TxnType.CREDIT,
    });
    return transaction;
  }

  public async fundAccount(req: RequestWithUser, amount: number): Promise<Transaction> {
    const userId = req.user.id;
    console.log("this is the userId: ", userId);
    const account = await this.accountService.getAccountByUserId(userId);
    const accountId = account.id;
    const currentBalance = account.balance;
    const transaction = await this.fundingTransaction(accountId, amount, currentBalance);
    await this.accountService.computeNewAccountBalance(accountId);
    return transaction;
  }

  public async withdrawMoney(req: RequestWithUser, password: string, amount: number): Promise<Transaction> {
    const userId = req.user.id;
    const account = await this.accountService.getAccountByUserId(userId);
    const accountId = account.id;
    const verifyTxnPassword = await compare(password, account.txnPassword);
    if (!verifyTxnPassword) {
      throw new HttpException(400, "Transaction password is not matching");
    }
    const currentBalance = account.balance;
    if (currentBalance < amount) {
      throw new HttpException(400, "Insufficient balance");
    }
    const transaction = await this.withdrawalTransaction(accountId, amount, currentBalance);
    await this.accountService.computeNewAccountBalance(accountId);
    return transaction;
  }

  public async deleteTransaction(transactionId: string): Promise<void> {
    await Transactions.query().deleteById(transactionId);
  }

  public async getAllTransactions(): Promise<Transaction[]> {
    const transactions = await Transactions.query();
    return transactions;
  }

  public async getTransactionById(transactionId: string): Promise<Transaction> {
    const transaction: Transaction = await Transactions.query().where("id", transactionId).first();
    if (isEmpty(transaction)) throw new HttpException(404, "Transaction not found");
    return transaction;
  }

  public async getAllTransactionsByAccountId(accountId: string): Promise<Transaction[]> {
    const transactions = await Transactions.query().where("account_id", accountId);
    if (isEmpty(transactions)) throw new HttpException(404, "Transactions not found");
    return transactions;
  }
}
export default TransactionServices;
