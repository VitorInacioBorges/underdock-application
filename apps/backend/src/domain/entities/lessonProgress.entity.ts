export interface LessonProgressProps {
  id?: string; // PK
  userId: string; // FK -> User
  lessonId: string; // FK -> Lesson
  watched: boolean;
  watchedAt?: Date;
}

export class LessonProgressEntity {
  public readonly id?: string;
  public readonly userId: string;
  public readonly lessonId: string;
  public watched: boolean;
  public watchedAt: Date;

  constructor(props: LessonProgressProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.lessonId = props.lessonId;
    this.watched = props.watched;
    this.watchedAt = props.watchedAt ?? new Date();
  }
}
