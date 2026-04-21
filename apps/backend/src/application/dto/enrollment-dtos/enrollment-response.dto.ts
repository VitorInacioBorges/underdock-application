import { EnrollmentEntity } from '../../../domain/entities/enrollment.entity';

export class EnrollmentResponseDto {
  id: string;
  userId: string;
  courseId: string;
  role: string;
  status: string;
  enrolledAt: string;

  static fromEntity(enrollment: EnrollmentEntity): EnrollmentResponseDto {
    const response = new EnrollmentResponseDto();
    response.id = enrollment.id!;
    response.userId = enrollment.userId;
    response.courseId = enrollment.courseId;
    response.role = enrollment.role;
    response.status = enrollment.status;
    response.enrolledAt = (enrollment.enrolledAt ?? new Date()).toISOString();

    return response;
  }
}
