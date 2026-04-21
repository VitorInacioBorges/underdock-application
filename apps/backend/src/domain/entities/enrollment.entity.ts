export enum EnrollmentRole {
  student = 'student',
  instructor = 'instructor',
}

export enum EnrollmentStatus {
  active = 'active',
  completed = 'completed',
  canceled = 'canceled',
}

export interface EnrollmentProps {
  id?: string; // PK
  userId: string; // FK -> User
  courseId: string; // FK -> Course
  role: EnrollmentRole;
  status: EnrollmentStatus;
  enrolledAt?: Date;
}

export class EnrollmentEntity {
  public readonly id?: string;
  public readonly userId: string;
  public readonly courseId: string;
  public role: EnrollmentRole;
  public status: EnrollmentStatus;
  public readonly enrolledAt: Date;

  constructor(props: EnrollmentProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.courseId = props.courseId;
    this.role = props.role;
    this.status = props.status;
    this.enrolledAt = props.enrolledAt ?? new Date();
  }
}
