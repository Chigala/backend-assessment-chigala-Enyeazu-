import { hash } from "bcrypt";
import { CreateUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/HttpException";
import { User } from "@interfaces/users.interface";
import { Users } from "@models/users.model";
import { isEmpty } from "@utils/util";
import AccountService from "./accounts.service";

class UserService {
  public accountService = new AccountService();

  public async findAllUser(): Promise<User[]> {
    const users: User[] = await Users.query().select().from("users");
    return users;
  }

  public async findUserById(userId: string): Promise<User> {
    const findUser: User = await Users.query().findById(userId);
    console.log(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: User = await Users.query().select().from("users").where("email", "=", userData.email).first();
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await Users.query()
      .insert({ ...userData, password: hashedPassword })
      .into("users");

    return createUserData;
  }

  public async updateUser(userId: string, userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: User[] = await Users.query().select().from("users").where("id", "=", userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const hashedPassword = await hash(userData.password, 10);
    await Users.query()
      .update({ ...userData, password: hashedPassword })
      .where("id", "=", userId)
      .into("users");

    const updateUserData: User = await Users.query().select().from("users").where("id", "=", userId).first();
    return updateUserData;
  }

  public async deleteUser(userId: string): Promise<User> {
    const findUser: User = await Users.query().select().from("users").where("id", "=", userId).first();
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await Users.query().delete().where("id", "=", userId).into("users");
    return findUser;
  }
}

export default UserService;
