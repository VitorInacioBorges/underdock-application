import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ListExerciseSubmissionsDto } from '../../../application/dto/exerciseSubmission-dtos/list-exerciseSubmissions.dto';
import { ExerciseSubmissionResponseDto } from '../../../application/dto/exerciseSubmission-dtos/exerciseSubmission-response.dto';
import type { IExerciseSubmissionRepository } from '../../repositories/exerciseSubmission';

@Injectable()
export class ListExerciseSubmissionsUseCase {
    constructor(
        @Inject('IExerciseSubmissionRepository')
        private readonly submissionRepository: IExerciseSubmissionRepository,
    ) { }

    async execute(
        input: ListExerciseSubmissionsDto,
    ): Promise<ExerciseSubmissionResponseDto[]> {
        let submissions;

        if (input.exerciseId) {
            submissions = await this.submissionRepository.findByExerciseId(
                input.exerciseId,
            );
        } else if (input.userId) {
            submissions = await this.submissionRepository.findByUserId(input.userId);
        } else if (input.status) {
            submissions = await this.submissionRepository.findByStatus(input.status);
        } else {
            throw new NotFoundException(
                'Informe exerciseId, userId ou status para listar submissões.',
            );
        }

        if (!submissions || submissions.length === 0) {
            throw new NotFoundException('Nenhuma submissão encontrada.');
        }

        return submissions.map((s) =>
            ExerciseSubmissionResponseDto.fromEntity(s),
        );
    }
}
