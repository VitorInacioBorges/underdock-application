import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '../../../domain/entities/user.entity';
import type { IExerciseRepository } from '../../repositories/exercise.repository';
import type { ILessonRepository } from '../../repositories/lesson.repository';
import type { IEnrollmentRepository } from '../../repositories/enrollment.repository';
import { existsSync } from 'fs';

export interface DownloadNotebookInput {
  exerciseId: string;
  userId: string;
  userRole: UserRole;
}

@Injectable()
export class DownloadExerciseNotebookUseCase {
  constructor(
    @Inject('IExerciseRepository')
    private readonly exerciseRepository: IExerciseRepository,
    @Inject('ILessonRepository')
    private readonly lessonRepository: ILessonRepository,
    @Inject('IEnrollmentRepository')
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async execute(input: DownloadNotebookInput): Promise<{ path: string; fileName: string }> {
    const exercise = await this.exerciseRepository.findById(input.exerciseId);
    if (!exercise || !exercise.notebookPath) {
      throw new NotFoundException('Notebook não encontrado para este exercício.');
    }

    if (!existsSync(exercise.notebookPath)) {
      throw new NotFoundException('Arquivo do notebook não encontrado no servidor.');
    }

    // Se for admin, pula verificação de matrícula
    if (input.userRole === UserRole.admin) {
      return { path: exercise.notebookPath, fileName: exercise.notebookFileName || 'notebook.ipynb' };
    }

    // Busca a lição para saber qual é o curso
    const lesson = await this.lessonRepository.findById(exercise.lessonId);
    if (!lesson) {
        throw new NotFoundException('Lição vinculada ao exercício não encontrada.');
    }

    // Verifica se o aluno está matriculado no curso
    const enrollment = await this.enrollmentRepository.findByUserAndCourse(
      input.userId,
      lesson.courseId,
    );

    if (!enrollment) {
      throw new ForbiddenException('Você precisa estar matriculado no curso para acessar este notebook.');
    }

    return { path: exercise.notebookPath, fileName: exercise.notebookFileName || 'notebook.ipynb' };
  }
}
