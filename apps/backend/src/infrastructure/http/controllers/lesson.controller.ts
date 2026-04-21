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
import { UserRole } from '../../../domain/entities/user.entity';
import { CreateLessonDto } from '../../../application/dto/lesson-dtos/create-lesson.dto';
import { DeleteLessonDto } from '../../../application/dto/lesson-dtos/delete-lesson.dto';
import { GetLessonDto } from '../../../application/dto/lesson-dtos/get-lesson.dto';
import { ListLessonsDto } from '../../../application/dto/lesson-dtos/list-lessons.dto';
import { UpdateLessonDto } from '../../../application/dto/lesson-dtos/update-lesson.dto';
import { CreateLessonUseCase } from '../../../domain/usecases/lesson-usecases/create-lesson.usecase';
import { DeleteLessonUseCase } from '../../../domain/usecases/lesson-usecases/delete-lesson.usecase';
import { GetLessonUseCase } from '../../../domain/usecases/lesson-usecases/get-lesson.usecase';
import { ListLessonsUseCase } from '../../../domain/usecases/lesson-usecases/list-lessons.usecase';
import { UpdateLessonUseCase } from '../../../domain/usecases/lesson-usecases/update-lesson.usecase';

@Controller('lessons')
export class LessonController {
  constructor(
    private readonly createLessonUseCase: CreateLessonUseCase,
    private readonly deleteLessonUseCase: DeleteLessonUseCase,
    private readonly getLessonUseCase: GetLessonUseCase,
    private readonly listLessonsUseCase: ListLessonsUseCase,
    private readonly updateLessonUseCase: UpdateLessonUseCase,
  ) { }

  // POST /lessons
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @Post()
  async create(@Body() body: CreateLessonDto) {
    return await this.createLessonUseCase.execute(body);
  }

  // GET /lessons/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    const dto: GetLessonDto = { id };
    return await this.getLessonUseCase.execute(dto);
  }

  // GET /lessons?courseId=...
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@Query() query: ListLessonsDto) {
    return await this.listLessonsUseCase.execute(query);
  }

  // PATCH /lessons/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateLessonDto) {
    return await this.updateLessonUseCase.execute(id, body);
  }

  // DELETE /lessons/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const dto: DeleteLessonDto = { id };
    return await this.deleteLessonUseCase.execute(dto);
  }
}
