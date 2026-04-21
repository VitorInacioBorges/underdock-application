import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCourseUseCase } from '../domain/usecases/course-usecases/create-course.usecase';
import { DeleteCourseUseCase } from '../domain/usecases/course-usecases/delete-course.usecase';
import { GetCourseUseCase } from '../domain/usecases/course-usecases/get-course.usecase';
import { ListCoursesUseCase } from '../domain/usecases/course-usecases/list-courses.usecase';
import { UpdateCourseUseCase } from '../domain/usecases/course-usecases/update-course.usecase';
import { CourseController } from '../infrastructure/http/controllers/course.controller';
import { CourseOrmEntity } from '../infrastructure/database/orm/course.orm-entity';
import { TypeOrmCourseRepository } from '../infrastructure/database/typeorm/repositories/typeorm-course.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseOrmEntity]),
  ],
  controllers: [CourseController],
  providers: [
    CreateCourseUseCase,
    GetCourseUseCase,
    ListCoursesUseCase,
    UpdateCourseUseCase,
    DeleteCourseUseCase,
    {
      provide: 'ICourseRepository',
      useClass: TypeOrmCourseRepository,
    },
  ],
  exports: [
    CreateCourseUseCase,
    GetCourseUseCase,
  ],
})
export class CourseModule { }
