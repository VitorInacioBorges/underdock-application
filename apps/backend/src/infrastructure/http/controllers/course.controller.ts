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
import { CreateCourseDto } from '../../../application/dto/course-dtos/create-course.dto';
import { DeleteCourseDto } from '../../../application/dto/course-dtos/delete-couse.dto';
import { GetCourseDto } from '../../../application/dto/course-dtos/get-course.dto';
import { ListCoursesDto } from '../../../application/dto/course-dtos/list-courses.dto';
import { UpdateCourseDto } from '../../../application/dto/course-dtos/update-course.dto';
import { CreateCourseUseCase } from '../../../domain/usecases/course-usecases/create-course.usecase';
import { DeleteCourseUseCase } from '../../../domain/usecases/course-usecases/delete-course.usecase';
import { GetCourseUseCase } from '../../../domain/usecases/course-usecases/get-course.usecase';
import { ListCoursesUseCase } from '../../../domain/usecases/course-usecases/list-courses.usecase';
import { UpdateCourseUseCase } from '../../../domain/usecases/course-usecases/update-course.usecase';

@Controller('courses')
export class CourseController {
  constructor(
    private readonly createCourseUseCase: CreateCourseUseCase,
    private readonly deleteCourseUseCase: DeleteCourseUseCase,
    private readonly getCourseUseCase: GetCourseUseCase,
    private readonly listCoursesUseCase: ListCoursesUseCase,
    private readonly updateCourseUseCase: UpdateCourseUseCase,
  ) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  // POST /courses
  @Post()
  async create(@Body() body: CreateCourseDto) {
    return await this.createCourseUseCase.execute(body);
  }

  // GET /courses/:id
  @Get(':id')
  async findById(@Param('id') id: string) {
    const dto: GetCourseDto = { id };
    return await this.getCourseUseCase.execute(dto);
  }

  // GET /courses?isPublished=true
  @Get()
  async findAll(@Query() query: ListCoursesDto) {
    return await this.listCoursesUseCase.execute(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  // PATCH /courses/:id
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateCourseDto) {
    return await this.updateCourseUseCase.execute(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  // DELETE /courses/:id
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const dto: DeleteCourseDto = { id };
    return await this.deleteCourseUseCase.execute(dto);
  }
}
