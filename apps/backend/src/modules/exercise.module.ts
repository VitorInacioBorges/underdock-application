import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateExerciseUseCase } from '../domain/usecases/exercise-usecases/create-exercise.usecase';
import { DeleteExerciseUseCase } from '../domain/usecases/exercise-usecases/delete-exercise.usecase';
import { GetExerciseUseCase } from '../domain/usecases/exercise-usecases/get-exercise.usecase';
import { ListExercisesUseCase } from '../domain/usecases/exercise-usecases/list-exercises.usecase';
import { UpdateExerciseUseCase } from '../domain/usecases/exercise-usecases/update-exercise.usecase';
import { ExerciseController } from '../infrastructure/http/controllers/exercise.controller';
import { ExerciseOrmEntity } from '../infrastructure/database/orm/exercise.orm-entity';
import { TypeOrmExerciseRepository } from '../infrastructure/database/typeorm/repositories/typeorm-exercise.repository';
import { LessonModule } from './lesson.module';
import { EnrollmentModule } from './enrollment.module';
import { DownloadExerciseNotebookUseCase } from '../domain/usecases/exercise-usecases/download-exercise-notebook.usecase';


@Module({
  imports: [
    TypeOrmModule.forFeature([ExerciseOrmEntity]),
    LessonModule,
    EnrollmentModule,
  ],
  controllers: [ExerciseController],
  providers: [
    CreateExerciseUseCase,
    GetExerciseUseCase,
    ListExercisesUseCase,
    UpdateExerciseUseCase,
    DeleteExerciseUseCase,
    DownloadExerciseNotebookUseCase,

    {
      provide: 'IExerciseRepository',
      useClass: TypeOrmExerciseRepository,
    },
  ],
  exports: [
    CreateExerciseUseCase,
    GetExerciseUseCase,
  ],
})
export class ExerciseModule { }
