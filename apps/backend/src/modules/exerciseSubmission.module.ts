import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateExerciseSubmissionUseCase } from '../domain/usecases/exerciseSubmission-usecases/create-exerciseSubmission.usecase';
import { DeleteExerciseSubmissionUseCase } from '../domain/usecases/exerciseSubmission-usecases/delete-exerciseSubmission.usecase';
import { GetExerciseSubmissionUseCase } from '../domain/usecases/exerciseSubmission-usecases/get-exerciseSubmission.usecase';
import { ListExerciseSubmissionsUseCase } from '../domain/usecases/exerciseSubmission-usecases/list-exerciseSubmissions.usecase';
import { UpdateExerciseSubmissionUseCase } from '../domain/usecases/exerciseSubmission-usecases/update-exerciseSubmission.usecase';
import { ExerciseSubmissionController } from '../infrastructure/http/controllers/exerciseSubmission.controller';
import { ExerciseSubmissionOrmEntity } from '../infrastructure/database/orm/exerciseSubmission.orm-entity';
import { TypeOrmExerciseSubmissionRepository } from '../infrastructure/database/typeorm/repositories/typeorm-exerciseSubmission.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExerciseSubmissionOrmEntity]),
  ],
  controllers: [ExerciseSubmissionController],
  providers: [
    CreateExerciseSubmissionUseCase,
    GetExerciseSubmissionUseCase,
    ListExerciseSubmissionsUseCase,
    UpdateExerciseSubmissionUseCase,
    DeleteExerciseSubmissionUseCase,
    {
      provide: 'IExerciseSubmissionRepository',
      useClass: TypeOrmExerciseSubmissionRepository,
    },
  ],
  exports: [
    CreateExerciseSubmissionUseCase,
    GetExerciseSubmissionUseCase,
  ],
})
export class ExerciseSubmissionModule { }
