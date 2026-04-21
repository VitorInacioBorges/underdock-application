import {
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UpdateLessonDto } from '../../../application/dto/lesson-dtos/update-lesson.dto';
import { LessonResponseDto } from '../../../application/dto/lesson-dtos/lesson-response.dto';
import type { ILessonRepository } from '../../repositories/lesson.repository';

@Injectable()
export class UpdateLessonUseCase {
    constructor(
        @Inject('ILessonRepository')
        private readonly lessonRepository: ILessonRepository,
    ) { }

    async execute(id: string, input: UpdateLessonDto): Promise<LessonResponseDto> {
        const lesson = await this.lessonRepository.findById(id);

        if (!lesson) {
            throw new NotFoundException('Aula não encontrada.');
        }

        // Verifica conflito de ordem dentro do mesmo curso se a ordem for alterada
        if (input.order !== undefined && input.order !== lesson.order) {
            const orderConflict = await this.lessonRepository.findByCourseIdAndOrder(
                lesson.courseId,
                input.order,
            );
            if (orderConflict) {
                throw new ConflictException(
                    `Já existe uma aula com a ordem ${input.order} neste curso.`,
                );
            }
            lesson.order = input.order;
        }

        if (input.title !== undefined) lesson.title = input.title;
        if (input.videoId !== undefined) lesson.videoId = input.videoId;
        if (input.summary !== undefined) lesson.summary = input.summary;
        if (input.topics !== undefined) lesson.topics = input.topics;
        if (input.isPublished !== undefined) lesson.isPublished = input.isPublished;

        const updatedLesson = await this.lessonRepository.update(lesson);

        return LessonResponseDto.fromEntity(updatedLesson);
    }
}
