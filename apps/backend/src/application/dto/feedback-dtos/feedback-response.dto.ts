import { FeedbackEntity } from '../../../domain/entities/feedback.entity';

export class FeedbackResponseDto {
    id: string;
    submissionId: string;
    instructorId: string;
    comment: string;
    grade?: number;
    createdAt: string;

    static fromEntity(feedback: FeedbackEntity): FeedbackResponseDto {
        const response = new FeedbackResponseDto();
        response.id = feedback.id!;
        response.submissionId = feedback.submissionId;
        response.instructorId = feedback.instructorId;
        response.comment = feedback.comment;
        response.grade = feedback.grade;
        response.createdAt = (feedback.createdAt ?? new Date()).toISOString();

        return response;
    }
}
