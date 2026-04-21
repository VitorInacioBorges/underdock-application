import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateExerciseDto } from '../../../application/dto/exercise-dtos/update-exercise.dto';
import { ExerciseResponseDto } from '../../../application/dto/exercise-dtos/exercise-response.dto';
import type { IExerciseRepository } from '../../repositories/exercise.repository';

@Injectable()
export class UpdateExerciseUseCase {
    constructor(
        @Inject('IExerciseRepository')
        private readonly exerciseRepository: IExerciseRepository,
    ) { }

    async execute(
        id: string,
        input: UpdateExerciseDto,
    ): Promise<ExerciseResponseDto> {
        const exercise = await this.exerciseRepository.findById(id);

        if (!exercise) {
            throw new NotFoundException('Exercício não encontrado.');
        }

        if (input.title !== undefined) exercise.title = input.title;
        if (input.description !== undefined) exercise.description = input.description;

        // Atualiza metadados do notebook se fornecidos
        if (input.notebookPath !== undefined) exercise.notebookPath = input.notebookPath;
        if (input.notebookFileName !== undefined) exercise.notebookFileName = input.notebookFileName;
        if (input.notebookMimeType !== undefined) exercise.notebookMimeType = input.notebookMimeType;
        if (input.notebookSize !== undefined) exercise.notebookSize = input.notebookSize;

        const updatedExercise = await this.exerciseRepository.update(exercise);

        return ExerciseResponseDto.fromEntity(updatedExercise);
    }
}
