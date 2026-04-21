import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetFeedbackDto {
    @IsUUID('4', { message: 'O ID informado é inválido' })
    @IsNotEmpty({ message: 'O ID é obrigatório' })
    id: string;
}

// Informação Requerida

/*
    Sem parâmetros no body, apenas parâmetros query.
    URL: https://url:PORT/api/feedbacks?id=123e4567-e89b-12d3-a456-426614174000
*/
