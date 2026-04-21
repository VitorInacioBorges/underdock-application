import { LessonEntity } from '../../../domain/entities/lesson.entity';

export class LessonResponseDto {
    id: string;
    courseId: string;
    title: string;
    videoId: string;
    summary?: string;
    topics?: string[];
    order: number;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;

    static fromEntity(lesson: LessonEntity): LessonResponseDto {
        const response = new LessonResponseDto();
        response.id = lesson.id!;
        response.courseId = lesson.courseId;
        response.title = lesson.title;
        response.videoId = lesson.videoId;
        response.summary = lesson.summary;
        response.topics = lesson.topics;
        response.order = lesson.order;
        response.isPublished = lesson.isPublished;
        response.createdAt = (lesson.createdAt ?? new Date()).toISOString();
        response.updatedAt = (lesson.updatedAt ?? new Date()).toISOString();

        return response;
    }
}
