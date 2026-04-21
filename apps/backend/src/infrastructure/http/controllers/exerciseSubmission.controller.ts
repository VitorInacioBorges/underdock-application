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
import { CreateExerciseSubmissionDto } from '../../../application/dto/exerciseSubmission-dtos/create-exerciseSubmission.dto';
import { DeleteExerciseSubmissionDto } from '../../../application/dto/exerciseSubmission-dtos/delete-exerciseSubmission.dto';
import { GetExerciseSubmissionDto } from '../../../application/dto/exerciseSubmission-dtos/get-exerciseSubmission.dto';
import { ListExerciseSubmissionsDto } from '../../../application/dto/exerciseSubmission-dtos/list-exerciseSubmissions.dto';
import { UpdateExerciseSubmissionDto } from '../../../application/dto/exerciseSubmission-dtos/update-exerciseSubmission.dto';
import { CreateExerciseSubmissionUseCase } from '../../../domain/usecases/exerciseSubmission-usecases/create-exerciseSubmission.usecase';
import { DeleteExerciseSubmissionUseCase } from '../../../domain/usecases/exerciseSubmission-usecases/delete-exerciseSubmission.usecase';
import { GetExerciseSubmissionUseCase } from '../../../domain/usecases/exerciseSubmission-usecases/get-exerciseSubmission.usecase';
import { ListExerciseSubmissionsUseCase } from '../../../domain/usecases/exerciseSubmission-usecases/list-exerciseSubmissions.usecase';
import { UpdateExerciseSubmissionUseCase } from '../../../domain/usecases/exerciseSubmission-usecases/update-exerciseSubmission.usecase';

@Controller('exercise-submissions')
export class ExerciseSubmissionController {
  constructor(
    private readonly createExerciseSubmissionUseCase: CreateExerciseSubmissionUseCase,
    private readonly deleteExerciseSubmissionUseCase: DeleteExerciseSubmissionUseCase,
    private readonly getExerciseSubmissionUseCase: GetExerciseSubmissionUseCase,
    private readonly listExerciseSubmissionsUseCase: ListExerciseSubmissionsUseCase,
    private readonly updateExerciseSubmissionUseCase: UpdateExerciseSubmissionUseCase,
  ) { }

  // POST /exercise-submissions
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() body: CreateExerciseSubmissionDto) {
    return await this.createExerciseSubmissionUseCase.execute(body);
  }

  // GET /exercise-submissions/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    const dto: GetExerciseSubmissionDto = { id };
    return await this.getExerciseSubmissionUseCase.execute(dto);
  }

  // GET /exercise-submissions?exerciseId=...&userId=...&status=...
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @Get()
  async findAll(@Query() query: ListExerciseSubmissionsDto) {
    return await this.listExerciseSubmissionsUseCase.execute(query);
  }

  // PATCH /exercise-submissions/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateExerciseSubmissionDto,
  ) {
    return await this.updateExerciseSubmissionUseCase.execute(id, body);
  }

  // DELETE /exercise-submissions/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const dto: DeleteExerciseSubmissionDto = { id };
    return await this.deleteExerciseSubmissionUseCase.execute(dto);
  }
}
