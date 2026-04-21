import { CourseEntity } from '../../../domain/entities/course.entity';

export class CourseResponseDto {
  id: string;
  title: string;
  description: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;

  static fromEntity(course: CourseEntity): CourseResponseDto {
    const response = new CourseResponseDto();
    response.id = course.id!;
    response.title = course.title;
    response.description = course.description;
    response.isPublished = course.isPublished;
    response.createdAt = (course.createdAt ?? new Date()).toISOString();
    response.updatedAt = (course.updatedAt ?? new Date()).toISOString();

    return response;
  }
}
