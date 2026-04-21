import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateLessonProgressUseCase } from '../domain/usecases/lessonProgress-usecases/create-lessonProgress.usecase';
import { DeleteLessonProgressUseCase } from '../domain/usecases/lessonProgress-usecases/delete-lessonProgress.usecase';
import { GetLessonProgressUseCase } from '../domain/usecases/lessonProgress-usecases/get-lessonProgress.usecase';
import { ListLessonProgressUseCase } from '../domain/usecases/lessonProgress-usecases/list-lessonProgress.usecase';
import { UpdateLessonProgressUseCase } from '../domain/usecases/lessonProgress-usecases/update-lessonProgress.usecase';
import { LessonProgressController } from '../infrastructure/http/controllers/lessonProgress.controller';
import { LessonProgressOrmEntity } from '../infrastructure/database/orm/lessonProgress.orm-entity';
import { TypeOrmLessonProgressRepository } from '../infrastructure/database/typeorm/repositories/typeorm-lessonProgress.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([LessonProgressOrmEntity]),
  ],
  controllers: [LessonProgressController],
  providers: [
    CreateLessonProgressUseCase,
    GetLessonProgressUseCase,
    ListLessonProgressUseCase,
    UpdateLessonProgressUseCase,
    DeleteLessonProgressUseCase,
    {
      provide: 'ILessonProgressRepository',
      useClass: TypeOrmLessonProgressRepository,
    },
  ],
  exports: [
    CreateLessonProgressUseCase,
    GetLessonProgressUseCase,
  ],
})
export class LessonProgressModule { }
