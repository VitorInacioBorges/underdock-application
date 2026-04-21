import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetLessonDto } from '../../../application/dto/lesson-dtos/get-lesson.dto';
import { LessonResponseDto } from '../../../application/dto/lesson-dtos/lesson-response.dto';
import type { ILessonRepository } from '../../repositories/lesson.repository';

@Injectable()
export class GetLessonUseCase {
    constructor(
        @Inject('ILessonRepository')
        private readonly lessonRepository: ILessonRepository,
    ) { }

    async execute(input: GetLessonDto): Promise<LessonResponseDto> {
        const lesson = await this.lessonRepository.findById(input.id);

        if (!lesson) {
            throw new NotFoundException('Aula não encontrada.');
        }

        return LessonResponseDto.fromEntity(lesson);
    }
}
