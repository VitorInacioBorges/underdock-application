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
import { CreateSelfEnrollmentDto } from '../../../application/dto/enrollment-dtos/create-self-enrollment.dto';
import { EnrollmentRole, EnrollmentStatus } from '../../../domain/entities/enrollment.entity';
import { CreateEnrollmentDto } from '../../../application/dto/enrollment-dtos/create-enrollment.dto';
import { DeleteEnrollmentDto } from '../../../application/dto/enrollment-dtos/delete-enrollment.dto';
import { GetEnrollmentDto } from '../../../application/dto/enrollment-dtos/get-enrollment.dto';
import { ListEnrollmentsDto } from '../../../application/dto/enrollment-dtos/list-enrollment.dto';
import { UpdateEnrollmentDto } from '../../../application/dto/enrollment-dtos/update-enrollment.dto';
import { CreateEnrollmentUseCase } from '../../../domain/usecases/enrollment-usecases/create-enrollment.usecase';
import { DeleteEnrollmentUseCase } from '../../../domain/usecases/enrollment-usecases/delete-enrollment.usecase';
import { GetEnrollmentUseCase } from '../../../domain/usecases/enrollment-usecases/get-enrollment.usecase';
import { ListEnrollmentsUseCase } from '../../../domain/usecases/enrollment-usecases/list-enrollments.usecase';
import { UpdateEnrollmentUseCase } from '../../../domain/usecases/enrollment-usecases/update-enrollment.usecase';
import { GetUser } from '../../../infrastructure/auth/decorators/get-user.decorator';
import { UserEntity } from '../../../domain/entities/user.entity';



@Controller('enrollments')
export class EnrollmentController {
  constructor(
    private readonly createEnrollmentUseCase: CreateEnrollmentUseCase,
    private readonly deleteEnrollmentUseCase: DeleteEnrollmentUseCase,
    private readonly getEnrollmentUseCase: GetEnrollmentUseCase,
    private readonly listEnrollmentsUseCase: ListEnrollmentsUseCase,
    private readonly updateEnrollmentUseCase: UpdateEnrollmentUseCase,
  ) { }

  // POST /enrollments
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() body: CreateSelfEnrollmentDto,
    @GetUser() user: UserEntity,
  ) {
    const dto: CreateEnrollmentDto = {
      userId: user.id!,
      courseId: body.courseId,
      role: EnrollmentRole.student,
      status: EnrollmentStatus.active,
    };

    return await this.createEnrollmentUseCase.execute(dto);
  }


  // GET /enrollments/:id
  @Get(':id')
  async findById(@Param('id') id: string) {
    const dto: GetEnrollmentDto = { id };
    return await this.getEnrollmentUseCase.execute(dto);
  }

  // GET /enrollments?userId=...&courseId=...
  @Get()
  async findAll(@Query() query: ListEnrollmentsDto) {
    return await this.listEnrollmentsUseCase.execute(query);
  }

  // PATCH /enrollments/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateEnrollmentDto) {
    return await this.updateEnrollmentUseCase.execute(id, body);
  }

  // DELETE /enrollments/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const dto: DeleteEnrollmentDto = { id };
    return await this.deleteEnrollmentUseCase.execute(dto);
  }
}
