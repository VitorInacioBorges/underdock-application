import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateExerciseSubmissionDto {
    @IsUUID('4', { message: 'O ID do exercício informado é inválido' })
    @IsNotEmpty({ message: 'O ID do exercício é obrigatório' })
    exerciseId: string;

    @IsUUID('4', { message: 'O ID do usuário informado é inválido' })
    @IsNotEmpty({ message: 'O ID do usuário é obrigatório' })
    userId: string;

    @IsString({ message: 'O caminho do arquivo deve ser um texto.' })
    @IsNotEmpty({ message: 'O caminho do arquivo é obrigatório.' })
    filePath: string;

    // status é sempre definido como 'pending' pelo usecase ao criar uma submissão.
    // Não deve ser enviado pelo cliente para prevenir fraude.
}

// Informação para a Requisição

/*
    {
        "exerciseId": "123e4567-e89b-12d3-a456-426614174000",
        "userId": "987e6543-e21b-12d3-a456-426614174111",
        "filePath": "uploads/submissions/exercise_123_user_987.pdf"
    }
*/
