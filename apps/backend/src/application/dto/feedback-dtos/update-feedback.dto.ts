import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateFeedbackDto {
    @IsOptional()
    @IsString({ message: 'O comentário deve ser um texto.' })
    @IsNotEmpty({ message: 'O comentário não pode ser vazio.' })
    comment?: string;

    @IsOptional()
    @IsNumber({}, { message: 'A nota deve ser um número.' })
    @Min(0, { message: 'A nota mínima é 0.' })
    @Max(10, { message: 'A nota máxima é 10.' })
    grade?: number;
}

// Informação para a Requisição

/*
    {
        "comment": "Comentário revisado.",
        "grade": 8
    }
*/
