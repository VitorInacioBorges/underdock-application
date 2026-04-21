import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteExerciseDto } from '../../../application/dto/exercise-dtos/delete-exercise.dto';
import type { IExerciseRepository } from '../../repositories/exercise.repository';

@Injectable()
export class DeleteExerciseUseCase {
    constructor(
        @Inject('IExerciseRepository')
        private readonly exerciseRepository: IExerciseRepository,
    ) { }

    async execute(input: DeleteExerciseDto): Promise<void> {
        const exercise = await this.exerciseRepository.findById(input.id);

        if (!exercise) {
            throw new NotFoundException('Exercício não encontrado.');
        }

        await this.exerciseRepository.delete(input.id);
    }
}
