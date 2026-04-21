import { Inject, Injectable } from '@nestjs/common';
import { CreateExerciseDto } from '../../../application/dto/exercise-dtos/create-exercise.dto';
import { ExerciseResponseDto } from '../../../application/dto/exercise-dtos/exercise-response.dto';
import { ExerciseEntity } from '../../entities/exercise.entity';
import type { IExerciseRepository } from '../../repositories/exercise.repository';

@Injectable()
export class CreateExerciseUseCase {
    constructor(
        @Inject('IExerciseRepository')
        private readonly exerciseRepository: IExerciseRepository,
    ) { }

    async execute(input: CreateExerciseDto): Promise<ExerciseResponseDto> {
        const newExercise = new ExerciseEntity({
            lessonId: input.lessonId,
            title: input.title,
            description: input.description,
            notebookPath: input.notebookPath,
            notebookFileName: input.notebookFileName,
            notebookMimeType: input.notebookMimeType,
            notebookSize: input.notebookSize,
        });

        const savedExercise = await this.exerciseRepository.create(newExercise);

        return ExerciseResponseDto.fromEntity(savedExercise);
    }
}