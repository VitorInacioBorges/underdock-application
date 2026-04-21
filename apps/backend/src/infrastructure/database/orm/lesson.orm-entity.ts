// Representação de cada coluna da tabela 'lessons' no banco
// Cada coluna tem suas propriedades unicas como: primary key, foreign key, date, boolean, type, name, etc.

import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CourseOrmEntity } from './course.orm-entity';

@Entity('lessons') // Nome da tabela no banco
export class LessonOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'course_id' })
    courseId: string;

    @ManyToOne(() => CourseOrmEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'course_id' })
    course: CourseOrmEntity;

    @Column()
    title: string;

    @Column({ name: 'video_id' })
    videoId: string;

    @Column({ type: 'text', nullable: true })
    summary: string;

    @Column({ type: 'jsonb', nullable: true })
    topics: string[];

    @Column({ type: 'int' })
    order: number;

    @Column({ name: 'is_published', default: true })
    isPublished: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
