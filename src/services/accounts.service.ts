import { HttpException } from "@exceptions/HttpException";
import { Account } from "@/interfaces/account.interface";
import { Accounts } from "@/models/accounts.model";
import { compare, hash } from "bcrypt";
import { isEmpty } from "@/utils/util";

class AccountService {
  public async creatAccount(accountData: Account): Promise<void> {
    if (!accountData) throw new Error("Account data is required");
    await Accounts.query().insert(accountData).into("accounts");
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
  public async incrementAccountBalance(accountId: string, amount: number): Promise<Account> {
    if (isEmpty(accountId)) throw new HttpException(400, "Account id is required");
    const account: Account = await Accounts.query().select().from("accounts").where("id", "=", accountId).first();
    const updatedAccount = await Accounts.query()
      .updateAndFetchById(accountId, { balance: account.balance + amount })
      .from("accounts");
    return updatedAccount;
  }
  public async decrementAccountBalance(accountId: string, amount: number): Promise<Account> {
    if (isEmpty(accountId)) throw new HttpException(400, "Account id is required");
    const account: Account = await Accounts.query().select().from("accounts").where("id", "=", accountId).first();
    const updatedAccount = await Accounts.query()
      .updateAndFetchById(accountId, { balance: account.balance - amount })
      .from("accounts");
    return updatedAccount;
  }
  public async getAccountById(accountId: string): Promise<Account> {
    if (isEmpty(accountId)) throw new HttpException(400, "Account id is required");
    const account: Account = await Accounts.query().select().from("accounts").where("id", "=", accountId).first();
    return account;
  }
}

export default AccountService;
