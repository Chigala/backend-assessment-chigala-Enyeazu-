import { IsString } from "class-validator";

export class AccountsDto {
  @IsString()
  public name: string;
}
