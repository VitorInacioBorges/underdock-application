import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetFeedbackDto } from '../../../application/dto/feedback-dtos/get-feedback.dto';
import { FeedbackResponseDto } from '../../../application/dto/feedback-dtos/feedback-response.dto';
import type { IFeedbackRepository } from '../../repositories/feedback.repository';

@Injectable()
export class GetFeedbackUseCase {
    constructor(
        @Inject('IFeedbackRepository')
        private readonly feedbackRepository: IFeedbackRepository,
    ) { }

    async execute(input: GetFeedbackDto): Promise<FeedbackResponseDto> {
        const feedback = await this.feedbackRepository.findById(input.id);

        if (!feedback) {
            throw new NotFoundException('Feedback não encontrado.');
        }

        return FeedbackResponseDto.fromEntity(feedback);
    }
}
