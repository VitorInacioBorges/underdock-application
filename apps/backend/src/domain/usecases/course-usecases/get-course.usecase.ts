import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetCourseDto } from '../../../application/dto/course-dtos/get-course.dto';
import { CourseResponseDto } from '../../../application/dto/course-dtos/course-response.dto';
import type { ICourseRepository } from '../../repositories/course.repository';

@Injectable()
export class GetCourseUseCase {
    constructor(
        @Inject('ICourseRepository')
        private readonly courseRepository: ICourseRepository,
    ) { }

    async execute(input: GetCourseDto): Promise<CourseResponseDto> {
        const course = await this.courseRepository.findById(input.id);

        if (!course) {
            throw new NotFoundException('Curso não encontrado.');
        }

        return CourseResponseDto.fromEntity(course);
    }
}
