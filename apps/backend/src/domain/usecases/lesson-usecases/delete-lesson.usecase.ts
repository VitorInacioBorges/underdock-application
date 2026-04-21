import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteLessonDto } from '../../../application/dto/lesson-dtos/delete-lesson.dto';
import type { ILessonRepository } from '../../repositories/lesson.repository';

@Injectable()
export class DeleteLessonUseCase {
    constructor(
        @Inject('ILessonRepository')
        private readonly lessonRepository: ILessonRepository,
    ) { }

    async execute(input: DeleteLessonDto): Promise<void> {
        const lesson = await this.lessonRepository.findById(input.id);

        if (!lesson) {
            throw new NotFoundException('Aula não encontrada.');
        }

        await this.lessonRepository.delete(input.id);
    }
}
