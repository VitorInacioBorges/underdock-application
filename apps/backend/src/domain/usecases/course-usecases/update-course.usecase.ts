import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCourseDto } from '../../../application/dto/course-dtos/update-course.dto';
import { CourseResponseDto } from '../../../application/dto/course-dtos/course-response.dto';
import type { ICourseRepository } from '../../repositories/course.repository';

@Injectable()
export class UpdateCourseUseCase {
    constructor(
        @Inject('ICourseRepository')
        private readonly courseRepository: ICourseRepository,
    ) { }

    async execute(
        id: string,
        input: UpdateCourseDto,
    ): Promise<CourseResponseDto> {
        const course = await this.courseRepository.findById(id);

        if (!course) {
            throw new NotFoundException('Curso não encontrado.');
        }

        if (input.title !== undefined) {
            course.title = input.title;
        }
        if (input.description !== undefined) {
            course.description = input.description;
        }
        if (input.isPublished !== undefined) {
            input.isPublished ? course.publish() : course.unpublish();
        }

        const updatedCourse = await this.courseRepository.update(course);

        return CourseResponseDto.fromEntity(updatedCourse);
    }
}
