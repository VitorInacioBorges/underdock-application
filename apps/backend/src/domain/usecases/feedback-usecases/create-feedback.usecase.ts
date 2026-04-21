import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from '../../../application/dto/feedback-dtos/create-feedback.dto';
import { FeedbackResponseDto } from '../../../application/dto/feedback-dtos/feedback-response.dto';
import { FeedbackEntity } from '../../entities/feedback.entity';
import type { IFeedbackRepository } from '../../repositories/feedback.repository';

@Injectable()
export class CreateFeedbackUseCase {
    constructor(
        @Inject('IFeedbackRepository')
        private readonly feedbackRepository: IFeedbackRepository,
    ) { }

    async execute(input: CreateFeedbackDto): Promise<FeedbackResponseDto> {
        const existingFeedback =
            await this.feedbackRepository.findBySubmissionId(input.submissionId);

        if (existingFeedback) {
            throw new ConflictException(
                'Já existe um feedback para esta submissão.',
            );
        }

        const newFeedback = new FeedbackEntity({
            submissionId: input.submissionId,
            instructorId: input.instructorId,
            comment: input.comment,
            grade: input.grade,
        });

        const savedFeedback = await this.feedbackRepository.create(newFeedback);

        return FeedbackResponseDto.fromEntity(savedFeedback);
    }
}