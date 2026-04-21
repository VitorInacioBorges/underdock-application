import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateLessonProgressDto {
    @IsUUID('4', { message: 'O ID do usuário informado é inválido' })
    @IsNotEmpty({ message: 'O ID do usuário é obrigatório' })
    userId: string;

    @IsUUID('4', { message: 'O ID da aula informado é inválido' })
    @IsNotEmpty({ message: 'O ID da aula é obrigatório' })
    lessonId: string;

    @IsBoolean({ message: 'O campo watched deve ser um booleano.' })
    @IsNotEmpty({ message: 'O campo watched é obrigatório.' })
    watched: boolean;
}

// Informação para a Requisição

/*
    {
        "userId": "987e6543-e21b-12d3-a456-426614174111",
        "lessonId": "123e4567-e89b-12d3-a456-426614174000",
        "watched": true
    }
*/
