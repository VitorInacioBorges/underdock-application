import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetExerciseSubmissionDto } from '../../../application/dto/exerciseSubmission-dtos/get-exerciseSubmission.dto';
import { ExerciseSubmissionResponseDto } from '../../../application/dto/exerciseSubmission-dtos/exerciseSubmission-response.dto';
import type { IExerciseSubmissionRepository } from '../../repositories/exerciseSubmission';

@Injectable()
export class GetExerciseSubmissionUseCase {
    constructor(
        @Inject('IExerciseSubmissionRepository')
        private readonly submissionRepository: IExerciseSubmissionRepository,
    ) { }

    async execute(
        input: GetExerciseSubmissionDto,
    ): Promise<ExerciseSubmissionResponseDto> {
        const submission = await this.submissionRepository.findById(input.id);

        if (!submission) {
            throw new NotFoundException('Submissão não encontrada.');
        }

        return ExerciseSubmissionResponseDto.fromEntity(submission);
    }
}
