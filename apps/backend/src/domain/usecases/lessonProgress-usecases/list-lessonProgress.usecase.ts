import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ListLessonProgressDto } from '../../../application/dto/lessonProgress-dtos/list-lessonProgress.dto';
import { LessonProgressResponseDto } from '../../../application/dto/lessonProgress-dtos/lessonProgress-response.dto';
import type { ILessonProgressRepository } from '../../repositories/lessonProgress.repository';

@Injectable()
export class ListLessonProgressUseCase {
    constructor(
        @Inject('ILessonProgressRepository')
        private readonly lessonProgressRepository: ILessonProgressRepository,
    ) { }

    async execute(
        input: ListLessonProgressDto,
    ): Promise<LessonProgressResponseDto[]> {
        let records;

        if (input.userId && input.lessonId) {
            // Busca específica: progresso de um usuário em uma aula
            const single = await this.lessonProgressRepository.findByUserAndLesson(
                input.userId,
                input.lessonId,
            );
            records = single ? [single] : [];
        } else if (input.userId) {
            // Histórico completo de aulas de um aluno
            records = await this.lessonProgressRepository.findByUserId(input.userId);
        } else {
            throw new NotFoundException(
                'Informe userId (e opcionalmente lessonId) para listar progressos.',
            );
        }

        if (!records || records.length === 0) {
            throw new NotFoundException('Nenhum progresso de aula encontrado.');
        }

        return records.map((p) => LessonProgressResponseDto.fromEntity(p));
    }
}
