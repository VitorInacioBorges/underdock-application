import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateExerciseSubmissionDto } from '../../../application/dto/exerciseSubmission-dtos/update-exerciseSubmission.dto';
import { ExerciseSubmissionResponseDto } from '../../../application/dto/exerciseSubmission-dtos/exerciseSubmission-response.dto';
import type { IExerciseSubmissionRepository } from '../../repositories/exerciseSubmission';

@Injectable()
export class UpdateExerciseSubmissionUseCase {
    constructor(
        @Inject('IExerciseSubmissionRepository')
        private readonly submissionRepository: IExerciseSubmissionRepository,
    ) { }

    async execute(
        id: string,
        input: UpdateExerciseSubmissionDto,
    ): Promise<ExerciseSubmissionResponseDto> {
        const submission = await this.submissionRepository.findById(id);

        if (!submission) {
            throw new NotFoundException('Submissão não encontrada.');
        }

        if (input.filePath !== undefined) submission.filePath = input.filePath;
        if (input.status !== undefined) submission.status = input.status;

        const updatedSubmission =
            await this.submissionRepository.update(submission);

        return ExerciseSubmissionResponseDto.fromEntity(updatedSubmission);
    }
}
