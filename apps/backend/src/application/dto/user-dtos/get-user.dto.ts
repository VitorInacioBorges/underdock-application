import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetUserDto {
  @IsEmail({}, { message: 'O email informado é inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;
}

// Informação Requerida

/*
    Sem parâmetros no body, apenas parâmetros query.
    URL: https://url:PORT/api/users?email=user@example.com
*/
