import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateLessonProgressDto } from '../../../application/dto/lessonProgress-dtos/create-lessonProgress.dto';
import { LessonProgressResponseDto } from '../../../application/dto/lessonProgress-dtos/lessonProgress-response.dto';
import { LessonProgressEntity } from '../../entities/lessonProgress.entity';
import type { ILessonProgressRepository } from '../../repositories/lessonProgress.repository';

@Injectable()
export class CreateLessonProgressUseCase {
    constructor(
        @Inject('ILessonProgressRepository')
        private readonly lessonProgressRepository: ILessonProgressRepository,
    ) { }

    async execute(
        input: CreateLessonProgressDto,
    ): Promise<LessonProgressResponseDto> {
        const existing = await this.lessonProgressRepository.findByUserAndLesson(
            input.userId,
            input.lessonId,
        );

        if (existing) {
            throw new ConflictException(
                'Já existe um registro de progresso para esta aula e usuário.',
            );
        }

        const newProgress = new LessonProgressEntity({
            userId: input.userId,
            lessonId: input.lessonId,
            watched: input.watched,
        });

        const savedProgress =
            await this.lessonProgressRepository.create(newProgress);

        return LessonProgressResponseDto.fromEntity(savedProgress);
    }
}