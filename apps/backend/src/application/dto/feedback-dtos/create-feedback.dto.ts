import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Max,
    Min,
} from 'class-validator';

export class CreateFeedbackDto {
    @IsUUID('4', { message: 'O ID da submissão informado é inválido' })
    @IsNotEmpty({ message: 'O ID da submissão é obrigatório' })
    submissionId: string;

    @IsUUID('4', { message: 'O ID do instrutor informado é inválido' })
    @IsNotEmpty({ message: 'O ID do instrutor é obrigatório' })
    instructorId: string;

    @IsString({ message: 'O comentário deve ser um texto.' })
    @IsNotEmpty({ message: 'O comentário é obrigatório.' })
    comment: string;

    @IsOptional()
    @IsNumber({}, { message: 'A nota deve ser um número.' })
    @Min(0, { message: 'A nota mínima é 0.' })
    @Max(10, { message: 'A nota máxima é 10.' })
    grade?: number;
}

// Informação para a Requisição

/*
    {
        "submissionId": "123e4567-e89b-12d3-a456-426614174000",
        "instructorId": "987e6543-e21b-12d3-a456-426614174111",
        "comment": "Muito bom! Apenas ajuste a indentação.",
        "grade": 9.5
    }
*/
