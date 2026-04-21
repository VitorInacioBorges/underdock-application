import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateFeedbackDto } from '../../../application/dto/feedback-dtos/update-feedback.dto';
import { FeedbackResponseDto } from '../../../application/dto/feedback-dtos/feedback-response.dto';
import type { IFeedbackRepository } from '../../repositories/feedback.repository';

@Injectable()
export class UpdateFeedbackUseCase {
    constructor(
        @Inject('IFeedbackRepository')
        private readonly feedbackRepository: IFeedbackRepository,
    ) { }

    async execute(
        id: string,
        input: UpdateFeedbackDto,
    ): Promise<FeedbackResponseDto> {
        const feedback = await this.feedbackRepository.findById(id);

        if (!feedback) {
            throw new NotFoundException('Feedback não encontrado.');
        }

        if (input.comment !== undefined) feedback.comment = input.comment;
        if (input.grade !== undefined) feedback.grade = input.grade;

        const updatedFeedback = await this.feedbackRepository.update(feedback);

        return FeedbackResponseDto.fromEntity(updatedFeedback);
    }
}
