import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetExerciseDto } from '../../../application/dto/exercise-dtos/get-exercise.dto';
import { ExerciseResponseDto } from '../../../application/dto/exercise-dtos/exercise-response.dto';
import type { IExerciseRepository } from '../../repositories/exercise.repository';

@Injectable()
export class GetExerciseUseCase {
    constructor(
        @Inject('IExerciseRepository')
        private readonly exerciseRepository: IExerciseRepository,
    ) { }

    async execute(input: GetExerciseDto): Promise<ExerciseResponseDto> {
        const exercise = await this.exerciseRepository.findById(input.id);

        if (!exercise) {
            throw new NotFoundException('Exercício não encontrado.');
        }

        return ExerciseResponseDto.fromEntity(exercise);
    }
}
