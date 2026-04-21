import { LessonProgressEntity } from '../../../domain/entities/lessonProgress.entity';

export class LessonProgressResponseDto {
    id: string;
    userId: string;
    lessonId: string;
    watched: boolean;
    watchedAt: string;

    static fromEntity(progress: LessonProgressEntity): LessonProgressResponseDto {
        const response = new LessonProgressResponseDto();
        response.id = progress.id!;
        response.userId = progress.userId;
        response.lessonId = progress.lessonId;
        response.watched = progress.watched;
        response.watchedAt = (progress.watchedAt ?? new Date()).toISOString();

        return response;
    }
}
