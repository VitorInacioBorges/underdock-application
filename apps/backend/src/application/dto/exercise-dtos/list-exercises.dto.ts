import { IsNotEmpty, IsUUID } from 'class-validator';

export class ListExercisesDto {
    @IsUUID('4', { message: 'O ID da aula informado é inválido' })
    @IsNotEmpty({ message: 'O ID da aula é obrigatório' })
    lessonId: string;
}

// Informação Requerida

/*
    Sem parâmetros no body, apenas parâmetros query.
    URL: https://url:PORT/api/exercises/list?lessonId=123e4567-e89b-12d3-a456-426614174000
*/
