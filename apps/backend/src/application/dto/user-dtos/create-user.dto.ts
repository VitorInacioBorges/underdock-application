import {
  IsEnum,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../../domain/entities/user.entity';

export class CreateUserDto {
  @IsString({ message: 'O nome deve ser um texto' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'O e-mail informado é inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email: string;

  @IsString({ message: 'A senha deve ser um texto' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'A role é obrigatória' })
  @IsEnum(UserRole, {
    message: 'O tipo de usuário deve ser admin ou user',
  })
  role: UserRole;
}

// Informação para a Requisição

/*
  "name": "Aluno Exemplo",
  "email": "aluno@email.com",
  "password": "senha_secreta",
  "role": "user"
*/
