import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class ListFeedbacksDto {
    @IsOptional()
    @IsUUID('4', { message: 'O ID da submissão informado é inválido' })
    submissionId?: string;

    @IsOptional()
    @IsUUID('4', { message: 'O ID do instrutor informado é inválido' })
    instructorId?: string;
}

// Informação Requerida

/*
    Sem parâmetros no body, apenas parâmetros query.
    URL: https://url:PORT/api/feedbacks/list?instructorId=987e6543-e21b-12d3-a456-426614174111
*/
