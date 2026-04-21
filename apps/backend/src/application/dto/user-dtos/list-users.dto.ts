import { UserRole } from '../../../domain/entities/user.entity';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class ListUsersDto {
  @IsOptional()
  @IsEnum(UserRole, { message: 'A role deve ser admin ou user' })
  @IsNotEmpty({ message: 'O parâmetro enum deve ser preenchido' })
  role: UserRole;
}

// Informacão Requerida

/*
    Sem parâmetros no body, apenas parâmetros query.
    URL: https://url:PORT/api/users/list?role=admin
*/
