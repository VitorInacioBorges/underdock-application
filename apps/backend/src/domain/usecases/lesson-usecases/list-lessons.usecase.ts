import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ListLessonsDto } from '../../../application/dto/lesson-dtos/list-lessons.dto';
import { LessonResponseDto } from '../../../application/dto/lesson-dtos/lesson-response.dto';
import type { ILessonRepository } from '../../repositories/lesson.repository';

@Injectable()
export class ListLessonsUseCase {
    constructor(
        @Inject('ILessonRepository')
        private readonly lessonRepository: ILessonRepository,
    ) { }

    async execute(input: ListLessonsDto): Promise<LessonResponseDto[]> {
        const lessons = await this.lessonRepository.findByCourseId(input.courseId);

        if (!lessons || lessons.length === 0) {
            throw new NotFoundException(
                'Nenhuma aula encontrada para este curso.',
            );
        }

        return lessons.map((lesson) => LessonResponseDto.fromEntity(lesson));
    }
}
