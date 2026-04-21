import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetEnrollmentDto } from '../../../application/dto/enrollment-dtos/get-enrollment.dto';
import { EnrollmentResponseDto } from '../../../application/dto/enrollment-dtos/enrollment-response.dto';
import type { IEnrollmentRepository } from '../../repositories/enrollment.repository';

@Injectable()
export class GetEnrollmentUseCase {
    constructor(
        @Inject('IEnrollmentRepository')
        private readonly enrollmentRepository: IEnrollmentRepository,
    ) { }

    async execute(input: GetEnrollmentDto): Promise<EnrollmentResponseDto> {
        const enrollment = await this.enrollmentRepository.findById(input.id);

        if (!enrollment) {
            throw new NotFoundException('Matrícula não encontrada.');
        }

        return EnrollmentResponseDto.fromEntity(enrollment);
    }
}
