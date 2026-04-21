import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ExerciseSubmissionStatus } from '../../../domain/entities/exerciseSubmission.entity';

export class ListExerciseSubmissionsDto {
    @IsOptional()
    @IsUUID('4', { message: 'O ID do exercício informado é inválido' })
    exerciseId?: string;

    @IsOptional()
    @IsUUID('4', { message: 'O ID do usuário informado é inválido' })
    userId?: string;

    @IsOptional()
    @IsEnum(ExerciseSubmissionStatus, {
        message: 'O status deve ser pending ou reviewed',
    })
    status?: ExerciseSubmissionStatus;
}

// Informação Requerida

/*
    Sem parâmetros no body, apenas parâmetros query.
    URL: https://url:PORT/api/submissions/list?exerciseId=...&userId=...&status=pending
*/
