import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateEnrollmentDto } from '../../../application/dto/enrollment-dtos/create-enrollment.dto';
import { EnrollmentResponseDto } from '../../../application/dto/enrollment-dtos/enrollment-response.dto';
import { EnrollmentEntity } from '../../entities/enrollment.entity';
import type { IEnrollmentRepository } from '../../repositories/enrollment.repository';

@Injectable()
export class CreateEnrollmentUseCase {
    constructor(
        @Inject('IEnrollmentRepository')
        private readonly enrollmentRepository: IEnrollmentRepository,
    ) { }

    async execute(input: CreateEnrollmentDto): Promise<EnrollmentResponseDto> {
        const existingEnrollment =
            await this.enrollmentRepository.findByUserAndCourse(
                input.userId,
                input.courseId,
            );

        if (existingEnrollment) {
            throw new ConflictException(
                'Este usuário já está matriculado neste curso.',
            );
        }

        const newEnrollment = new EnrollmentEntity({
            userId: input.userId,
            courseId: input.courseId,
            role: input.role,
            status: input.status,
        });

        const savedEnrollment =
            await this.enrollmentRepository.create(newEnrollment);

        return EnrollmentResponseDto.fromEntity(savedEnrollment);
    }
}