import { UserRole } from '../../../domain/entities/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CreateFeedbackDto } from '../../../application/dto/feedback-dtos/create-feedback.dto';
import { DeleteFeedbackDto } from '../../../application/dto/feedback-dtos/delete-feedback.dto';
import { GetFeedbackDto } from '../../../application/dto/feedback-dtos/get-feedback.dto';
import { ListFeedbacksDto } from '../../../application/dto/feedback-dtos/list-feedbacks.dto';
import { UpdateFeedbackDto } from '../../../application/dto/feedback-dtos/update-feedback.dto';
import { CreateFeedbackUseCase } from '../../../domain/usecases/feedback-usecases/create-feedback.usecase';
import { DeleteFeedbackUseCase } from '../../../domain/usecases/feedback-usecases/delete-feedback.usecase';
import { GetFeedbackUseCase } from '../../../domain/usecases/feedback-usecases/get-feedback.usecase';
import { ListFeedbacksUseCase } from '../../../domain/usecases/feedback-usecases/list-feedbacks.usecase';
import { UpdateFeedbackUseCase } from '../../../domain/usecases/feedback-usecases/update-feedback.usecase';

@Controller('feedbacks')
export class FeedbackController {
  constructor(
    private readonly createFeedbackUseCase: CreateFeedbackUseCase,
    private readonly deleteFeedbackUseCase: DeleteFeedbackUseCase,
    private readonly getFeedbackUseCase: GetFeedbackUseCase,
    private readonly listFeedbacksUseCase: ListFeedbacksUseCase,
    private readonly updateFeedbackUseCase: UpdateFeedbackUseCase,
  ) { }

  // POST /feedbacks
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @Post()
  async create(@Body() body: CreateFeedbackDto) {
    return await this.createFeedbackUseCase.execute(body);
  }

  // GET /feedbacks/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    const dto: GetFeedbackDto = { id };
    return await this.getFeedbackUseCase.execute(dto);
  }

  // GET /feedbacks?submissionId=...&instructorId=...
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @Get()
  async findAll(@Query() query: ListFeedbacksDto) {
    return await this.listFeedbacksUseCase.execute(query);
  }


  // PATCH /feedbacks/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateFeedbackDto) {
    return await this.updateFeedbackUseCase.execute(id, body);
  }

  // DELETE /feedbacks/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const dto: DeleteFeedbackDto = { id };
    return await this.deleteFeedbackUseCase.execute(dto);
  }
}
