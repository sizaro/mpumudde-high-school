import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateTeacherAccountDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
