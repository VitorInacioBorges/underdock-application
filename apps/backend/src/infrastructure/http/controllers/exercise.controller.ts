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
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { randomUUID } from 'crypto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CreateExerciseDto } from '../../../application/dto/exercise-dtos/create-exercise.dto';
import { DeleteExerciseDto } from '../../../application/dto/exercise-dtos/delete-exercise.dto';
import { GetExerciseDto } from '../../../application/dto/exercise-dtos/get-exercise.dto';
import { ListExercisesDto } from '../../../application/dto/exercise-dtos/list-exercises.dto';
import { UpdateExerciseDto } from '../../../application/dto/exercise-dtos/update-exercise.dto';
import { CreateExerciseUseCase } from '../../../domain/usecases/exercise-usecases/create-exercise.usecase';
import { DeleteExerciseUseCase } from '../../../domain/usecases/exercise-usecases/delete-exercise.usecase';
import { GetExerciseUseCase } from '../../../domain/usecases/exercise-usecases/get-exercise.usecase';
import { ListExercisesUseCase } from '../../../domain/usecases/exercise-usecases/list-exercises.usecase';
import { UpdateExerciseUseCase } from '../../../domain/usecases/exercise-usecases/update-exercise.usecase';
import { DownloadExerciseNotebookUseCase } from '../../../domain/usecases/exercise-usecases/download-exercise-notebook.usecase';
import { GetUser } from '../../../infrastructure/auth/decorators/get-user.decorator';
import type { UserEntity } from '../../../domain/entities/user.entity';
import { readFileSync } from 'fs';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

const UPLOAD_DIR = join(process.cwd(), 'uploads', 'notebooks');

// Garante que o diretório de uploads existe
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

const notebookStorage = diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

@Controller('exercises')
export class ExerciseController {
  constructor(
    private readonly createExerciseUseCase: CreateExerciseUseCase,
    private readonly deleteExerciseUseCase: DeleteExerciseUseCase,
    private readonly getExerciseUseCase: GetExerciseUseCase,
    private readonly listExercisesUseCase: ListExercisesUseCase,
    private readonly updateExerciseUseCase: UpdateExerciseUseCase,
    private readonly downloadExerciseNotebookUseCase: DownloadExerciseNotebookUseCase,
  ) { }


  // POST /exercises (multipart/form-data com notebook opcional)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @Post()
  @UseInterceptors(FileInterceptor('notebook', { storage: notebookStorage }))
  async create(
    @Body() body: CreateExerciseDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      body.notebookPath = file.path;
      body.notebookFileName = file.originalname;
      body.notebookMimeType = file.mimetype;
      body.notebookSize = file.size;
    }
    return await this.createExerciseUseCase.execute(body);
  }

  // GET /exercises/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    const dto: GetExerciseDto = { id };
    return await this.getExerciseUseCase.execute(dto);
  }

  // GET /exercises?lessonId=...
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@Query() query: ListExercisesDto) {
    return await this.listExercisesUseCase.execute(query);
  }

  // GET /exercises/:id/notebook
  @UseGuards(JwtAuthGuard)
  @Get(':id/notebook')
  async downloadNotebook(
    @Param('id') id: string,
    @GetUser() user: UserEntity,
    @Res() res: Response,
  ) {
    if (!user?.id) {
      throw new UnauthorizedException('Usuário não autenticado.');
    }

    const { path, fileName } =
      await this.downloadExerciseNotebookUseCase.execute({
        exerciseId: id,
        userId: user.id,
        userRole: user.role,
      });

    return res.download(path, fileName);
  }

  // GET /exercises/:id/notebook-content
  @UseGuards(JwtAuthGuard)
  @Get(':id/notebook-content')
  async getNotebookContent(
    @Param('id') id: string,
    @GetUser() user: UserEntity,
  ) {
    if (!user?.id) {
      throw new UnauthorizedException('Usuário não autenticado.');
    }

    const { path } = await this.downloadExerciseNotebookUseCase.execute({
      exerciseId: id,
      userId: user.id,
      userRole: user.role,
    });

    if (!path || !existsSync(path)) {
      throw new BadRequestException('Notebook não encontrado no servidor.');
    }

    const raw = readFileSync(path, 'utf-8');

    try {
      return JSON.parse(raw);
    } catch {
      throw new BadRequestException('O arquivo do notebook está inválido.');
    }
  }

  // PATCH /exercises/:id (multipart/form-data com notebook opcional)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('notebook', { storage: notebookStorage }))
  async update(
    @Param('id') id: string,
    @Body() body: UpdateExerciseDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // Se um novo arquivo for enviado, remover o anterior do disco
    if (file) {
      try {
        const existing = await this.getExerciseUseCase.execute({ id });
        if (existing?.notebookPath) {
          try { unlinkSync(existing.notebookPath); } catch { /* arquivo pode não existir */ }
        }
      } catch { /* exercício pode não existir ainda */ }

      body.notebookPath = file.path;
      body.notebookFileName = file.originalname;
      body.notebookMimeType = file.mimetype;
      body.notebookSize = file.size;
    }
    return await this.updateExerciseUseCase.execute(id, body);
  }

  // DELETE /exercises/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    // Tenta remover o notebook do disco antes de deletar do banco
    try {
      const exercise = await this.getExerciseUseCase.execute({ id });
      if (exercise?.notebookPath) {
        try { unlinkSync(exercise.notebookPath); } catch { /* ignorado */ }
      }
    } catch { /* exercício pode não existir, segue para delete */ }

    const dto: DeleteExerciseDto = { id };
    return await this.deleteExerciseUseCase.execute(dto);
  }
}
