import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteEnrollmentDto } from '../../../application/dto/enrollment-dtos/delete-enrollment.dto';
import type { IEnrollmentRepository } from '../../repositories/enrollment.repository';

@Injectable()
export class DeleteEnrollmentUseCase {
    constructor(
        @Inject('IEnrollmentRepository')
        private readonly enrollmentRepository: IEnrollmentRepository,
    ) { }

    async execute(input: DeleteEnrollmentDto): Promise<void> {
        const enrollment = await this.enrollmentRepository.findById(input.id);

        if (!enrollment) {
            throw new NotFoundException('Matrícula não encontrada.');
        }

        await this.enrollmentRepository.delete(input.id);
    }
}
