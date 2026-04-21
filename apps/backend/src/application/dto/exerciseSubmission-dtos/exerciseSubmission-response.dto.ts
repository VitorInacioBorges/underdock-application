import { ExerciseSubmissionEntity } from '../../../domain/entities/exerciseSubmission.entity';

export class ExerciseSubmissionResponseDto {
    id: string;
    exerciseId: string;
    userId: string;
    filePath: string;
    status: string;
    submittedAt: string;

    static fromEntity(
        submission: ExerciseSubmissionEntity,
    ): ExerciseSubmissionResponseDto {
        const response = new ExerciseSubmissionResponseDto();
        response.id = submission.id!;
        response.exerciseId = submission.exerciseId;
        response.userId = submission.userId;
        response.filePath = submission.filePath;
        response.status = submission.status;
        response.submittedAt = (submission.submittedAt ?? new Date()).toISOString();

        return response;
    }
}
