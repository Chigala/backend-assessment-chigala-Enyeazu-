import { HttpException } from "@exceptions/HttpException";
import { Account } from "@/interfaces/account.interface";
import { Accounts } from "@/models/accounts.model";
import { compare, hash } from "bcrypt";
import { isEmpty } from "@/utils/util";
import { Transactions } from "@/models/transactions.model";

class AccountService {
  public async creatAccount(name: string, userId: string, txnPassword: string): Promise<void> {
    await Accounts.query()
      .insert({
        name,
        user_id: userId,
        txnPassword,
      })
      .into("accounts");
  }
  public async updateAccountTxnPassword(accountId: string, txnPassword: string, oldTxnPassword: string): Promise<Account> {
    if (isEmpty(accountId)) throw new HttpException(400, "Account id is required");
    const account: Account = await Accounts.query().select().from("accounts").where("id", "=", accountId).first();
    const passwordMatching = await compare(oldTxnPassword, account.txnPassword);
    if (!passwordMatching) throw new HttpException(409, "Old transaction password is not matching");
    const hashedPassword = await hash(txnPassword, 10);
    const updatedAccount = await Accounts.query().updateAndFetchById(accountId, { txnPassword: hashedPassword }).from("accounts");
    return updatedAccount;
  }
  public async deleteAccount(accountId: string): Promise<Account> {
    if (isEmpty(accountId)) throw new HttpException(400, "Account id is required");
    const account: Account = await Accounts.query().select().from("accounts").where("id", "=", accountId).first();
    await Accounts.query().deleteById(accountId).from("accounts");
    return account;
  }
  public async computeNewAccountBalance(accountId: string): Promise<Account> {
    if (isEmpty(accountId)) throw new HttpException(400, "Account id is required");
    const getTheSumOfCreditTxnForAccount = await Transactions.query()
      .sum("amount")
      .from("transactions")
      .where("account_id", "=", accountId)
      .andWhere("txnType", "=", "CREDIT");
    const getTheSumOfDebitTxnForAccount = await Transactions.query()
      .sum("amount")
      .from("transactions")
      .where("account_id", "=", accountId)
      .andWhere("txnType", "=", "DEBIT");

    const updatedAccount = await Accounts.query()
      .updateAndFetchById(accountId, {
        balance: Number(getTheSumOfCreditTxnForAccount[0]["sum(amount)"] - getTheSumOfDebitTxnForAccount[0]["sum(amount)"]),
      })
      .from("accounts");
    return updatedAccount;
  }
  public async getAccountById(accountId: string): Promise<Account> {
    if (isEmpty(accountId)) throw new HttpException(400, "Account id is required");
    const account: Account = await Accounts.query().select().from("accounts").where("id", "=", accountId).first();
    return account;
  }
  public async getAccountByUserId(userId: string): Promise<Account> {
    if (isEmpty(userId)) throw new HttpException(400, "User id is required");
    const account: Account = await Accounts.query().select().from("accounts").where("user_id", "=", userId).first();
    return account;
  }
}

export default AccountService;
