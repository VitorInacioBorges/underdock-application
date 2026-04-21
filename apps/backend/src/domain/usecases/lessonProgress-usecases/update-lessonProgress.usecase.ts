import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateLessonProgressDto } from '../../../application/dto/lessonProgress-dtos/update-lessonProgress.dto';
import { LessonProgressResponseDto } from '../../../application/dto/lessonProgress-dtos/lessonProgress-response.dto';
import type { ILessonProgressRepository } from '../../repositories/lessonProgress.repository';

@Injectable()
export class UpdateLessonProgressUseCase {
    constructor(
        @Inject('ILessonProgressRepository')
        private readonly lessonProgressRepository: ILessonProgressRepository,
    ) { }

    async execute(
        id: string,
        input: UpdateLessonProgressDto,
    ): Promise<LessonProgressResponseDto> {
        const progress = await this.lessonProgressRepository.findById(id);

        if (!progress) {
            throw new NotFoundException('Progresso da aula não encontrado.');
        }

        if (input.watched !== undefined) {
            progress.watched = input.watched;
            // Atualiza a data de visualização ao marcar como assistido
            if (input.watched) {
                progress.watchedAt = new Date();
            }
        }

        const updatedProgress =
            await this.lessonProgressRepository.update(progress);

        return LessonProgressResponseDto.fromEntity(updatedProgress);
    }
}
