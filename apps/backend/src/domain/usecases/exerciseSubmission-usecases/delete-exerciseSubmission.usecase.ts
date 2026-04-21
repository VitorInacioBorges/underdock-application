import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteExerciseSubmissionDto } from '../../../application/dto/exerciseSubmission-dtos/delete-exerciseSubmission.dto';
import type { IExerciseSubmissionRepository } from '../../repositories/exerciseSubmission';

@Injectable()
export class DeleteExerciseSubmissionUseCase {
    constructor(
        @Inject('IExerciseSubmissionRepository')
        private readonly submissionRepository: IExerciseSubmissionRepository,
    ) { }

    async execute(input: DeleteExerciseSubmissionDto): Promise<void> {
        const submission = await this.submissionRepository.findById(input.id);

        if (!submission) {
            throw new NotFoundException('Submissão não encontrada.');
        }

        await this.submissionRepository.delete(input.id);
    }
}
