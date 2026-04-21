import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteUserDto {
  @IsEmail({}, { message: 'O email informado é inválido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;
}

// Informação Requerida

/*
    Sem parâmetros no body, apenas parâmetros query.
    URL: https://url:PORT/api/users/delete?email=user@example.com
*/
