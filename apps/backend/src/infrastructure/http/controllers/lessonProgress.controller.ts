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
import { CreateLessonProgressDto } from '../../../application/dto/lessonProgress-dtos/create-lessonProgress.dto';
import { DeleteLessonProgressDto } from '../../../application/dto/lessonProgress-dtos/delete-lessonProgress.dto';
import { GetLessonProgressDto } from '../../../application/dto/lessonProgress-dtos/get-lessonProgress.dto';
import { ListLessonProgressDto } from '../../../application/dto/lessonProgress-dtos/list-lessonProgress.dto';
import { UpdateLessonProgressDto } from '../../../application/dto/lessonProgress-dtos/update-lessonProgress.dto';
import { CreateLessonProgressUseCase } from '../../../domain/usecases/lessonProgress-usecases/create-lessonProgress.usecase';
import { DeleteLessonProgressUseCase } from '../../../domain/usecases/lessonProgress-usecases/delete-lessonProgress.usecase';
import { GetLessonProgressUseCase } from '../../../domain/usecases/lessonProgress-usecases/get-lessonProgress.usecase';
import { ListLessonProgressUseCase } from '../../../domain/usecases/lessonProgress-usecases/list-lessonProgress.usecase';
import { UpdateLessonProgressUseCase } from '../../../domain/usecases/lessonProgress-usecases/update-lessonProgress.usecase';

@Controller('lesson-progress')
export class LessonProgressController {
  constructor(
    private readonly createLessonProgressUseCase: CreateLessonProgressUseCase,
    private readonly deleteLessonProgressUseCase: DeleteLessonProgressUseCase,
    private readonly getLessonProgressUseCase: GetLessonProgressUseCase,
    private readonly listLessonProgressUseCase: ListLessonProgressUseCase,
    private readonly updateLessonProgressUseCase: UpdateLessonProgressUseCase,
  ) { }

  // POST /lesson-progress
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() body: CreateLessonProgressDto) {
    return await this.createLessonProgressUseCase.execute(body);
  }

  // GET /lesson-progress/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    const dto: GetLessonProgressDto = { id };
    return await this.getLessonProgressUseCase.execute(dto);
  }

  // GET /lesson-progress?userId=...&lessonId=...
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@Query() query: ListLessonProgressDto) {
    return await this.listLessonProgressUseCase.execute(query);
  }

  // PATCH /lesson-progress/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateLessonProgressDto,
  ) {
    return await this.updateLessonProgressUseCase.execute(id, body);
  }

  // DELETE /lesson-progress/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const dto: DeleteLessonProgressDto = { id };
    return await this.deleteLessonProgressUseCase.execute(dto);
  }
}
