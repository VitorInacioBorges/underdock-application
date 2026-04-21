import { IsNotEmpty, IsUUID } from 'class-validator';

export class ListLessonsDto {
    @IsUUID('4', { message: 'O ID do curso informado é inválido' })
    @IsNotEmpty({ message: 'O ID do curso é obrigatório' })
    courseId: string;
}

// Informação Requerida

/*
    Sem parâmetros no body, apenas parâmetros query.
    URL: https://url:PORT/api/lessons/list?courseId=987e6543-e21b-12d3-a456-426614174111
*/
