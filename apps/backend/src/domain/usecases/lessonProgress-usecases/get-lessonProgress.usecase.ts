import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetLessonProgressDto } from '../../../application/dto/lessonProgress-dtos/get-lessonProgress.dto';
import { LessonProgressResponseDto } from '../../../application/dto/lessonProgress-dtos/lessonProgress-response.dto';
import type { ILessonProgressRepository } from '../../repositories/lessonProgress.repository';

@Injectable()
export class GetLessonProgressUseCase {
    constructor(
        @Inject('ILessonProgressRepository')
        private readonly lessonProgressRepository: ILessonProgressRepository,
    ) { }

    async execute(input: GetLessonProgressDto): Promise<LessonProgressResponseDto> {
        const progress = await this.lessonProgressRepository.findById(input.id);

        if (!progress) {
            throw new NotFoundException('Progresso da aula não encontrado.');
        }

        return LessonProgressResponseDto.fromEntity(progress);
    }
}
