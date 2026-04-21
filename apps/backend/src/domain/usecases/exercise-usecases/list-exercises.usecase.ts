import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ListExercisesDto } from '../../../application/dto/exercise-dtos/list-exercises.dto';
import { ExerciseResponseDto } from '../../../application/dto/exercise-dtos/exercise-response.dto';
import type { IExerciseRepository } from '../../repositories/exercise.repository';

@Injectable()
export class ListExercisesUseCase {
    constructor(
        @Inject('IExerciseRepository')
        private readonly exerciseRepository: IExerciseRepository,
    ) { }

    async execute(input: ListExercisesDto): Promise<ExerciseResponseDto[]> {
        const exercises = await this.exerciseRepository.findByLessonId(
            input.lessonId,
        );

        if (!exercises || exercises.length === 0) {
            throw new NotFoundException(
                'Nenhum exercício encontrado para esta aula.',
            );
        }

        return exercises.map((exercise) => ExerciseResponseDto.fromEntity(exercise));
    }
}
