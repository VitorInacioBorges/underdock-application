import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  // Obrigatório: e-mail é a chave de busca no UpdateUserUseCase (findByEmail)
  @IsEmail({}, { message: 'O e-mail informado é inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email: string;

  @IsOptional()
  @IsString({ message: 'O nome deve ser um texto' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password?: string;
}

// Informação Requerida:

/*
    {
        "email": "user@email.com",
        "name": "Novo Nome",
        "password": "nova_senha"
    }
*/
