import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteLessonProgressDto } from '../../../application/dto/lessonProgress-dtos/delete-lessonProgress.dto';
import type { ILessonProgressRepository } from '../../repositories/lessonProgress.repository';

@Injectable()
export class DeleteLessonProgressUseCase {
    constructor(
        @Inject('ILessonProgressRepository')
        private readonly lessonProgressRepository: ILessonProgressRepository,
    ) { }

    async execute(input: DeleteLessonProgressDto): Promise<void> {
        const progress = await this.lessonProgressRepository.findById(input.id);

        if (!progress) {
            throw new NotFoundException('Progresso da aula não encontrado.');
        }

        await this.lessonProgressRepository.delete(input.id);
    }
}
