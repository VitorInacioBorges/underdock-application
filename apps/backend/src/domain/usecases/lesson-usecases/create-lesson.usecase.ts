import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateLessonDto } from '../../../application/dto/lesson-dtos/create-lesson.dto';
import { LessonResponseDto } from '../../../application/dto/lesson-dtos/lesson-response.dto';
import { LessonEntity } from '../../entities/lesson.entity';
import type { ILessonRepository } from '../../repositories/lesson.repository';

@Injectable()
export class CreateLessonUseCase {
    constructor(
        @Inject('ILessonRepository')
        private readonly lessonRepository: ILessonRepository,
    ) { }

    async execute(input: CreateLessonDto): Promise<LessonResponseDto> {
        const existingLesson = await this.lessonRepository.findByCourseIdAndOrder(
            input.courseId,
            input.order,
        );

        if (existingLesson) {
            throw new ConflictException(
                `Já existe uma aula com a ordem ${input.order} neste curso.`,
            );
        }

        const newLesson = new LessonEntity({
            courseId: input.courseId,
            title: input.title,
            videoId: input.videoId,
            summary: input.summary,
            topics: input.topics,
            order: input.order,
            isPublished: input.isPublished,
        });


        const savedLesson = await this.lessonRepository.create(newLesson);

        return LessonResponseDto.fromEntity(savedLesson);
    }
}