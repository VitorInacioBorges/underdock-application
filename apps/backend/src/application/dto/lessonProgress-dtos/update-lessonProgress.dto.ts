import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateLessonProgressDto {
    @IsOptional()
    @IsBoolean({ message: 'O campo watched deve ser um booleano.' })
    @IsNotEmpty({ message: 'O campo watched não pode ser vazio.' })
    watched?: boolean;
}

// Informação para a Requisição

/*
    {
        "watched": true
    }
*/
