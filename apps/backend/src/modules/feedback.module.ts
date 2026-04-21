import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateFeedbackUseCase } from '../domain/usecases/feedback-usecases/create-feedback.usecase';
import { DeleteFeedbackUseCase } from '../domain/usecases/feedback-usecases/delete-feedback.usecase';
import { GetFeedbackUseCase } from '../domain/usecases/feedback-usecases/get-feedback.usecase';
import { ListFeedbacksUseCase } from '../domain/usecases/feedback-usecases/list-feedbacks.usecase';
import { UpdateFeedbackUseCase } from '../domain/usecases/feedback-usecases/update-feedback.usecase';
import { FeedbackController } from '../infrastructure/http/controllers/feedback.controller';
import { FeedbackOrmEntity } from '../infrastructure/database/orm/feedback.orm-entity';
import { TypeOrmFeedbackRepository } from '../infrastructure/database/typeorm/repositories/typeorm-feedback.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedbackOrmEntity]),
  ],
  controllers: [FeedbackController],
  providers: [
    CreateFeedbackUseCase,
    GetFeedbackUseCase,
    ListFeedbacksUseCase,
    UpdateFeedbackUseCase,
    DeleteFeedbackUseCase,
    {
      provide: 'IFeedbackRepository',
      useClass: TypeOrmFeedbackRepository,
    },
  ],
  exports: [
    CreateFeedbackUseCase,
    GetFeedbackUseCase,
  ],
})
export class FeedbackModule { }
