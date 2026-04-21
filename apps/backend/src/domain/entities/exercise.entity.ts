export interface ExerciseProps {
  id?: string; // PK
  lessonId: string; // FK -> Lesson
  title: string;
  description: string;
  notebookPath?: string | null;
  notebookFileName?: string | null;
  notebookMimeType?: string | null;
  notebookSize?: number | null;
  createdAt?: Date;
}

export class ExerciseEntity {
  public readonly id?: string;
  public readonly lessonId: string;
  public title: string;
  public description: string;
  public notebookPath: string | null;
  public notebookFileName: string | null;
  public notebookMimeType: string | null;
  public notebookSize: number | null;
  public readonly createdAt: Date;

  constructor(props: ExerciseProps) {
    this.id = props.id;
    this.lessonId = props.lessonId;
    this.title = props.title;
    this.description = props.description;
    this.notebookPath = props.notebookPath ?? null;
    this.notebookFileName = props.notebookFileName ?? null;
    this.notebookMimeType = props.notebookMimeType ?? null;
    this.notebookSize = props.notebookSize ?? null;
    this.createdAt = props.createdAt ?? new Date();
  }
}
