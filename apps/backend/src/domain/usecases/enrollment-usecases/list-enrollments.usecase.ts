import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ListEnrollmentsDto } from '../../../application/dto/enrollment-dtos/list-enrollment.dto';
import { EnrollmentResponseDto } from '../../../application/dto/enrollment-dtos/enrollment-response.dto';
import type { IEnrollmentRepository } from '../../repositories/enrollment.repository';

@Injectable()
export class ListEnrollmentsUseCase {
    constructor(
        @Inject('IEnrollmentRepository')
        private readonly enrollmentRepository: IEnrollmentRepository,
    ) { }

    async execute(input: ListEnrollmentsDto): Promise<EnrollmentResponseDto[]> {
        let enrollments;

        if (input.userId && input.courseId) {
            enrollments = await this.enrollmentRepository.findByUserIdAndCourseId(
                input.userId,
                input.courseId,
            );
        } else if (input.userId) {
            enrollments = await this.enrollmentRepository.findByUserId(input.userId);
        } else if (input.courseId) {
            enrollments = await this.enrollmentRepository.findByCourseId(input.courseId);
        } else {
            throw new NotFoundException(
                'Informe userId ou courseId para listar matrículas.',
            );
        }

        if (!enrollments || enrollments.length === 0) {
            throw new NotFoundException('Nenhuma matrícula encontrada.');
        }

        return enrollments.map((e) => EnrollmentResponseDto.fromEntity(e));
    }
}