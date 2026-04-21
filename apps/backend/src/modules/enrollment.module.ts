import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateEnrollmentUseCase } from '../domain/usecases/enrollment-usecases/create-enrollment.usecase';
import { DeleteEnrollmentUseCase } from '../domain/usecases/enrollment-usecases/delete-enrollment.usecase';
import { GetEnrollmentUseCase } from '../domain/usecases/enrollment-usecases/get-enrollment.usecase';
import { ListEnrollmentsUseCase } from '../domain/usecases/enrollment-usecases/list-enrollments.usecase';
import { UpdateEnrollmentUseCase } from '../domain/usecases/enrollment-usecases/update-enrollment.usecase';
import { EnrollmentController } from '../infrastructure/http/controllers/enrollment.controller';
import { EnrollmentOrmEntity } from '../infrastructure/database/orm/enrollment.orm-entity';
import { TypeOrmEnrollmentRepository } from '../infrastructure/database/typeorm/repositories/typeorm-enrollment.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([EnrollmentOrmEntity]),
  ],
  controllers: [EnrollmentController],
  providers: [
    CreateEnrollmentUseCase,
    GetEnrollmentUseCase,
    ListEnrollmentsUseCase,
    UpdateEnrollmentUseCase,
    DeleteEnrollmentUseCase,
    {
      provide: 'IEnrollmentRepository',
      useClass: TypeOrmEnrollmentRepository,
    },
  ],
  exports: [
    CreateEnrollmentUseCase,
    GetEnrollmentUseCase,
    'IEnrollmentRepository',
  ],
})
export class EnrollmentModule { }
