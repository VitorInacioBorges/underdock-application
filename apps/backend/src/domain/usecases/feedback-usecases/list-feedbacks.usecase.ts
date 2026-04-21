import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ListFeedbacksDto } from '../../../application/dto/feedback-dtos/list-feedbacks.dto';
import { FeedbackResponseDto } from '../../../application/dto/feedback-dtos/feedback-response.dto';
import type { IFeedbackRepository } from '../../repositories/feedback.repository';

@Injectable()
export class ListFeedbacksUseCase {
    constructor(
        @Inject('IFeedbackRepository')
        private readonly feedbackRepository: IFeedbackRepository,
    ) { }

    async execute(input: ListFeedbacksDto): Promise<FeedbackResponseDto[]> {
        let feedbacks;

        if (input.submissionId) {
            const single = await this.feedbackRepository.findBySubmissionId(
                input.submissionId,
            );
            feedbacks = single ? [single] : [];
        } else if (input.instructorId) {
            feedbacks = await this.feedbackRepository.findByInstructorId(
                input.instructorId,
            );
        } else {
            throw new NotFoundException(
                'Informe submissionId ou instructorId para listar feedbacks.',
            );
        }

        if (!feedbacks || feedbacks.length === 0) {
            throw new NotFoundException('Nenhum feedback encontrado.');
        }

        return feedbacks.map((f) => FeedbackResponseDto.fromEntity(f));
    }
}
