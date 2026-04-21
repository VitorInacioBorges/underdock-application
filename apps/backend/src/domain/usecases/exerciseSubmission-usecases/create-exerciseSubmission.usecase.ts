import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateExerciseSubmissionDto } from '../../../application/dto/exerciseSubmission-dtos/create-exerciseSubmission.dto';
import { ExerciseSubmissionResponseDto } from '../../../application/dto/exerciseSubmission-dtos/exerciseSubmission-response.dto';
import {
    ExerciseSubmissionEntity,
    ExerciseSubmissionStatus,
} from '../../entities/exerciseSubmission.entity';
import type { IExerciseSubmissionRepository } from '../../repositories/exerciseSubmission';

@Injectable()
export class CreateExerciseSubmissionUseCase {
    constructor(
        @Inject('IExerciseSubmissionRepository')
        private readonly submissionRepository: IExerciseSubmissionRepository,
    ) { }

    async execute(
        input: CreateExerciseSubmissionDto,
    ): Promise<ExerciseSubmissionResponseDto> {
        const existingSubmission =
            await this.submissionRepository.findByUserAndExercise(
                input.userId,
                input.exerciseId,
            );

        if (existingSubmission) {
            throw new ConflictException(
                'Este usuário já enviou uma resposta para este exercício.',
            );
        }

        const newSubmission = new ExerciseSubmissionEntity({
            exerciseId: input.exerciseId,
            userId: input.userId,
            filePath: input.filePath,
            status: ExerciseSubmissionStatus.pending,
        });

        const savedSubmission =
            await this.submissionRepository.create(newSubmission);

        return ExerciseSubmissionResponseDto.fromEntity(savedSubmission);
    }
}