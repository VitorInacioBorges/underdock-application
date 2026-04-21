export interface LessonProps {
  id?: string; // PK
  courseId: string; // FK -> Course
  title: string;
  videoId: string;
  summary?: string;
  topics?: string[];
  order: number;
  isPublished?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class LessonEntity {
  public readonly id?: string;
  public readonly courseId: string;
  public title: string;
  public videoId: string;
  public summary?: string;
  public topics?: string[];
  public order: number;
  public isPublished: boolean;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: LessonProps) {
    this.id = props.id;
    this.courseId = props.courseId;
    this.title = props.title;
    this.videoId = props.videoId;
    this.summary = props.summary;
    this.topics = props.topics;
    this.order = props.order;
    this.isPublished = props.isPublished ?? true;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }
}
