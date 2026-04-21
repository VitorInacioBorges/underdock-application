export interface FeedbackProps {
  id?: string; // PK
  submissionId: string; // FK -> ExerciseSubmission
  instructorId: string; // FK -> User
  comment: string;
  grade?: number;
  createdAt?: Date;
}

export class FeedbackEntity {
  public readonly id?: string;
  public readonly submissionId: string;
  public readonly instructorId: string;
  public comment: string;
  public grade?: number;
  public readonly createdAt: Date;

  constructor(props: FeedbackProps) {
    this.id = props.id;
    this.submissionId = props.submissionId;
    this.instructorId = props.instructorId;
    this.comment = props.comment;
    this.grade = props.grade;
    this.createdAt = props.createdAt ?? new Date();
  }
}
