import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateEnrollmentDto } from '../../../application/dto/enrollment-dtos/update-enrollment.dto';
import { EnrollmentResponseDto } from '../../../application/dto/enrollment-dtos/enrollment-response.dto';
import type { IEnrollmentRepository } from '../../repositories/enrollment.repository';

@Injectable()
export class UpdateEnrollmentUseCase {
    constructor(
        @Inject('IEnrollmentRepository')
        private readonly enrollmentRepository: IEnrollmentRepository,
    ) { }

    async execute(
        id: string,
        input: UpdateEnrollmentDto,
    ): Promise<EnrollmentResponseDto> {
        const enrollment = await this.enrollmentRepository.findById(id);

        if (!enrollment) {
            throw new NotFoundException('Matrícula não encontrada.');
        }

        if (input.role !== undefined) enrollment.role = input.role;
        if (input.status !== undefined) enrollment.status = input.status;

        const updatedEnrollment = await this.enrollmentRepository.update(enrollment);

        return EnrollmentResponseDto.fromEntity(updatedEnrollment);
    }
}
