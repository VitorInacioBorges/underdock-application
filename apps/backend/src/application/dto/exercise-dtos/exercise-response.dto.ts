import { ExerciseEntity } from '../../../domain/entities/exercise.entity';

export class ExerciseResponseDto {
    id: string;
    lessonId: string;
    title: string;
    description: string;
    notebookPath: string | null;
    notebookFileName: string | null;
    notebookMimeType: string | null;
    notebookSize: number | null;
    createdAt: string;

    static fromEntity(exercise: ExerciseEntity): ExerciseResponseDto {
        const response = new ExerciseResponseDto();
        response.id = exercise.id!;
        response.lessonId = exercise.lessonId;
        response.title = exercise.title;
        response.description = exercise.description;
        response.notebookPath = exercise.notebookPath;
        response.notebookFileName = exercise.notebookFileName;
        response.notebookMimeType = exercise.notebookMimeType;
        response.notebookSize = exercise.notebookSize;
        response.createdAt = (exercise.createdAt ?? new Date()).toISOString();

        return response;
    }
}
