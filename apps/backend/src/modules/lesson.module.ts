import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateLessonUseCase } from '../domain/usecases/lesson-usecases/create-lesson.usecase';
import { DeleteLessonUseCase } from '../domain/usecases/lesson-usecases/delete-lesson.usecase';
import { GetLessonUseCase } from '../domain/usecases/lesson-usecases/get-lesson.usecase';
import { ListLessonsUseCase } from '../domain/usecases/lesson-usecases/list-lessons.usecase';
import { UpdateLessonUseCase } from '../domain/usecases/lesson-usecases/update-lesson.usecase';
import { LessonController } from '../infrastructure/http/controllers/lesson.controller';
import { LessonOrmEntity } from '../infrastructure/database/orm/lesson.orm-entity';
import { TypeOrmLessonRepository } from '../infrastructure/database/typeorm/repositories/typeorm-lesson.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([LessonOrmEntity]),
  ],
  controllers: [LessonController],
  providers: [
    CreateLessonUseCase,
    GetLessonUseCase,
    ListLessonsUseCase,
    UpdateLessonUseCase,
    DeleteLessonUseCase,
    {
      provide: 'ILessonRepository',
      useClass: TypeOrmLessonRepository,
    },
  ],
  exports: [
    CreateLessonUseCase,
    GetLessonUseCase,
    'ILessonRepository',
  ],
})
export class LessonModule { }
