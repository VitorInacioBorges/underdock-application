import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteCourseDto } from '../../../application/dto/course-dtos/delete-couse.dto';
import type { ICourseRepository } from '../../repositories/course.repository';

@Injectable()
export class DeleteCourseUseCase {
    constructor(
        @Inject('ICourseRepository')
        private readonly courseRepository: ICourseRepository,
    ) { }

    async execute(input: DeleteCourseDto): Promise<void> {
        const course = await this.courseRepository.findById(input.id);

        if (!course) {
            throw new NotFoundException('Curso não encontrado.');
        }

        await this.courseRepository.delete(input.id);
    }
}
