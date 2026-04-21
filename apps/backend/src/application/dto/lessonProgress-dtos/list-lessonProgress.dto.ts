import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class ListLessonProgressDto {
    @IsOptional()
    @IsUUID('4', { message: 'O ID do usuário informado é inválido' })
    userId?: string;

    @IsOptional()
    @IsUUID('4', { message: 'O ID da aula informado é inválido' })
    lessonId?: string;
}

// Informação Requerida

/*
    Sem parâmetros no body, apenas parâmetros query.
    URL: https://url:PORT/api/lesson-progress/list?userId=987e6543-e21b-12d3-a456-426614174111
*/
