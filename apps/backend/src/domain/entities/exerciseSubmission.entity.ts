export enum ExerciseSubmissionStatus {
  pending = 'pending',
  reviewed = 'reviewed',
}

export interface ExerciseSubmissionProps {
  id?: string; // PK
  exerciseId: string; // FK -> Exercise
  userId: string; // FK -> User
  filePath: string;
  status: ExerciseSubmissionStatus;
  submittedAt?: Date;
}

export class ExerciseSubmissionEntity {
  public readonly id?: string;
  public readonly exerciseId: string;
  public readonly userId: string;
  public filePath: string;
  public status: ExerciseSubmissionStatus;
  public readonly submittedAt: Date;

  constructor(props: ExerciseSubmissionProps) {
    this.id = props.id;
    this.exerciseId = props.exerciseId;
    this.userId = props.userId;
    this.filePath = props.filePath;
    this.status = props.status;
    this.submittedAt = props.submittedAt ?? new Date();
  }
}
