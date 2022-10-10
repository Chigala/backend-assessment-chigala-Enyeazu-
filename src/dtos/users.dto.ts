import { IsEmail, IsString } from "class-validator";
import { AccountsDto } from "./accounts.dto";

export class CreateUserDto extends AccountsDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}
