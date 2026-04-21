export interface CourseProps {
  id?: string; // PK
  title: string;
  description: string;
  isPublished?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CourseEntity {
  public readonly id?: string;
  public title: string;
  public description: string;
  public isPublished: boolean;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: CourseProps) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.isPublished = props.isPublished ?? false;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public publish(): void {
    this.isPublished = true;
    this.updatedAt = new Date();
  }

  public unpublish(): void {
    this.isPublished = false;
    this.updatedAt = new Date();
  }
}
