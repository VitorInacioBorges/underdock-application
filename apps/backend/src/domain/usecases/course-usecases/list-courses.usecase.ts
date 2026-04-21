import { Inject, Injectable } from '@nestjs/common';
import { ListCoursesDto } from '../../../application/dto/course-dtos/list-courses.dto';
import { CourseResponseDto } from '../../../application/dto/course-dtos/course-response.dto';
import type { ICourseRepository } from '../../repositories/course.repository';

@Injectable()
export class ListCoursesUseCase {
    constructor(
        @Inject('ICourseRepository')
        private readonly courseRepository: ICourseRepository,
    ) { }

    async execute(input: ListCoursesDto): Promise<CourseResponseDto[]> {
        // isPublished chega como string da query (?isPublished=true)
        const courses =
            input.isPublished === 'true'
                ? await this.courseRepository.findPublished()
                : await this.courseRepository.findAll();

        return courses.map((course) => CourseResponseDto.fromEntity(course));
    }
}
