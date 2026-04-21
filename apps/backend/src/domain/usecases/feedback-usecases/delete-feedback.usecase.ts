import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteFeedbackDto } from '../../../application/dto/feedback-dtos/delete-feedback.dto';
import type { IFeedbackRepository } from '../../repositories/feedback.repository';

@Injectable()
export class DeleteFeedbackUseCase {
    constructor(
        @Inject('IFeedbackRepository')
        private readonly feedbackRepository: IFeedbackRepository,
    ) { }

    async execute(input: DeleteFeedbackDto): Promise<void> {
        const feedback = await this.feedbackRepository.findById(input.id);

        if (!feedback) {
            throw new NotFoundException('Feedback não encontrado.');
        }

        await this.feedbackRepository.delete(input.id);
    }
}
