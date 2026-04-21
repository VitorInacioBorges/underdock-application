import { IsOptional, IsUUID } from 'class-validator';

export class ListEnrollmentsDto {
  @IsOptional()
  @IsUUID('4', { message: 'O ID do usuário informado é inválido' })
  userId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'O ID do curso informado é inválido' })
  courseId?: string;
}

// Informação Requerida

/*
    Sem parâmetros no body, apenas parâmetros query opcionais para filtro.
    URL: https://url:PORT/api/enrollments/list?userId=123e4567-e89b-12d3-a456-426614174000
*/
