import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ExerciseSubmissionStatus } from '../../../domain/entities/exerciseSubmission.entity';

export class UpdateExerciseSubmissionDto {
    @IsOptional()
    @IsString({ message: 'O caminho do arquivo deve ser um texto.' })
    filePath?: string;

    @IsOptional()
    @IsEnum(ExerciseSubmissionStatus, {
        message: 'O status deve ser pending ou reviewed',
    })
    status?: ExerciseSubmissionStatus;
}

// Informação para a Requisição

/*
    {
        "status": "reviewed"
    }
*/
