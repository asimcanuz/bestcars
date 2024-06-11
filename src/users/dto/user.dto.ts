import { Exclude, Expose } from "class-transformer";

@Exclude()
export class UserDto {
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  username: string;
  @Expose()
  email: string;
}