import { Inject, Injectable } from '@nestjs/common';
import { CreateCourseDto } from '../../../application/dto/course-dtos/create-course.dto';
import { CourseResponseDto } from '../../../application/dto/course-dtos/course-response.dto';
import { CourseEntity } from '../../entities/course.entity';
import type { ICourseRepository } from '../../repositories/course.repository';

@Injectable()
export class CreateCourseUseCase {
    constructor(
        @Inject('ICourseRepository')
        private readonly courseRepository: ICourseRepository,
    ) { }

    async execute(input: CreateCourseDto): Promise<CourseResponseDto> {
        const newCourse = new CourseEntity({
            title: input.title,
            description: input.description,
        });

        const savedCourse = await this.courseRepository.create(newCourse);

        return CourseResponseDto.fromEntity(savedCourse);
    }
}